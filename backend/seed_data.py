import asyncio
from database import create_problem, create_contest
from models import ProblemCreate, ContestCreate, DifficultyEnum, Example, TestCase
from datetime import datetime, timedelta

async def seed_database():
    print("🌱 Seeding database with sample data...")
    
    # Sample problems
    problems_data = [
        {
            "title": "Two Sum",
            "difficulty": DifficultyEnum.EASY,
            "category": "Array",
            "tags": ["Array", "Hash Table"],
            "description": """Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.""",
            "examples": [
                Example(
                    input="nums = [2,7,11,15], target = 9",
                    output="[0,1]",
                    explanation="Because nums[0] + nums[1] == 9, we return [0, 1]."
                ),
                Example(
                    input="nums = [3,2,4], target = 6",
                    output="[1,2]",
                    explanation="Because nums[1] + nums[2] == 6, we return [1, 2]."
                )
            ],
            "constraints": [
                "2 <= nums.length <= 10^4",
                "-10^9 <= nums[i] <= 10^9",
                "-10^9 <= target <= 10^9",
                "Only one valid answer exists."
            ],
            "test_cases": [
                TestCase(input="[2,7,11,15]\n9", expected="[0,1]"),
                TestCase(input="[3,2,4]\n6", expected="[1,2]"),
                TestCase(input="[3,3]\n6", expected="[0,1]")
            ],
            "companies": ["Amazon", "Apple", "Google", "Microsoft"]
        },
        {
            "title": "Add Two Numbers",
            "difficulty": DifficultyEnum.MEDIUM,
            "category": "Linked List", 
            "tags": ["Linked List", "Math", "Recursion"],
            "description": """You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.""",
            "examples": [
                Example(
                    input="l1 = [2,4,3], l2 = [5,6,4]",
                    output="[7,0,8]",
                    explanation="342 + 465 = 807."
                )
            ],
            "constraints": [
                "The number of nodes in each linked list is in the range [1, 100].",
                "0 <= Node.val <= 9",
                "It is guaranteed that the list represents a number that does not have leading zeros."
            ],
            "test_cases": [
                TestCase(input="[2,4,3]\n[5,6,4]", expected="[7,0,8]"),
                TestCase(input="[0]\n[0]", expected="[0]"),
                TestCase(input="[9,9,9,9,9,9,9]\n[9,9,9,9]", expected="[8,9,9,9,0,0,0,1]")
            ],
            "companies": ["Meta", "Amazon", "Microsoft", "Apple"]
        },
        {
            "title": "Longest Substring Without Repeating Characters",
            "difficulty": DifficultyEnum.MEDIUM,
            "category": "String",
            "tags": ["Hash Table", "String", "Sliding Window"],
            "description": """Given a string s, find the length of the longest substring without repeating characters.""",
            "examples": [
                Example(
                    input='s = "abcabcbb"',
                    output="3",
                    explanation='The answer is "abc", with the length of 3.'
                ),
                Example(
                    input='s = "bbbbb"',
                    output="1",
                    explanation='The answer is "b", with the length of 1.'
                )
            ],
            "constraints": [
                "0 <= s.length <= 5 * 10^4",
                "s consists of English letters, digits, symbols and spaces."
            ],
            "test_cases": [
                TestCase(input='"abcabcbb"', expected="3"),
                TestCase(input='"bbbbb"', expected="1"),
                TestCase(input='"pwwkew"', expected="3")
            ],
            "companies": ["Amazon", "Microsoft", "Facebook", "Apple", "Google"]
        },
        {
            "title": "Median of Two Sorted Arrays",
            "difficulty": DifficultyEnum.HARD,
            "category": "Array",
            "tags": ["Array", "Binary Search", "Divide and Conquer"],
            "description": """Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).""",
            "examples": [
                Example(
                    input="nums1 = [1,3], nums2 = [2]",
                    output="2.00000",
                    explanation="merged array = [1,2,3] and median is 2."
                )
            ],
            "constraints": [
                "nums1.length == m",
                "nums2.length == n", 
                "0 <= m <= 1000",
                "0 <= n <= 1000",
                "1 <= m + n <= 2000",
                "-10^6 <= nums1[i], nums2[i] <= 10^6"
            ],
            "test_cases": [
                TestCase(input="[1,3]\n[2]", expected="2.00000"),
                TestCase(input="[1,2]\n[3,4]", expected="2.50000")
            ],
            "companies": ["Google", "Amazon", "Microsoft", "Apple"]
        },
        {
            "title": "Longest Palindromic Substring",
            "difficulty": DifficultyEnum.MEDIUM,
            "category": "String",
            "tags": ["String", "Dynamic Programming"],
            "description": """Given a string s, return the longest palindromic substring in s.""",
            "examples": [
                Example(
                    input='s = "babad"',
                    output='"bab"',
                    explanation='"aba" is also a valid answer.'
                )
            ],
            "constraints": [
                "1 <= s.length <= 1000",
                "s consist of only digits and English letters."
            ],
            "test_cases": [
                TestCase(input='"babad"', expected='"bab"'),
                TestCase(input='"cbbd"', expected='"bb"')
            ],
            "companies": ["Amazon", "Microsoft", "Apple", "Google"]
        },
        {
            "title": "Container With Most Water",
            "difficulty": DifficultyEnum.MEDIUM,
            "category": "Array",
            "tags": ["Array", "Two Pointers", "Greedy"],
            "description": """You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container that can hold the most water.

Return the maximum amount of water a container can store.

Notice that you may not slant the container.""",
            "examples": [
                Example(
                    input="height = [1,8,6,2,5,4,8,3,7]",
                    output="49",
                    explanation="The above vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water (blue section) the container can contain is 49."
                )
            ],
            "constraints": [
                "n == height.length",
                "2 <= n <= 10^5",
                "0 <= height[i] <= 10^4"
            ],
            "test_cases": [
                TestCase(input="[1,8,6,2,5,4,8,3,7]", expected="49"),
                TestCase(input="[1,1]", expected="1")
            ],
            "companies": ["Amazon", "Google", "Microsoft", "Facebook"]
        }
    ]
    
    created_problems = []
    for problem_data in problems_data:
        try:
            problem = await create_problem(ProblemCreate(**problem_data))
            created_problems.append(problem)
            print(f"✅ Created problem: {problem.title}")
        except Exception as e:
            print(f"❌ Failed to create problem {problem_data['title']}: {e}")
    
    # Sample contests
    contests_data = [
        {
            "title": "Weekly Contest 378",
            "description": "Weekly programming contest with exciting prizes",
            "start_time": datetime.utcnow() + timedelta(days=7),
            "duration_minutes": 90,
            "problem_ids": [p.id for p in created_problems[:3]],
            "prizes": ["$500", "$300", "$200"],
            "difficulty": DifficultyEnum.MEDIUM
        },
        {
            "title": "Biweekly Contest 119",
            "description": "Challenging biweekly contest for experienced programmers",
            "start_time": datetime.utcnow() + timedelta(days=14),
            "duration_minutes": 90,
            "problem_ids": [p.id for p in created_problems[3:6]],
            "prizes": ["$800", "$500", "$300"],
            "difficulty": DifficultyEnum.HARD
        },
        {
            "title": "Weekly Contest 377",
            "description": "Past contest - completed",
            "start_time": datetime.utcnow() - timedelta(days=7),
            "duration_minutes": 90,
            "problem_ids": [p.id for p in created_problems[:4]],
            "prizes": ["$500", "$300", "$200"],
            "difficulty": DifficultyEnum.MEDIUM
        }
    ]
    
    for contest_data in contests_data:
        try:
            contest = await create_contest(ContestCreate(**contest_data))
            print(f"✅ Created contest: {contest.title}")
        except Exception as e:
            print(f"❌ Failed to create contest {contest_data['title']}: {e}")
    
    print("🎉 Database seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed_database())