# Task Management App - Frontend

This directory contains the Next.js/React frontend for the Full-Stack Task Management Application. It provides a clean, responsive user interface for users to manage their tasks.

## 🚀 Features

- **Interactive Dashboard**: A comprehensive overview of task statistics.
- **Full Task Management**: Create, view, edit, and delete tasks.
- **Responsive Design**: A mobile-friendly interface built for all screen sizes.
- **Dark Mode**: A theme toggle for user comfort.

## 🛠️ Tech Stack

- **Framework**: Next.js (with React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui

## ⚙️ Local Setup and Installation

**Prerequisites**: Node.js 18+, npm/yarn.

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the frontend directory. Add the URL of your running backend API:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

The frontend application will now be running at http://localhost:3000.