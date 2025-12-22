# Quiz Application Frontend

A minimal Next.js frontend for the quiz application with authentication and quiz-taking functionality.

## Features

- **Authentication**: Login and signup
- **Quiz Listing**: Browse available quizzes
- **Quiz Player**: Take quizzes with support for:
  - Single choice questions
  - Multiple choice questions
  - True/False questions
  - Short answer questions
- **Results**: View quiz scores and detailed results

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` file:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4000
   ```

3. Start the backend server (ensure it's running on port 4000)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 16** - React framework
- **Axios** - HTTP client
- **TypeScript** - Type safety
- **Tailwind CSS** - Minimal styling

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                    # Home page (auth + quiz list)
│   ├── quizzes/[id]/
│   │   └── page.tsx                # Quiz player page
│   └── attempts/[id]/result/
│       └── page.tsx                # Quiz result page
├── components/
│   ├── Auth/
│   │   ├── LoginForm.tsx           # Login form
│   │   └── SignupForm.tsx          # Signup form
│   └── QuizPlayer/
│       ├── QuizList.tsx            # Quiz listing
│       ├── QuizPlayer.tsx          # Quiz player
│       └── QuizResult.tsx          # Result display
└── lib/
    ├── api.ts                      # Axios configuration
    ├── auth.ts                     # Auth service
    └── quiz.ts                     # Quiz service
```

## API Integration

The app connects to the backend API with the following endpoints:

- `POST /auth/signup` - User registration
- `POST /auth` - User login
- `POST /auth/logout` - User logout
- `GET /v1/quizzes` - Get all quizzes
- `GET /v1/quizzes/:id` - Get quiz details
- `POST /v1/quizzes/:id/start` - Start quiz attempt
- `POST /v1/attempts/:id/answer` - Submit answer
- `POST /v1/attempts/:id/finish` - Finish attempt
- `GET /v1/attempts/:id/result` - Get result

## Usage

1. **Sign up** or **Login** on the home page
2. **Browse quizzes** in the main list
3. **Click "Start Quiz"** to begin an attempt
4. **Answer questions** one by one
5. **View results** after completing the quiz