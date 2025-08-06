# LeetCode Clone - API Contracts & Integration Plan

## 🚀 FRONTEND IMPLEMENTATION STATUS
✅ **COMPLETED FEATURES:**
- **Homepage Dashboard** - User stats, progress tracking, recent activity
- **Problem List** - Filtering, sorting, status indicators
- **Problem Detail** - Split-panel layout with code editor
- **Code Editor** - Multi-language support, syntax highlighting simulation
- **Contest System** - Upcoming/past contests, ranking system
- **Responsive Design** - Mobile-friendly navigation and layouts
- **Header/Navigation** - User menu, search, notifications

## 📊 CURRENT MOCK DATA
Located in `/frontend/src/mock/problems.js`:
- **5 sample problems** with full metadata (difficulty, tags, companies, examples)
- **User profile data** (username, ranking, solved count, streak)
- **Contest data** (upcoming/past contests with rankings)
- **Submission history** mock data

## 🔌 API CONTRACTS FOR BACKEND

### 1. Problems API
```
GET /api/problems
- Returns paginated list of problems
- Filters: difficulty, category, tags, status
- Sort: default, title, difficulty, acceptance rate

GET /api/problems/:id  
- Returns detailed problem data
- Includes description, examples, constraints, test cases

POST /api/problems/:id/submit
- Submit solution code
- Returns execution results, test case outcomes

POST /api/problems/:id/run
- Test code against sample cases
- Returns console output and results
```

### 2. User Authentication & Profile
```
POST /api/auth/login
POST /api/auth/register
GET /api/user/profile
PUT /api/user/profile
GET /api/user/progress
- Returns solved problems, difficulty breakdown, streak data
```

### 3. Contests API
```
GET /api/contests
- Returns upcoming and past contests
POST /api/contests/:id/register
GET /api/contests/:id/leaderboard
GET /api/user/contest-history
```

### 4. Submissions & History  
```
GET /api/submissions
- User's submission history
GET /api/problems/:id/submissions
- Problem-specific submission history
```

## 🗄️ DATABASE SCHEMA REQUIREMENTS

### Problems Collection
```javascript
{
  _id: ObjectId,
  title: String,
  difficulty: String, // Easy, Medium, Hard
  category: String,
  tags: [String],
  description: String,
  examples: [{ input: String, output: String, explanation: String }],
  constraints: [String],
  testCases: [{ input: String, expected: String }],
  companies: [String],
  likes: Number,
  dislikes: Number,
  acceptance: Number,
  createdAt: Date
}
```

### Users Collection  
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // hashed
  profile: {
    avatar: String,
    ranking: Number,
    solved: { easy: Number, medium: Number, hard: Number, total: Number },
    streak: Number,
    badges: [String]
  },
  createdAt: Date
}
```

### Submissions Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  problemId: ObjectId,
  code: String,
  language: String,
  status: String, // Accepted, Wrong Answer, Time Limit Exceeded, etc.
  runtime: String,
  memory: String,
  submittedAt: Date
}
```

## 🔧 INTEGRATION PLAN

### Phase 1: Core Problem System
1. Replace mock data in `ProblemList.jsx` with API calls
2. Update `ProblemDetail.jsx` to fetch real problem data
3. Implement code execution and submission system
4. Update progress tracking in dashboard

### Phase 2: User System
1. Add authentication flow
2. Real user profiles and progress tracking
3. Personal submission history
4. User-specific problem status (solved/attempted)

### Phase 3: Contest System
1. Real contest management
2. Live leaderboards
3. Contest participation and ranking
4. Contest problem submissions

## 🎯 IMMEDIATE BACKEND TASKS
1. **MongoDB Models** - Problems, Users, Submissions, Contests
2. **Authentication** - JWT-based auth with bcrypt password hashing
3. **Problem CRUD** - Full problem management system
4. **Code Execution** - Integrate with code execution service
5. **User Progress** - Real-time progress tracking and statistics

## 🌟 CURRENT FEATURES WORKING
- ✅ Responsive navigation and header
- ✅ Problem filtering and search (frontend logic)
- ✅ Problem detail view with examples/constraints  
- ✅ Code editor with language switching
- ✅ Dashboard with user stats and progress
- ✅ Contest system UI (upcoming/past contests)
- ✅ Mobile-responsive design
- ✅ Clean, modern UI matching LeetCode design

The frontend is **fully functional with mock data** and provides an excellent user experience that closely replicates LeetCode's functionality and design!