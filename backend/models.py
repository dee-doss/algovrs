from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

class DifficultyEnum(str, Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

class StatusEnum(str, Enum):
    ACCEPTED = "Accepted"
    WRONG_ANSWER = "Wrong Answer"
    TIME_LIMIT_EXCEEDED = "Time Limit Exceeded"
    MEMORY_LIMIT_EXCEEDED = "Memory Limit Exceeded"
    RUNTIME_ERROR = "Runtime Error"
    COMPILATION_ERROR = "Compilation Error"
    PENDING = "Pending"

class LanguageEnum(str, Enum):
    JAVASCRIPT = "javascript"
    PYTHON = "python"
    JAVA = "java"
    CPP = "cpp"

# Problem Models
class Example(BaseModel):
    input: str
    output: str
    explanation: Optional[str] = None

class TestCase(BaseModel):
    input: str
    expected: str

class Problem(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    difficulty: DifficultyEnum
    category: str
    tags: List[str]
    description: str
    examples: List[Example]
    constraints: List[str]
    test_cases: List[TestCase]
    companies: List[str] = []
    likes: int = 0
    dislikes: int = 0
    acceptance_rate: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ProblemCreate(BaseModel):
    title: str
    difficulty: DifficultyEnum
    category: str
    tags: List[str]
    description: str
    examples: List[Example]
    constraints: List[str]
    test_cases: List[TestCase]
    companies: List[str] = []

class ProblemSummary(BaseModel):
    id: str
    title: str
    difficulty: DifficultyEnum
    category: str
    tags: List[str]
    acceptance_rate: float
    likes: int
    solved: bool = False
    attempted: bool = False

# User Models
class UserProfile(BaseModel):
    avatar: Optional[str] = None
    ranking: int = 0
    solved: Dict[str, int] = {"easy": 0, "medium": 0, "hard": 0, "total": 0}
    streak: int = 0
    badges: List[str] = []

class User(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    password_hash: str
    profile: UserProfile = Field(default_factory=UserProfile)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    profile: UserProfile
    created_at: datetime

# Submission Models
class Submission(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    problem_id: str
    code: str
    language: LanguageEnum
    status: StatusEnum = StatusEnum.PENDING
    runtime: Optional[str] = None
    memory: Optional[str] = None
    test_cases_passed: int = 0
    total_test_cases: int = 0
    error_message: Optional[str] = None
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

class SubmissionCreate(BaseModel):
    problem_id: str
    code: str
    language: LanguageEnum

class SubmissionResponse(BaseModel):
    id: str
    problem_id: str
    problem_title: Optional[str] = None
    code: str
    language: LanguageEnum
    status: StatusEnum
    runtime: Optional[str] = None
    memory: Optional[str] = None
    test_cases_passed: int
    total_test_cases: int
    error_message: Optional[str] = None
    submitted_at: datetime

# Code Execution Models
class CodeRunRequest(BaseModel):
    problem_id: str
    code: str
    language: LanguageEnum

class TestResult(BaseModel):
    input: str
    expected: str
    actual: str
    passed: bool

class CodeRunResponse(BaseModel):
    success: bool
    test_results: List[TestResult]
    console_output: str
    error: Optional[str] = None
    runtime: Optional[str] = None

# Contest Models
class Contest(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    start_time: datetime
    duration_minutes: int
    problem_ids: List[str]
    participants: List[str] = []
    prizes: List[str] = []
    difficulty: DifficultyEnum = DifficultyEnum.MEDIUM
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ContestCreate(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: datetime
    duration_minutes: int
    problem_ids: List[str]
    prizes: List[str] = []
    difficulty: DifficultyEnum = DifficultyEnum.MEDIUM

class ContestResponse(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    start_time: datetime
    duration_minutes: int
    participants_count: int
    prizes: List[str]
    difficulty: DifficultyEnum
    status: str  # upcoming, ongoing, completed

# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None