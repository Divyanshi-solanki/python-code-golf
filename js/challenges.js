const CHALLENGES = [
  {
    id: 1,
    title: "Sum of List",
    difficulty: "Easy",
    description: "Write a function <code>f(lst)</code> that returns the sum of all numbers in a list.",
    example_input: "[1, 2, 3, 4]",
    example_output: "10",
    starter: "def f(lst):\n    # your code here\n    pass",
    test_cases: [
      { input: "[1,2,3,4]", expected: "10" },
      { input: "[0,0,0]", expected: "0" },
      { input: "[-1,1,2]", expected: "2" },
      { input: "[100]", expected: "100" }
    ],
    par_score: 20,
    hint: "Python has a built-in function for this..."
  },
  {
    id: 2,
    title: "Reverse a String",
    difficulty: "Easy",
    description: "Write a function <code>f(s)</code> that returns the string reversed.",
    example_input: '"hello"',
    example_output: '"olleh"',
    starter: "def f(s):\n    # your code here\n    pass",
    test_cases: [
      { input: '"hello"', expected: '"olleh"' },
      { input: '"abcd"', expected: '"dcba"' },
      { input: '""', expected: '""' },
      { input: '"a"', expected: '"a"' }
    ],
    par_score: 18,
    hint: "Python slicing can reverse in one step."
  },
  {
    id: 3,
    title: "Palindrome Check",
    difficulty: "Easy",
    description: "Write a function <code>f(s)</code> that returns <code>True</code> if the string is a palindrome, else <code>False</code>.",
    example_input: '"racecar"',
    example_output: "True",
    starter: "def f(s):\n    # your code here\n    pass",
    test_cases: [
      { input: '"racecar"', expected: "True" },
      { input: '"hello"', expected: "False" },
      { input: '"madam"', expected: "True" },
      { input: '"a"', expected: "True" }
    ],
    par_score: 22,
    hint: "Compare the string to its reverse."
  },
  {
    id: 4,
    title: "Count Vowels",
    difficulty: "Easy",
    description: "Write a function <code>f(s)</code> that counts the number of vowels (a, e, i, o, u) in a string (case-insensitive).",
    example_input: '"Hello World"',
    example_output: "3",
    starter: "def f(s):\n    # your code here\n    pass",
    test_cases: [
      { input: '"Hello World"', expected: "3" },
      { input: '"aeiou"', expected: "5" },
      { input: '"xyz"', expected: "0" },
      { input: '"AEIOU"', expected: "5" }
    ],
    par_score: 30,
    hint: "Use a generator expression with sum()."
  },
  {
    id: 5,
    title: "FizzBuzz Single",
    difficulty: "Easy",
    description: "Write a function <code>f(n)</code> that returns 'Fizz' if n is divisible by 3, 'Buzz' if by 5, 'FizzBuzz' if both, else the number as a string.",
    example_input: "15",
    example_output: '"FizzBuzz"',
    starter: "def f(n):\n    # your code here\n    pass",
    test_cases: [
      { input: "15", expected: '"FizzBuzz"' },
      { input: "3", expected: '"Fizz"' },
      { input: "5", expected: '"Buzz"' },
      { input: "7", expected: '"7"' }
    ],
    par_score: 45,
    hint: "Check divisibility with %. Order matters — check 15 first!"
  },
  {
    id: 6,
    title: "Max Without max()",
    difficulty: "Medium",
    description: "Write a function <code>f(lst)</code> that returns the maximum value in a list WITHOUT using the built-in <code>max()</code> function.",
    example_input: "[3, 1, 4, 1, 5, 9, 2, 6]",
    example_output: "9",
    starter: "def f(lst):\n    # your code here (no max() allowed!)\n    pass",
    test_cases: [
      { input: "[3,1,4,1,5,9,2,6]", expected: "9" },
      { input: "[-5,-1,-10]", expected: "-1" },
      { input: "[42]", expected: "42" },
      { input: "[0,0,1]", expected: "1" }
    ],
    par_score: 35,
    hint: "Try sorting or using reduce from functools."
  },
  {
    id: 7,
    title: "Flatten Nested List",
    difficulty: "Medium",
    description: "Write a function <code>f(lst)</code> that flattens a one-level nested list into a single list.",
    example_input: "[[1,2],[3,4],[5]]",
    example_output: "[1, 2, 3, 4, 5]",
    starter: "def f(lst):\n    # your code here\n    pass",
    test_cases: [
      { input: "[[1,2],[3,4],[5]]", expected: "[1, 2, 3, 4, 5]" },
      { input: "[[1],[2],[3]]", expected: "[1, 2, 3]" },
      { input: "[[]]", expected: "[]" },
      { input: "[[1,2,3]]", expected: "[1, 2, 3]" }
    ],
    par_score: 25,
    hint: "List comprehension with two loops is very short."
  },
  {
    id: 8,
    title: "Word Frequency",
    difficulty: "Medium",
    description: "Write a function <code>f(s)</code> that returns a dictionary of word frequencies in the string (lowercase, space-separated).",
    example_input: '"the cat sat on the mat"',
    example_output: '{"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}',
    starter: "def f(s):\n    # your code here\n    pass",
    test_cases: [
      { input: '"the cat sat on the mat"', expected: '{"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}' },
      { input: '"a a a"', expected: '{"a": 3}' },
      { input: '"hello"', expected: '{"hello": 1}' }
    ],
    par_score: 40,
    hint: "Counter from collections is your best friend."
  },
  {
    id: 9,
    title: "Find Duplicates",
    difficulty: "Medium",
    description: "Write a function <code>f(lst)</code> that returns a sorted list of all duplicate values in the input list.",
    example_input: "[1, 2, 3, 2, 4, 3, 5]",
    example_output: "[2, 3]",
    starter: "def f(lst):\n    # your code here\n    pass",
    test_cases: [
      { input: "[1,2,3,2,4,3,5]", expected: "[2, 3]" },
      { input: "[1,1,1]", expected: "[1]" },
      { input: "[1,2,3]", expected: "[]" },
      { input: "[4,4,3,3]", expected: "[3, 4]" }
    ],
    par_score: 45,
    hint: "Compare set sizes or use Counter."
  },
  {
    id: 10,
    title: "Caesar Cipher",
    difficulty: "Medium",
    description: "Write a function <code>f(s, n)</code> that encodes string <code>s</code> with a Caesar cipher shift of <code>n</code>. Only shift lowercase letters; leave other characters unchanged.",
    example_input: '"abc", 3',
    example_output: '"def"',
    starter: "def f(s, n):\n    # your code here\n    pass",
    test_cases: [
      { input: '"abc", 3', expected: '"def"' },
      { input: '"xyz", 3', expected: '"abc"' },
      { input: '"hello", 0', expected: '"hello"' },
      { input: '"ab cd", 1', expected: '"bc cd"' }
    ],
    par_score: 55,
    hint: "Use ord() and chr() with modulo 26."
  },
  {
    id: 11,
    title: "Run-Length Encoding",
    difficulty: "Hard",
    description: "Write a function <code>f(s)</code> that performs run-length encoding. Return a string where consecutive duplicates are replaced by count+char.",
    example_input: '"aaabbc"',
    example_output: '"3a2b1c"',
    starter: "def f(s):\n    # your code here\n    pass",
    test_cases: [
      { input: '"aaabbc"', expected: '"3a2b1c"' },
      { input: '"abc"', expected: '"1a1b1c"' },
      { input: '"aaaa"', expected: '"4a"' },
      { input: '"aabb"', expected: '"2a2b"' }
    ],
    par_score: 60,
    hint: "Try itertools.groupby — it groups consecutive elements."
  },
  {
    id: 12,
    title: "Matrix Transpose",
    difficulty: "Hard",
    description: "Write a function <code>f(m)</code> that returns the transpose of a 2D matrix (list of lists).",
    example_input: "[[1,2,3],[4,5,6]]",
    example_output: "[[1, 4], [2, 5], [3, 6]]",
    starter: "def f(m):\n    # your code here\n    pass",
    test_cases: [
      { input: "[[1,2,3],[4,5,6]]", expected: "[[1, 4], [2, 5], [3, 6]]" },
      { input: "[[1,2],[3,4]]", expected: "[[1, 3], [2, 4]]" },
      { input: "[[1],[2],[3]]", expected: "[[1, 2, 3]]" }
    ],
    par_score: 20,
    hint: "zip(*m) is incredibly powerful here."
  },
  {
    id: 13,
    title: "Prime Factors",
    difficulty: "Hard",
    description: "Write a function <code>f(n)</code> that returns a sorted list of all prime factors of <code>n</code>.",
    example_input: "12",
    example_output: "[2, 2, 3]",
    starter: "def f(n):\n    # your code here\n    pass",
    test_cases: [
      { input: "12", expected: "[2, 2, 3]" },
      { input: "28", expected: "[2, 2, 7]" },
      { input: "7", expected: "[7]" },
      { input: "1", expected: "[]" }
    ],
    par_score: 65,
    hint: "Divide by 2 first, then check odd numbers up to sqrt(n)."
  },
  {
    id: 14,
    title: "Balanced Parentheses",
    difficulty: "Hard",
    description: "Write a function <code>f(s)</code> that returns <code>True</code> if the parentheses, brackets, and braces in <code>s</code> are balanced.",
    example_input: '"{[()]}"',
    example_output: "True",
    starter: "def f(s):\n    # your code here\n    pass",
    test_cases: [
      { input: '"{[()]}"', expected: "True" },
      { input: '"([)]"', expected: "False" },
      { input: '""', expected: "True" },
      { input: '"((("', expected: "False" }
    ],
    par_score: 70,
    hint: "Use a stack. Push on open, pop and match on close."
  },
  {
    id: 15,
    title: "Two Sum",
    difficulty: "Hard",
    description: "Write a function <code>f(lst, target)</code> that returns the indices of the two numbers that add up to target as a sorted list. Assume exactly one solution exists.",
    example_input: "[2, 7, 11, 15], 9",
    example_output: "[0, 1]",
    starter: "def f(lst, target):\n    # your code here\n    pass",
    test_cases: [
      { input: "[2,7,11,15], 9", expected: "[0, 1]" },
      { input: "[3,2,4], 6", expected: "[1, 2]" },
      { input: "[3,3], 6", expected: "[0, 1]" }
    ],
    par_score: 55,
    hint: "A hash map (dict) lets you solve this in one pass."
  }
];
