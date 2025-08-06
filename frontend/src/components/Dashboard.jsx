import React, { useState, useEffect } from 'react';
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
  Flame,
  Loader2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { problemsAPI, submissionsAPI } from '../services/api';
import AuthModal from './AuthModal';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [problems, setProblems] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [problemsResponse, submissionsResponse] = await Promise.all([
        problemsAPI.getProblems(),
        submissionsAPI.getUserSubmissions(10)
      ]);
      
      setProblems(problemsResponse.data);
      setSubmissions(submissionsResponse.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 rounded-full w-24 h-24 mx-auto mb-6">
                <span className="text-white font-bold text-4xl">LC</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to LeetCode Clone
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A world of programming problems, waiting to be solved
              </p>
              
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <Button 
                  onClick={() => setShowAuthModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3"
                >
                  Get Started
                </Button>
                <Link to="/problems">
                  <Button variant="outline" className="text-lg px-8 py-3">
                    Browse Problems
                  </Button>
                </Link>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-blue-600 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">1000+ Problems</h3>
                <p className="text-gray-600">From easy to hard, covering all major algorithms and data structures</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-time Testing</h3>
                <p className="text-gray-600">Test your code instantly with our integrated execution engine</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4">
                  <Target className="h-6 w-6 text-purple-600 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
                <p className="text-gray-600">Monitor your growth with detailed statistics and achievements</p>
              </div>
            </div>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />
            <p className="mt-2 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const recentProblems = problems.filter(p => p.attempted).slice(0, 5);
  const totalProblems = problems.length;
  const solvedCount = user?.profile?.solved?.total || 0;
  const progressPercentage = totalProblems > 0 ? (solvedCount / totalProblems) * 100 : 0;

  const difficultyStats = [
    { 
      level: 'Easy', 
      solved: user?.profile?.solved?.easy || 0, 
      total: problems.filter(p => p.difficulty === 'Easy').length,
      color: 'text-green-600 bg-green-100'
    },
    { 
      level: 'Medium', 
      solved: user?.profile?.solved?.medium || 0, 
      total: problems.filter(p => p.difficulty === 'Medium').length,
      color: 'text-yellow-600 bg-yellow-100'
    },
    { 
      level: 'Hard', 
      solved: user?.profile?.solved?.hard || 0, 
      total: problems.filter(p => p.difficulty === 'Hard').length,
      color: 'text-red-600 bg-red-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.username}!
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
              {solvedCount}
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
              #{user?.profile?.ranking?.toLocaleString() || 'N/A'}
            </div>
            <p className="text-xs text-orange-600 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Keep solving to improve!
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
              {user?.profile?.streak || 0} days
            </div>
            <p className="text-xs text-green-600 mt-1">
              {user?.profile?.streak > 0 ? 'Keep it going! 🔥' : 'Start your streak today!'}
            </p>
          </CardContent>
        </Card>

        {/* Submissions Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">
              Recent Submissions
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {submissions.length}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              Last 10 submissions
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
                    {stat.total > 0 ? Math.round((stat.solved / stat.total) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={stat.total > 0 ? (stat.solved / stat.total) * 100 : 0} 
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
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.length > 0 ? (
                submissions.slice(0, 5).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {submission.status === 'Accepted' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-red-500" />
                      )}
                      <div>
                        <Link 
                          to={`/problems/${submission.problem_id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          {submission.problem_title}
                        </Link>
                        <p className="text-xs text-gray-500">
                          {submission.status} • {submission.language}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No submissions yet</p>
                  <p className="text-xs text-gray-400">Start solving problems to see your progress here</p>
                </div>
              )}
              
              <div className="pt-4 border-t">
                <Link to="/problems">
                  <Button variant="outline" className="w-full">
                    {submissions.length > 0 ? 'View All Submissions' : 'Start Solving Problems'}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      {user?.profile?.badges && user.profile.badges.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {user.profile.badges.map((badge, index) => (
                <div key={index} className="flex items-center space-x-2 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">{badge}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;