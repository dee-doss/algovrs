import React from 'react';

const CodeEditor = ({ code, onChange, language }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  // Language specific templates
  const getTemplate = (lang) => {
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

  React.useEffect(() => {
    onChange(getTemplate(language));
  }, [language]);

  return (
    <div className="h-full flex flex-col">
      {/* Editor */}
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={handleChange}
          className="w-full h-full p-4 font-mono text-sm border-none resize-none focus:outline-none bg-gray-900 text-green-400"
          placeholder="Write your code here..."
          spellCheck="false"
          style={{
            tabSize: 4,
            backgroundColor: '#1a1a1a',
            color: '#00ff00',
            fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
            lineHeight: '1.5'
          }}
        />
        
        {/* Line numbers */}
        <div className="absolute left-0 top-0 p-4 text-gray-500 font-mono text-sm pointer-events-none select-none">
          {code.split('\n').map((_, index) => (
            <div key={index} className="h-[1.5em]">
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Code content with padding for line numbers */}
        <style jsx>{`
          textarea {
            padding-left: 3rem !important;
          }
        `}</style>
      </div>

      {/* Console/Output Panel */}
      <div className="h-1/3 border-t border-gray-200 bg-gray-50">
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">Console</h4>
          <div className="bg-black text-green-400 p-3 rounded font-mono text-sm min-h-[100px] overflow-y-auto">
            <div className="text-gray-500">// Click "Run" to test your code</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;