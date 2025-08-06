import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle2,
  Flame
} from 'lucide-react';
import { mockUser, mockProblems } from '../mock/problems';

const Dashboard = () => {
  const recentProblems = mockProblems.filter(p => p.attempted).slice(0, 5);
  const totalProblems = mockProblems.length;
  const progressPercentage = (mockUser.solved.total / totalProblems) * 100;

  const difficultyStats = [
    { 
      level: 'Easy', 
      solved: mockUser.solved.easy, 
      total: mockProblems.filter(p => p.difficulty === 'Easy').length,
      color: 'text-green-600 bg-green-100'
    },
    { 
      level: 'Medium', 
      solved: mockUser.solved.medium, 
      total: mockProblems.filter(p => p.difficulty === 'Medium').length,
      color: 'text-yellow-600 bg-yellow-100'
    },
    { 
      level: 'Hard', 
      solved: mockUser.solved.hard, 
      total: mockProblems.filter(p => p.difficulty === 'Hard').length,
      color: 'text-red-600 bg-red-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {mockUser.username}!
        </h1>
        <p className="text-gray-600">Keep up the great work on your coding journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Progress Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">
              Problems Solved
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {mockUser.solved.total}
            </div>
            <Progress 
              value={progressPercentage} 
              className="mt-2 h-2" 
            />
            <p className="text-xs text-blue-600 mt-1">
              {progressPercentage.toFixed(1)}% of total problems
            </p>
          </CardContent>
        </Card>

        {/* Ranking Card */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">
              Global Rank
            </CardTitle>
            <Trophy className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              #{mockUser.ranking.toLocaleString()}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2,341 this week
            </p>
          </CardContent>
        </Card>

        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">
              Current Streak
            </CardTitle>
            <Flame className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {mockUser.streak} days
            </div>
            <p className="text-xs text-green-600 mt-1">
              Keep it going! 🔥
            </p>
          </CardContent>
        </Card>

        {/* Study Time Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Study Time
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              4.2h
            </div>
            <p className="text-xs text-purple-600 mt-1">
              This week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress by Difficulty */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Progress by Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {difficultyStats.map((stat) => (
              <div key={stat.level} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Badge className={stat.color}>
                      {stat.level}
                    </Badge>
                    <span className="text-sm font-medium">
                      {stat.solved} / {stat.total} solved
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {Math.round((stat.solved / stat.total) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(stat.solved / stat.total) * 100} 
                  className="h-2"
                />
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <Link to="/problems">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue Solving Problems
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProblems.map((problem) => (
                <div key={problem.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {problem.solved ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <div>
                      <Link 
                        to={`/problems/${problem.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {problem.title}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {problem.difficulty} • {problem.category}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t">
                <Link to="/problems">
                  <Button variant="outline" className="w-full">
                    View All Problems
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Your Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {mockUser.badges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">{badge}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;