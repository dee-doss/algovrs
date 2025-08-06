from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta
import logging

# Import our modules
from models import *
from auth import *
from database import *
from code_executor import code_executor

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create the main app
app = FastAPI(title="LeetCode Clone API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Authentication endpoints
@api_router.post("/auth/register", response_model=UserResponse)
async def register(user_data: UserCreate):
    # Check if user already exists
    existing_user = await get_user_by_username(user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Hash password and create user
    password_hash = get_password_hash(user_data.password)
    user = await create_user(user_data, password_hash)
    
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        profile=user.profile,
        created_at=user.created_at
    )

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await get_user_by_username(user_data.username)
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "user_id": user.id},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user_id: str = Depends(get_current_user_id)):
    user = await get_user_by_id(current_user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        profile=user.profile,
        created_at=user.created_at
    )

# Problem endpoints
@api_router.get("/problems", response_model=List[ProblemSummary])
async def get_problems_list(
    skip: int = 0,
    limit: int = 50,
    difficulty: Optional[str] = None,
    category: Optional[str] = None,
    current_user_id: Optional[str] = Depends(get_current_user_id_optional)
):
    return await get_problems_summary(current_user_id)

@api_router.get("/problems/{problem_id}", response_model=Problem)
async def get_problem_detail(problem_id: str):
    problem = await get_problem_by_id(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem

@api_router.post("/problems", response_model=Problem)
async def create_new_problem(
    problem_data: ProblemCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    return await create_problem(problem_data)

# Code execution endpoints
@api_router.post("/problems/{problem_id}/run", response_model=CodeRunResponse)
async def run_code(
    problem_id: str,
    run_request: CodeRunRequest,
    current_user_id: str = Depends(get_current_user_id)
):
    problem = await get_problem_by_id(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Use first few test cases for running
    test_cases = [(tc.input, tc.expected) for tc in problem.test_cases[:3]]
    result = await code_executor.execute_code(
        run_request.code,
        run_request.language,
        test_cases
    )
    return result

@api_router.post("/problems/{problem_id}/submit", response_model=SubmissionResponse)
async def submit_solution(
    problem_id: str,
    submission_data: SubmissionCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    problem = await get_problem_by_id(problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    
    # Create submission record
    submission = await create_submission(submission_data, current_user_id)
    
    # Execute code against all test cases
    test_cases = [(tc.input, tc.expected) for tc in problem.test_cases]
    result = await code_executor.execute_code(
        submission_data.code,
        submission_data.language,
        test_cases
    )
    
    # Determine submission status
    if result.success:
        submission_status = StatusEnum.ACCEPTED
    elif result.error:
        submission_status = StatusEnum.RUNTIME_ERROR
    else:
        submission_status = StatusEnum.WRONG_ANSWER
    
    # Update submission with results
    await update_submission_status(
        submission.id,
        submission_status,
        len([r for r in result.test_results if r.passed]),
        len(result.test_results),
        result.runtime,
        "42.1 MB",  # Mock memory usage
        result.error
    )
    
    # Update user statistics if accepted
    if submission_status == StatusEnum.ACCEPTED:
        await update_user_stats(current_user_id)
    
    return SubmissionResponse(
        id=submission.id,
        problem_id=submission.problem_id,
        problem_title=problem.title,
        code=submission.code,
        language=submission.language,
        status=submission_status,
        runtime=result.runtime,
        memory="42.1 MB",
        test_cases_passed=len([r for r in result.test_results if r.passed]),
        total_test_cases=len(result.test_results),
        error_message=result.error,
        submitted_at=submission.submitted_at
    )

@api_router.get("/submissions", response_model=List[SubmissionResponse])
async def get_user_submissions(
    current_user_id: str = Depends(get_current_user_id),
    limit: int = 50
):
    return await get_user_submissions(current_user_id, limit)

# Contest endpoints
@api_router.get("/contests", response_model=List[ContestResponse])
async def get_contests_list():
    contests = await get_contests()
    contest_responses = []
    
    for contest in contests:
        # Determine contest status
        now = datetime.utcnow()
        if now < contest.start_time:
            contest_status = "upcoming"
        elif now < contest.start_time + timedelta(minutes=contest.duration_minutes):
            contest_status = "ongoing"
        else:
            contest_status = "completed"
        
        contest_responses.append(ContestResponse(
            id=contest.id,
            title=contest.title,
            description=contest.description,
            start_time=contest.start_time,
            duration_minutes=contest.duration_minutes,
            participants_count=len(contest.participants),
            prizes=contest.prizes,
            difficulty=contest.difficulty,
            status=contest_status
        ))
    
    return contest_responses

@api_router.post("/contests", response_model=Contest)
async def create_new_contest(
    contest_data: ContestCreate,
    current_user_id: str = Depends(get_current_user_id)
):
    return await create_contest(contest_data)

@api_router.post("/contests/{contest_id}/register")
async def register_for_contest(
    contest_id: str,
    current_user_id: str = Depends(get_current_user_id)
):
    contest = await get_contest_by_id(contest_id)
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    
    # Add user to participants (simplified)
    return {"message": "Successfully registered for contest"}

# Health check
@api_router.get("/")
async def root():
    return {"message": "LeetCode Clone API is running!", "version": "1.0.0"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
