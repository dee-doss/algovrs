import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Filter, 
  ArrowUpDown,
  Heart,
  MessageSquare
} from 'lucide-react';
import { mockProblems } from '../mock/problems';

const ProblemList = () => {
  const [problems, setProblems] = useState(mockProblems);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    status: 'all',
    category: 'all'
  });
  const [sortBy, setSortBy] = useState('id');

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (solved, attempted) => {
    if (solved) return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    if (attempted) return <Clock className="h-5 w-5 text-yellow-500" />;
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  const filteredProblems = problems.filter(problem => {
    if (filters.difficulty !== 'all' && problem.difficulty !== filters.difficulty) return false;
    if (filters.status !== 'all') {
      if (filters.status === 'solved' && !problem.solved) return false;
      if (filters.status === 'attempted' && !problem.attempted) return false;
      if (filters.status === 'todo' && (problem.solved || problem.attempted)) return false;
    }
    if (filters.category !== 'all' && problem.category !== filters.category) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Problems</h1>
        <p className="text-gray-600">Solve problems to improve your coding skills</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filters:</span>
            </div>
            
            <Select value={filters.difficulty} onValueChange={(value) => setFilters({...filters, difficulty: value})}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters({...filters, status: value})}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
                <SelectItem value="attempted">Attempted</SelectItem>
                <SelectItem value="todo">Todo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Array">Array</SelectItem>
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Linked List">Linked List</SelectItem>
                <SelectItem value="Tree">Tree</SelectItem>
                <SelectItem value="Graph">Graph</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="id">Default</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="acceptance">Acceptance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acceptance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusIcon(problem.solved, problem.attempted)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <Link 
                        to={`/problems/${problem.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-150"
                      >
                        {problem.id}. {problem.title}
                      </Link>
                      <div className="flex items-center space-x-4 ml-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{problem.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-sm">156</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {problem.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {problem.acceptance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {problem.category}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 flex justify-center">
        <div className="text-sm text-gray-500">
          Showing {filteredProblems.length} of {problems.length} problems
        </div>
      </div>
    </div>
  );
};

export default ProblemList;