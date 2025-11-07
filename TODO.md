## Vercel Gemini Code UI - TODO List

### Level 1: Basic File System Navigation and Search

1.  [x] List all files and directories in the root of the project.
2.  [x] List all files and directories in the `src` directory.
3.  [x] Create a directory named `docs` in the root of the project.
4.  [x] Create a file named `README.md` inside the `docs` directory.
5.  [x] Use `fd` to find all files with the `.js` extension.
6.  [x] Use `fd` to find all files with the `.ts` extension.
7.  [x] Use `fd` to find all files with the `.tsx` extension.
8.  [x] Use `fd` to find all files named `package.json`.
9.  [x] Use `fd` to find all directories named `components`.
10. [x] Use `rg` to search for the text "react" in all files.
11. [x] Use `rg` to search for the text "next" in all files.
12. [x] Use `rg` to search for the text "tailwindcss" in all files.
13. [x] Use `rg` to count the number of occurrences of the text "import" in all files.
14. [x] Use `rg` to find all files that contain the text "TODO".
15. [x] Use `rg` to find all files that contain the text "FIXME".
16. [x] Use `rg` to find all lines that contain the text "console.log".
17. [x] Use `fd` to find all files modified in the last 24 hours.
18. [x] Use `fd` to find all files larger than 1MB.
19. [x] Use `fd` to find all empty files.

### Level 2: Advanced Search and Filtering

21. [x] Use `rg` to find all function declarations in `.ts` and `.tsx` files.
22. [x] Use `rg` to find all React components (classes or functions) in `.tsx` files.
23. [x] Use `rg` to find all `export default` statements in `.ts` and `.tsx` files.
24. [x] Use `rg` to find all `import` statements that import from `react`.
25. [x] Use `rg` to find all `import` statements that import from `next`.
26. [x] Use `jq` to extract the `name` and `version` of the project from `package.json`.
27. [x] Use `jq` to list all the dependencies from `package.json`.
28. [x] Use `jq` to list all the `scripts` from `package.json`.
29. [x] Use `jq` to extract the `compilerOptions.target` from `tsconfig.json`.
30. [x] Use `jq` to extract the `compilerOptions.jsx` from `tsconfig.json`.
31. [x] Use `yq` to extract the `name` of the project from `config.yaml`.
32. [x] Use `rg` to extract the plugin names from `postcss.config.js`.
33. [x] Use `rg` to find all color definitions (hex codes, rgb, etc.) in `tailwind.config.js`.
34. [x] Use `rg` to find all `@media` queries in `src/styles/globals.css`.
35. [x] Use `rg` to find all CSS classes that start with `dark:`.
36. [x] Use `rg` to find all environment variables (e.g., `process.env.XXX`) in the code.
37. [x] Use `rg` to find all API endpoints (e.g., `/api/...`) in the code.
38. [x] Use `rg` to find all `fetch` calls in the code.
39. [x] Use `rg` to find all `axios` calls in the code.
40. [x] Use `rg` to find all `async/await` functions in the code.

### Level 3: Code Analysis with `ast-grep` (Skipped)

41. [ ] Install `ast-grep` if it's not already installed.
42. [ ] Use `ast-grep` to find all `useState` hooks in the project. (Issue: `ast-grep` is not working as expected)
43. [ ] Use `ast-grep` to find all `useEffect` hooks in the project.
44. [ ] Use `ast-grep` to find all `useContext` hooks in the project.
45. [ ] Use `ast-grep` to find all components that use the `Card` component from `@/components/ui/card`.
46. [ ] Use `ast-grep` to find all components that use the `Button` component from `@/components/ui/button`.
47. [ ] Use `ast-grep` to find all components that use the `Input` component from `@/components/ui/input`.
48. [ ] Use `ast-grep` to find all instances of the `fetch` API.
49. [ ] Use `ast-grep` to find all instances of `axios`.
50. [ ] Use `ast-grep` to find all function calls to `console.log`.
51. [ ] Use `ast-grep` to find all function calls to `JSON.stringify`.
52. [ ] Use `ast-grep` to find all arrow functions.
53. [ ] Use `ast-grep` to find all `try...catch` blocks.
54. [ ] Use `ast-grep` to find all `Promise` objects.
55. [ ] Use `ast-grep` to find all `async` functions that do not have an `await` statement.
56. [ ] Use `ast-grep` to find all components that receive a `children` prop.
57. [ ] Use `ast-grep` to find all components that have a `style` prop.
58. [ ] Use `ast-grep` to find all `div` elements with a `className` that includes `flex`.
59. [ ] Use `ast-grep` to find all `img` elements without an `alt` attribute.
60. [ ] Use `ast-grep` to find all `a` elements without a `rel="noreferrer"` when `target="_blank"`.

### Level 4: Code Manipulation and Refactoring

61. [ ] Use `ast-grep` to replace all instances of `console.log` with a custom logger function (e.g., `logger.log`).
62. [ ] Use `ast-grep` to replace all instances of `fetch` with `axios`.
63. [ ] Use `ast-grep` to add a `data-testid` attribute to all `Button` components.
64. [ ] Use `ast-grep` to add a `data-testid` attribute to all `Input` components.
65. [ ] Use `ast-grep` to rename a component (e.g., rename `MyComponent` to `NewComponent`).
66. [ ] Use `ast-grep` to extract a new component from a larger component.
67. [ ] Use `ast-grep` to convert a class component to a functional component.
68. [ ] Use `ast-grep` to convert a `.js` file to a `.ts` file and fix any type errors.
69. [x] Use `sed` to replace a string in a single file.
70. [x] Use `sed` to replace a string in multiple files.
71. [x] Use `sed` to delete all lines containing a specific pattern.
72. [x] Use `awk` to print the first column of a file.
73. [x] Use `awk` to print the last column of a file.
74. [x] Use `awk` to count the number of lines in a file.
75. [x] Use `awk` to count the number of words in a file.
76. [x] Create a script to automatically add a header to all new files.
77. [x] Create a script to automatically format all files in the project.
78. [x] Create a script to automatically run all tests and linters.
79. [x] Create a script to automatically build and deploy the project.
80. [ ] Create a script to automatically generate documentation for the project.

### Level 5: Advanced Workflows and Automation

81. [x] Create a script that uses `fd` and `rg` to find all unused components in the project.
82. [ ] Create a script that uses `ast-grep` to identify and remove dead code. (Skipped: `ast-grep` is not working)
83. [x] Create a script that uses `jq` and `rg` to find all components that are not using i18n.
84. [ ] Create a script that uses `ast-grep` to automatically generate Storybook stories for all components. (Skipped: `ast-grep` is not working)
85. [ ] Integrate the "File Manager" component from `https://v0.app/chat/file-manager-wukORjs2J9p`. (Skipped: Requires login)
86. [ ] Integrate the "AI Chat Interface" from `https://v0.app/community/ai-chat-interface-6VLiqkGu5vw`. (Skipped: Requires login)
87. [ ] Integrate the "Integrations Page" from `https://v0.app/community/integrations-page-7HOUCTcoR5n`. (Skipped: Requires login)
88. [ ] Integrate the "Sidebar Layout" from `https://v0.app/community/sidebar-layout-ybLyeN1sesS`. (Skipped: Requires login)
89. [ ] Integrate the "Action Search Bar" from `https://v0.app/community/action-search-bar-S3nMPSmpQzk`. (Skipped: Requires login)
90. [ ] Integrate the "AI Card Generation" from `https://v0.app/community/ai-card-generation-Tpxvlz16QiJ`. (Skipped: Requires login)
91. [ ] Integrate the "Vercel Tabs" from `https://v0.app/community/vercel-tabs-BT27p0aGPsa`. (Skipped: Requires login)
92. [ ] Integrate the "Animated Beam" from `https://v0.app/community/animated-beam-voQije6wyja`. (Skipped: Requires login)
93. [ ] Integrate the "Image to ASCII" from `https://v0.app/community/image-to-ascii-0UE1nczWzbu`. (Skipped: Requires login)
94. [ ] Integrate the "Documentation Starter" from `https://v0.app/community/documentation-starter-ov3ApgfOdx5`. (Skipped: Requires login)
95. [ ] Integrate the "Admin Dashboard" from `https://v0.app/community/admin-dashboard-yBomF3O9Yu3`. (Skipped: Requires login)
96. [ ] Create a custom workflow that combines `fd`, `rg`, `ast-grep`, `jq`, and `yq` to perform a complex refactoring task. (Partially complete: Created CSS modules)
97. [x] Create a script to automatically update all dependencies to their latest versions and run tests to ensure compatibility.
98. [x] Create a script to automatically generate a changelog from git commit messages.
99. [x] Create a script to automatically publish the project to a package manager (e.g., npm).
100. [x] Create a comprehensive documentation for the entire project, including the architecture, components, and workflows.
