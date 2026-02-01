# TaskFlow - Task Management System

A modern, real-time task management application built with React, TypeScript, and Firebase.

## Features

- **Real-time Collaboration**: All changes sync instantly across devices using Firestore
- **Firebase Authentication**: Secure user authentication with email/password
- **Kanban Board**: Visual task management with drag-and-drop functionality
- **List View**: Detailed task list with sorting and filtering
- **Projects**: Organize tasks into color-coded projects
- **Comments**: Collaborate with team members through task comments
- **Dark Mode**: Eye-friendly dark theme
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- React 18 + TypeScript
- Tailwind CSS
- Firebase (Authentication + Firestore)
- Vite
- React Router v7

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase account (free tier works)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. **Set up Firebase** (Important!):
   - Read the [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) file for detailed instructions
   - Enable Authentication in Firebase Console
   - Create Firestore Database
   - Configure Security Rules

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 in your browser

5. Click "Sign up" to create a new account

## Firebase Setup Required

This app requires Firebase configuration. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for complete setup instructions.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
"# TaskFlow" 
