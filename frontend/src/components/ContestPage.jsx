import React, { useState } from 'react';
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
  Timer
} from 'lucide-react';

const ContestPage = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingContests = [
    {
      id: 1,
      title: 'Weekly Contest 378',
      startTime: '2025-01-28T10:30:00Z',
      duration: '1h 30m',
      participants: 25678,
      prizes: ['$500', '$300', '$200'],
      difficulty: 'Medium',
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Biweekly Contest 119',
      startTime: '2025-01-30T14:30:00Z',
      duration: '1h 30m',
      participants: 18452,
      prizes: ['$800', '$500', '$300'],
      difficulty: 'Hard',
      status: 'upcoming'
    }
  ];

  const pastContests = [
    {
      id: 3,
      title: 'Weekly Contest 377',
      startTime: '2025-01-21T10:30:00Z',
      duration: '1h 30m',
      participants: 28934,
      myRank: 1247,
      totalProblems: 4,
      solvedProblems: 2,
      status: 'completed'
    },
    {
      id: 4,
      title: 'Biweekly Contest 118',
      startTime: '2025-01-16T14:30:00Z',
      duration: '1h 30m',
      participants: 22156,
      myRank: 892,
      totalProblems: 4,
      solvedProblems: 3,
      status: 'completed'
    }
  ];

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getRankColor = (rank) => {
    if (rank <= 100) return 'text-yellow-600 bg-yellow-100';
    if (rank <= 500) return 'text-orange-600 bg-orange-100';
    if (rank <= 1000) return 'text-blue-600 bg-blue-100';
    return 'text-gray-600 bg-gray-100';
  };

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
          <TabsTrigger value="upcoming">Upcoming Contests</TabsTrigger>
          <TabsTrigger value="past">Past Contests</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingContests.map((contest) => (
            <Card key={contest.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{contest.title}</CardTitle>
                  <Badge variant="outline" className="text-blue-600 border-blue-300">
                    Upcoming
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Start Time</p>
                      <p className="text-sm text-gray-600">{formatDateTime(contest.startTime)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-gray-600">{contest.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Registered</p>
                      <p className="text-sm text-gray-600">{contest.participants.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Prizes</p>
                      <p className="text-sm text-gray-600">{contest.prizes.join(', ')}</p>
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

                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Play className="h-4 w-4 mr-2" />
                    Register
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastContests.map((contest) => (
            <Card key={contest.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{contest.title}</CardTitle>
                  <Badge variant="outline" className="text-gray-600 border-gray-300">
                    Completed
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Date</p>
                      <p className="text-sm text-gray-600">{formatDateTime(contest.startTime)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">My Rank</p>
                      <Badge className={getRankColor(contest.myRank)}>
                        #{contest.myRank}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Total Participants</p>
                      <p className="text-sm text-gray-600">{contest.participants.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Medal className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Problems Solved</p>
                      <p className="text-sm text-gray-600">{contest.solvedProblems}/{contest.totalProblems}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-500">
                    Performance: {Math.round((contest.solvedProblems / contest.totalProblems) * 100)}%
                  </div>

                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContestPage;