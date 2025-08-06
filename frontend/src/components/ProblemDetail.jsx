import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from './ui/alert';
import { 
  Heart, 
  HeartOff, 
  Share, 
  Play, 
  Send,
  Settings,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { problemsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import CodeEditor from './CodeEditor';

const ProblemDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProblem();
    }
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(getDefaultCode(language));
    }
  }, [language, problem]);

  const fetchProblem = async () => {
    try {
      setLoading(true);
      const response = await problemsAPI.getProblemById(id);
      setProblem(response.data);
    } catch (error) {
      console.error('Failed to fetch problem:', error);
      toast({
        title: "Error",
        description: "Failed to load problem details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCode = (lang) => {
    if (!problem) return '';
    
    switch (lang) {
      case 'python':
        return `def two_sum(nums, target):
    # Write your solution here
    pass`;
      case 'java':
        return `public class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`;
      case 'cpp':
        return `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`;
      default:
        return `function twoSum(nums, target) {
    // Write your solution here
    
}`;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const runTests = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to run your code",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRunning(true);
      setTestResults(null);
      
      const response = await problemsAPI.runCode(id, {
        problem_id: id,
        code: code,
        language: language
      });

      setTestResults(response.data);
      
      if (response.data.success) {
        toast({
          title: "Tests Completed",
          description: `All ${response.data.test_results.length} test cases passed!`,
        });
      } else {
        toast({
          title: "Tests Failed",
          description: "Some test cases failed. Check the results below.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to run code:', error);
      toast({
        title: "Execution Error",
        description: error.response?.data?.detail || "Failed to run code",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const submitSolution = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit your solution",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmissionResult(null);
      
      const response = await problemsAPI.submitCode(id, {
        problem_id: id,
        code: code,
        language: language
      });

      setSubmissionResult(response.data);
      
      if (response.data.status === 'Accepted') {
        toast({
          title: "Accepted! 🎉",
          description: `Solution accepted! Runtime: ${response.data.runtime}`,
        });
      } else {
        toast({
          title: "Submission Failed",
          description: `Status: ${response.data.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to submit solution:', error);
      toast({
        title: "Submission Error",
        description: error.response?.data?.detail || "Failed to submit solution",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-orange-500" />
          <p className="mt-2 text-gray-600">Loading problem...</p>
        </div>
      </div>
    );
  }

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
                      {liked ? (problem.likes || 0) + 1 : (problem.likes || 0)}
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
              {problem.companies && problem.companies.length > 0 && (
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
              )}

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
              <Button variant="ghost" size="sm" onClick={() => setCode(getDefaultCode(language))}>
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                onClick={runTests}
                disabled={isRunning || !isAuthenticated}
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </>
                )}
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={submitSolution}
                disabled={isSubmitting || !isAuthenticated}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="h-full flex flex-col">
            <div className="flex-1">
              <CodeEditor 
                code={code}
                onChange={setCode}
                language={language}
                testResults={testResults}
                submissionResult={submissionResult}
              />
            </div>

            {/* Results Panel */}
            {(testResults || submissionResult) && (
              <div className="border-t border-gray-200 bg-gray-50 p-4 max-h-60 overflow-y-auto">
                {submissionResult && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {submissionResult.status === 'Accepted' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <h4 className="font-semibold">Submission Result: {submissionResult.status}</h4>
                    </div>
                    {submissionResult.status === 'Accepted' && (
                      <div className="text-sm text-gray-600">
                        <p>Runtime: {submissionResult.runtime}</p>
                        <p>Memory: {submissionResult.memory}</p>
                        <p>Test Cases Passed: {submissionResult.test_cases_passed}/{submissionResult.total_test_cases}</p>
                      </div>
                    )}
                    {submissionResult.error_message && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertDescription>{submissionResult.error_message}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {testResults && (
                  <div>
                    <h4 className="font-semibold mb-2">Test Results</h4>
                    {testResults.test_results.map((result, index) => (
                      <div key={index} className="mb-2 p-2 bg-white rounded border">
                        <div className="flex items-center space-x-2">
                          {result.passed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm font-medium">Test Case {index + 1}</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          <p>Input: {result.input}</p>
                          <p>Expected: {result.expected}</p>
                          <p>Actual: {result.actual}</p>
                        </div>
                      </div>
                    ))}
                    {testResults.console_output && (
                      <div className="mt-2">
                        <h5 className="text-sm font-medium mb-1">Console Output:</h5>
                        <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded">
                          {testResults.console_output}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetail;