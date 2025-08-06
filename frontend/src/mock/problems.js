export const mockProblems = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array",
    tags: ["Array", "Hash Table"],
    solved: true,
    attempted: true,
    likes: 32567,
    dislikes: 1243,
    acceptance: "51.2%",
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6", 
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    companies: ["Amazon", "Apple", "Google", "Microsoft"]
  },
  {
    id: 2,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    tags: ["Linked List", "Math", "Recursion"],
    solved: false,
    attempted: true,
    likes: 23456,
    dislikes: 4321,
    acceptance: "38.7%",
    description: `You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807."
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ],
    companies: ["Meta", "Amazon", "Microsoft", "Apple"]
  },
  {
    id: 3,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String",
    tags: ["Hash Table", "String", "Sliding Window"],
    solved: false,
    attempted: false,
    likes: 28765,
    dislikes: 1205,
    acceptance: "33.8%",
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: 'The answer is "b", with the length of 1.'
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    companies: ["Amazon", "Microsoft", "Facebook", "Apple", "Google"]
  },
  {
    id: 4,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    solved: false,
    attempted: false,
    likes: 19874,
    dislikes: 2341,
    acceptance: "36.2%",
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      }
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ],
    companies: ["Google", "Amazon", "Microsoft", "Apple"]
  },
  {
    id: 5,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "String",
    tags: ["String", "Dynamic Programming"],
    solved: true,
    attempted: true,
    likes: 23456,
    dislikes: 1432,
    acceptance: "32.4%",
    description: `Given a string s, return the longest palindromic substring in s.`,
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.'
      }
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ],
    companies: ["Amazon", "Microsoft", "Apple", "Google"]
  }
];

export const mockTestCases = {
  1: [
    { input: "[2,7,11,15]\n9", output: "[0,1]", expected: "[0,1]" },
    { input: "[3,2,4]\n6", output: "[1,2]", expected: "[1,2]" },
    { input: "[3,3]\n6", output: "[0,1]", expected: "[0,1]" }
  ]
};

export const mockSubmissions = [
  {
    id: 1,
    problemId: 1,
    language: "javascript",
    code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
    status: "Accepted",
    runtime: "76 ms",
    memory: "42.1 MB",
    timestamp: "2025-01-27T10:30:00Z"
  }
];

export const mockUser = {
  username: "codingmasterai",
  avatar: "https://ui-avatars.com/api/?name=CM&background=4f46e5&color=ffffff",
  ranking: 125467,
  solved: {
    easy: 87,
    medium: 45,
    hard: 12,
    total: 144
  },
  streak: 23,
  badges: ["Problem Solver", "Code Warrior", "Algorithm Explorer"]
};