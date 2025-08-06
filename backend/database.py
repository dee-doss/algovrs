from motor.motor_asyncio import AsyncIOMotorClient
from models import *
from typing import List, Optional, Dict
import os

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'leetcode_clone')]

# Collections
problems_collection = db.problems
users_collection = db.users
submissions_collection = db.submissions
contests_collection = db.contests

# Problem operations
async def create_problem(problem: ProblemCreate) -> Problem:
    problem_doc = Problem(**problem.dict())
    result = await problems_collection.insert_one(problem_doc.dict())
    problem_doc.id = str(result.inserted_id)
    return problem_doc

async def get_problem_by_id(problem_id: str) -> Optional[Problem]:
    doc = await problems_collection.find_one({"id": problem_id})
    if doc:
        return Problem(**doc)
    return None

async def get_problems(
    skip: int = 0, 
    limit: int = 20,
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
    tags: Optional[List[str]] = None
) -> List[Problem]:
    query = {}
    if difficulty:
        query["difficulty"] = difficulty
    if category:
        query["category"] = category
    if tags:
        query["tags"] = {"$in": tags}
    
    cursor = problems_collection.find(query).skip(skip).limit(limit)
    problems = []
    async for doc in cursor:
        problems.append(Problem(**doc))
    return problems

async def get_problems_summary(user_id: Optional[str] = None) -> List[ProblemSummary]:
    problems = await get_problems(limit=1000)  # Get all problems for summary
    summaries = []
    
    user_submissions = {}
    if user_id:
        # Get user's submission status for each problem
        cursor = submissions_collection.find({"user_id": user_id})
        async for sub in cursor:
            problem_id = sub["problem_id"]
            if problem_id not in user_submissions:
                user_submissions[problem_id] = {"solved": False, "attempted": False}
            if sub["status"] == StatusEnum.ACCEPTED:
                user_submissions[problem_id]["solved"] = True
            user_submissions[problem_id]["attempted"] = True
    
    for problem in problems:
        status = user_submissions.get(problem.id, {"solved": False, "attempted": False})
        summary = ProblemSummary(
            id=problem.id,
            title=problem.title,
            difficulty=problem.difficulty,
            category=problem.category,
            tags=problem.tags,
            acceptance_rate=problem.acceptance_rate,
            likes=problem.likes,
            solved=status["solved"],
            attempted=status["attempted"]
        )
        summaries.append(summary)
    
    return summaries

# User operations
async def create_user(user_data: UserCreate, password_hash: str) -> User:
    user_doc = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=password_hash
    )
    await users_collection.insert_one(user_doc.dict())
    return user_doc

async def get_user_by_username(username: str) -> Optional[User]:
    doc = await users_collection.find_one({"username": username})
    if doc:
        return User(**doc)
    return None

async def get_user_by_id(user_id: str) -> Optional[User]:
    doc = await users_collection.find_one({"id": user_id})
    if doc:
        return User(**doc)
    return None

async def update_user_profile(user_id: str, profile_update: Dict):
    await users_collection.update_one(
        {"id": user_id},
        {"$set": {f"profile.{k}": v for k, v in profile_update.items()}}
    )

async def update_user_stats(user_id: str):
    """Update user's solved problems statistics"""
    # Count solved problems by difficulty
    pipeline = [
        {"$match": {"user_id": user_id, "status": StatusEnum.ACCEPTED}},
        {"$lookup": {
            "from": "problems",
            "localField": "problem_id", 
            "foreignField": "id",
            "as": "problem"
        }},
        {"$unwind": "$problem"},
        {"$group": {
            "_id": "$problem.difficulty",
            "count": {"$sum": 1}
        }}
    ]
    
    cursor = submissions_collection.aggregate(pipeline)
    stats = {"easy": 0, "medium": 0, "hard": 0, "total": 0}
    
    async for result in cursor:
        difficulty = result["_id"].lower()
        count = result["count"]
        stats[difficulty] = count
        stats["total"] += count
    
    await update_user_profile(user_id, {"solved": stats})

# Submission operations
async def create_submission(submission: SubmissionCreate, user_id: str) -> Submission:
    submission_doc = Submission(user_id=user_id, **submission.dict())
    await submissions_collection.insert_one(submission_doc.dict())
    return submission_doc

async def update_submission_status(
    submission_id: str, 
    status: StatusEnum, 
    test_cases_passed: int,
    total_test_cases: int,
    runtime: Optional[str] = None,
    memory: Optional[str] = None,
    error_message: Optional[str] = None
):
    update_data = {
        "status": status,
        "test_cases_passed": test_cases_passed,
        "total_test_cases": total_test_cases
    }
    if runtime:
        update_data["runtime"] = runtime
    if memory:
        update_data["memory"] = memory
    if error_message:
        update_data["error_message"] = error_message
        
    await submissions_collection.update_one(
        {"id": submission_id},
        {"$set": update_data}
    )

async def get_user_submissions(user_id: str, limit: int = 50) -> List[SubmissionResponse]:
    cursor = submissions_collection.find({"user_id": user_id}).sort("submitted_at", -1).limit(limit)
    submissions = []
    
    async for doc in cursor:
        # Get problem title
        problem = await get_problem_by_id(doc["problem_id"])
        problem_title = problem.title if problem else "Unknown Problem"
        
        submission = SubmissionResponse(
            problem_title=problem_title,
            **doc
        )
        submissions.append(submission)
    
    return submissions

# Contest operations
async def create_contest(contest: ContestCreate) -> Contest:
    contest_doc = Contest(**contest.dict())
    await contests_collection.insert_one(contest_doc.dict())
    return contest_doc

async def get_contests() -> List[Contest]:
    cursor = contests_collection.find().sort("start_time", -1)
    contests = []
    async for doc in cursor:
        contests.append(Contest(**doc))
    return contests

async def get_contest_by_id(contest_id: str) -> Optional[Contest]:
    doc = await contests_collection.find_one({"id": contest_id})
    if doc:
        return Contest(**doc)
    return None