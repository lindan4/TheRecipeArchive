# The Recipe Archive

The Recipe Archive is a React + TypeScript web app for discovering meals, viewing recipe details, and saving favourites to your account.

## Features

- Search meals by keyword (TheMealDB API)
- Discover a random recipe from the home page
- View detailed meal info, including ingredients and instructions
- Create an account / log in with Firebase Authentication
- Save and manage favourites in Firestore
- Update profile name and password
- Responsive navigation for desktop and mobile

## Tech Stack

- React 19 + TypeScript
- Vite 6
- React Router 7
- Redux Toolkit + React Redux
- Material UI (MUI)
- Firebase (Authentication + Firestore)
- Vitest + Testing Library

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Install

```bash
npm install
```

### Configure Environment

Create a local `.env` file from `.env.example` and fill in your Firebase project values:

```bash
cp .env.example .env
```

Required variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Run Locally

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Type-check and build for production
- `npm run preview` - Preview the production build locally
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run deploy` - Deploy `dist/` to GitHub Pages

## Project Structure

```text
src/
  app/                # App shell, routes, Redux store
  features/
    navigation/       # Header/dashboard UI
    recipes/          # Meal search, details, favourites
    profile/          # User profile settings
    user/             # Auth API and user state
    error/            # Error page
  shared/             # Firebase setup, hooks, constants
```

## Deployment

Production builds are configured for GitHub Pages with base path:

`/juno_react_project/`

This is set in `vite.config.ts`.
