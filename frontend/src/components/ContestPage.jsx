import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Trophy, 
  Clock, 
  Users, 
  Calendar, 
  Play,
  Medal,
  Timer,
  Loader2
} from 'lucide-react';
import { contestsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const ContestPage = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      setLoading(true);
      const response = await contestsAPI.getContests();
      setContests(response.data);
    } catch (error) {
      console.error('Failed to fetch contests:', error);
      toast({
        title: "Error",
        description: "Failed to load contests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (contestId) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to register for contests",
        variant: "destructive",
      });
      return;
    }

    try {
      await contestsAPI.registerForContest(contestId);
      toast({
        title: "Registration Successful",
        description: "You have been registered for the contest!",
      });
    } catch (error) {
      console.error('Failed to register for contest:', error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.detail || "Failed to register for contest",
        variant: "destructive",
      });
    }
  };

  const upcomingContests = contests.filter(c => c.status === 'upcoming');
  const pastContests = contests.filter(c => c.status === 'completed');

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDurationText = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getRankColor = (rank) => {
    if (rank <= 100) return 'text-yellow-600 bg-yellow-100';
    if (rank <= 500) return 'text-orange-600 bg-orange-100';
    if (rank <= 1000) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />
            <p className="mt-2 text-gray-600">Loading contests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contests</h1>
        <p className="text-gray-600">Participate in coding contests and compete with developers worldwide</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-blue-700">Contest Rating</p>
                <p className="text-2xl font-bold text-blue-900">1547</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Medal className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-green-700">Best Rank</p>
                <p className="text-2xl font-bold text-green-900">47th</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-purple-700">Participated</p>
                <p className="text-2xl font-bold text-purple-900">23</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-red-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Timer className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-orange-700">Avg. Time</p>
                <p className="text-2xl font-bold text-orange-900">78m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contest Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upcoming">Upcoming Contests ({upcomingContests.length})</TabsTrigger>
          <TabsTrigger value="past">Past Contests ({pastContests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingContests.length > 0 ? (
            upcomingContests.map((contest) => (
              <Card key={contest.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{contest.title}</CardTitle>
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      Upcoming
                    </Badge>
                  </div>
                  {contest.description && (
                    <p className="text-gray-600 text-sm">{contest.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Start Time</p>
                        <p className="text-sm text-gray-600">{formatDateTime(contest.start_time)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-gray-600">{getDurationText(contest.duration_minutes)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Registered</p>
                        <p className="text-sm text-gray-600">{contest.participants_count.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Prizes</p>
                        <p className="text-sm text-gray-600">
                          {contest.prizes.length > 0 ? contest.prizes.slice(0, 2).join(', ') : 'None'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <Badge className={
                      contest.difficulty === 'Easy' ? 'text-green-600 bg-green-100' :
                      contest.difficulty === 'Medium' ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }>
                      {contest.difficulty}
                    </Badge>

                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleRegister(contest.id)}
                      disabled={!isAuthenticated}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {isAuthenticated ? 'Register' : 'Sign in to Register'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No upcoming contests</p>
              <p className="text-sm text-gray-500">Check back later for new contests!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastContests.length > 0 ? (
            pastContests.map((contest) => (
              <Card key={contest.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{contest.title}</CardTitle>
                    <Badge variant="outline" className="text-gray-600 border-gray-300">
                      Completed
                    </Badge>
                  </div>
                  {contest.description && (
                    <p className="text-gray-600 text-sm">{contest.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Date</p>
                        <p className="text-sm text-gray-600">{formatDateTime(contest.start_time)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">My Rank</p>
                        <Badge className="text-xs">
                          #1247
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Total Participants</p>
                        <p className="text-sm text-gray-600">{contest.participants_count.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Medal className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Problems Solved</p>
                        <p className="text-sm text-gray-600">2/4</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500">
                      Performance: 50%
                    </div>

                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No past contests</p>
              <p className="text-sm text-gray-500">Participate in contests to see your history here!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContestPage;