import asyncio
import tempfile
import os
import subprocess
import time
from typing import List, Tuple
from models import LanguageEnum, TestResult, CodeRunResponse

class CodeExecutor:
    def __init__(self):
        self.timeout = 5  # 5 seconds timeout
        self.memory_limit = 128  # 128MB memory limit

    async def execute_code(
        self, 
        code: str, 
        language: LanguageEnum, 
        test_cases: List[Tuple[str, str]]
    ) -> CodeRunResponse:
        """Execute code against test cases"""
        try:
            if language == LanguageEnum.JAVASCRIPT:
                return await self._execute_javascript(code, test_cases)
            elif language == LanguageEnum.PYTHON:
                return await self._execute_python(code, test_cases)
            elif language == LanguageEnum.JAVA:
                return await self._execute_java(code, test_cases)
            elif language == LanguageEnum.CPP:
                return await self._execute_cpp(code, test_cases)
            else:
                return CodeRunResponse(
                    success=False,
                    test_results=[],
                    console_output="",
                    error="Unsupported language"
                )
        except Exception as e:
            return CodeRunResponse(
                success=False,
                test_results=[],
                console_output="",
                error=f"Execution error: {str(e)}"
            )

    async def _execute_javascript(self, code: str, test_cases: List[Tuple[str, str]]) -> CodeRunResponse:
        """Execute JavaScript code"""
        test_results = []
        console_output = ""
        
        for test_input, expected_output in test_cases:
            try:
                # Create a temporary file with the code
                with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                    # Wrap code to handle input/output
                    wrapped_code = f"""
{code}

// Parse input
const input = `{test_input}`.trim().split('\\n');
const nums = JSON.parse(input[0]);
const target = parseInt(input[1]);

// Execute function
const result = twoSum(nums, target);
console.log(JSON.stringify(result));
"""
                    f.write(wrapped_code)
                    f.flush()
                    
                    # Execute with Node.js
                    process = await asyncio.create_subprocess_exec(
                        'node', f.name,
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.PIPE
                    )
                    
                    try:
                        stdout, stderr = await asyncio.wait_for(
                            process.communicate(), 
                            timeout=self.timeout
                        )
                        
                        actual_output = stdout.decode().strip()
                        error_output = stderr.decode().strip()
                        
                        if error_output:
                            console_output += f"Error: {error_output}\n"
                        
                        passed = actual_output == expected_output
                        test_results.append(TestResult(
                            input=test_input,
                            expected=expected_output,
                            actual=actual_output,
                            passed=passed
                        ))
                        
                    except asyncio.TimeoutError:
                        process.kill()
                        test_results.append(TestResult(
                            input=test_input,
                            expected=expected_output,
                            actual="",
                            passed=False
                        ))
                        console_output += "Time Limit Exceeded\n"
                    
                    finally:
                        os.unlink(f.name)
                        
            except Exception as e:
                test_results.append(TestResult(
                    input=test_input,
                    expected=expected_output,
                    actual="",
                    passed=False
                ))
                console_output += f"Runtime Error: {str(e)}\n"
        
        all_passed = all(result.passed for result in test_results)
        return CodeRunResponse(
            success=all_passed,
            test_results=test_results,
            console_output=console_output,
            runtime=f"{len(test_results) * 50}ms"  # Mock runtime
        )

    async def _execute_python(self, code: str, test_cases: List[Tuple[str, str]]) -> CodeRunResponse:
        """Execute Python code"""
        test_results = []
        console_output = ""
        
        for test_input, expected_output in test_cases:
            try:
                with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                    wrapped_code = f"""
{code}

# Parse input
input_lines = '''{test_input}'''.strip().split('\\n')
nums = eval(input_lines[0])
target = int(input_lines[1])

# Execute function
result = twoSum(nums, target)
print(result)
"""
                    f.write(wrapped_code)
                    f.flush()
                    
                    process = await asyncio.create_subprocess_exec(
                        'python3', f.name,
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.PIPE
                    )
                    
                    try:
                        stdout, stderr = await asyncio.wait_for(
                            process.communicate(), 
                            timeout=self.timeout
                        )
                        
                        actual_output = stdout.decode().strip()
                        error_output = stderr.decode().strip()
                        
                        if error_output:
                            console_output += f"Error: {error_output}\n"
                        
                        # Normalize output format
                        try:
                            actual_list = eval(actual_output)
                            expected_list = eval(expected_output)
                            passed = actual_list == expected_list
                        except:
                            passed = actual_output == expected_output
                            
                        test_results.append(TestResult(
                            input=test_input,
                            expected=expected_output,
                            actual=actual_output,
                            passed=passed
                        ))
                        
                    except asyncio.TimeoutError:
                        process.kill()
                        test_results.append(TestResult(
                            input=test_input,
                            expected=expected_output,
                            actual="",
                            passed=False
                        ))
                        console_output += "Time Limit Exceeded\n"
                    
                    finally:
                        os.unlink(f.name)
                        
            except Exception as e:
                test_results.append(TestResult(
                    input=test_input,
                    expected=expected_output,
                    actual="",
                    passed=False
                ))
                console_output += f"Runtime Error: {str(e)}\n"
        
        all_passed = all(result.passed for result in test_results)
        return CodeRunResponse(
            success=all_passed,
            test_results=test_results,
            console_output=console_output,
            runtime=f"{len(test_results) * 45}ms"  # Mock runtime
        )

    async def _execute_java(self, code: str, test_cases: List[Tuple[str, str]]) -> CodeRunResponse:
        """Execute Java code (simplified mock)"""
        # For demo purposes, return mock results
        test_results = []
        for test_input, expected_output in test_cases:
            test_results.append(TestResult(
                input=test_input,
                expected=expected_output,
                actual=expected_output,  # Mock success
                passed=True
            ))
        
        return CodeRunResponse(
            success=True,
            test_results=test_results,
            console_output="Java execution completed successfully (mock)",
            runtime="120ms"
        )

    async def _execute_cpp(self, code: str, test_cases: List[Tuple[str, str]]) -> CodeRunResponse:
        """Execute C++ code (simplified mock)"""
        # For demo purposes, return mock results
        test_results = []
        for test_input, expected_output in test_cases:
            test_results.append(TestResult(
                input=test_input,
                expected=expected_output,
                actual=expected_output,  # Mock success
                passed=True
            ))
        
        return CodeRunResponse(
            success=True,
            test_results=test_results,
            console_output="C++ execution completed successfully (mock)",
            runtime="95ms"
        )

# Global executor instance
code_executor = CodeExecutor()