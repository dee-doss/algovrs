import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { 
  Heart, 
  HeartOff, 
  Share, 
  Play, 
  Send,
  Settings,
  RotateCcw,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { mockProblems, mockTestCases } from '../mock/problems';
import CodeEditor from './CodeEditor';

const ProblemDetail = () => {
  const { id } = useParams();
  const problem = mockProblems.find(p => p.id === parseInt(id));
  const [liked, setLiked] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Write your solution here
    
}`);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);

  if (!problem) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Problem not found</h2>
          <p className="text-gray-600">The problem you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const runTests = () => {
    // Mock test execution
    console.log('Running tests...');
  };

  const submitSolution = () => {
    // Mock submission
    console.log('Submitting solution...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Panel - Problem Description */}
        <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          isDescriptionExpanded ? 'w-1/2' : 'w-12'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className={`text-xl font-bold text-gray-900 ${!isDescriptionExpanded && 'hidden'}`}>
              {problem.title}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? <ChevronUp /> : <ChevronDown />}
            </Button>
          </div>

          {isDescriptionExpanded && (
            <div className="p-4 overflow-y-auto h-full">
              {/* Problem Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Badge className={getDifficultyColor(problem.difficulty)}>
                    {problem.difficulty}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLiked(!liked)}
                      className={liked ? 'text-red-500' : 'text-gray-500'}
                    >
                      {liked ? <Heart className="h-4 w-4 fill-current" /> : <HeartOff className="h-4 w-4" />}
                      {liked ? problem.likes + 1 : problem.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Share className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {problem.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Companies */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Companies:</p>
                <div className="flex flex-wrap gap-2">
                  {problem.companies.map((company, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>

              {/* Examples */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="font-medium text-gray-900 mb-2">Example {index + 1}:</p>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-gray-700">Input:</span>
                        <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                          {example.input}
                        </code>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Output:</span>
                        <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                          {example.output}
                        </code>
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="font-medium text-gray-700">Explanation:</span>
                          <span className="ml-2 text-gray-600">{example.explanation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Constraints */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Constraints</h3>
                <ul className="list-disc list-inside space-y-1">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-gray-700 text-sm">
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">
                        {constraint}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Code Editor */}
        <div className={`bg-white transition-all duration-300 ${
          isDescriptionExpanded ? 'w-1/2' : 'flex-1'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCode('')}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={runTests}>
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={submitSolution}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit
              </Button>
            </div>
          </div>

          <div className="h-full">
            <CodeEditor 
              code={code}
              onChange={setCode}
              language={language}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;