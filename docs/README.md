# Gemini Code UI

This is a Next.js application with TypeScript and Tailwind CSS.

## Features

- File Manager with drag & drop
- Code Editor with syntax highlighting
- AI Chat Interface
- Analytics Dashboard
- Team Management
- Settings Panel

## Getting Started

1. Install dependencies
2. Run the development server
3. Open http://localhost:3000

## Project Structure

- `src/app/` - Next.js App Router pages
- `src/components/` - Reusable components
- `src/lib/` - Utilities and configurations

## Project Architecture

The project follows a standard Next.js App Router architecture. The frontend is built with React and Tailwind CSS, and the backend is powered by Next.js API routes.

## Components

The project uses a combination of custom components and components from the shadcn/ui library. The custom components are located in the `src/components` directory and are organized by feature.

## Workflows

The project includes several automated workflows to streamline the development process:

- **Formatting:** The `scripts/format.sh` script uses `prettier` to format all the files in the project.
- **Testing and Linting:** The `scripts/test.sh` script runs the linter and tests.
- **Documentation:** The `scripts/docs.sh` script uses `jsdoc` to generate documentation from the JSDoc comments in the code.
- **Deployment:** The `scripts/deploy.sh` script builds the project and deploys it to Vercel.

## Technologies Used

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI