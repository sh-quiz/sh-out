import { api } from '../app/api/client';

export interface Quiz {
    id: number;
    title: string;
    description: string;
    timeLimit: number;
    passingScore: number;
    totalQuestions?: number;
    userAttemptCount?: number;
    userBestScore?: number;
}

export interface Question {
    id: number;
    text: string;
    type: string;
    choices: any[];
    points: number;
}

export interface QuizDetail extends Quiz {
    questions: Question[];
}

export interface AttemptResponse {
    attemptId: number;
    quizId?: number;
    userId?: number;
    startedAt: string;
    expiresAt: string | null;
    attemptToken: string;
}

export interface SubmitAnswerData {
    questionId: number;
    selectedChoiceId: number;
    idempotencyKey?: string;
}

export interface AnswerDetail {
    questionId: number;
    questionText: string;
    explanation: string | null;
    solution: string | null;
    yourAnswer: {
        choiceId: number;
        choiceText: string;
    };
    isCorrect: boolean;
    correctAnswer: {
        id: number;
        text: string;
        isCorrect: boolean;
    } | null;
    pointsAwarded: number;
    maxPoints: number;
}

export interface AttemptResult {
    id: number;
    quiz: Quiz;
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    completedAt: string;
    timeTaken: number;
    answers: AnswerDetail[];
}

export const quizService = {
    async getAll(): Promise<Quiz[]> {
        const response = await api.get('/v1/quizzes');
        return response.data;
    },

    async getById(id: number): Promise<QuizDetail> {
        const response = await api.get(`/v1/quizzes/${id}`);
        return response.data;
    },

    async startAttempt(quizId: number): Promise<AttemptResponse> {
        const response = await api.post(`/v1/quizzes/${quizId}/start`);
        return response.data;
    },

    async submitAnswer(
        attemptId: number,
        attemptToken: string,
        data: SubmitAnswerData
    ): Promise<any> {
        const response = await api.post(`/v1/attempts/${attemptId}/answer`, data, {
            headers: { 'X-Attempt-Token': attemptToken },
        });
        return response.data;
    },

    async finishAttempt(attemptId: number, attemptToken: string): Promise<any> {
        const response = await api.post(
            `/v1/attempts/${attemptId}/finish`,
            ,
            {
                headers: { 'X-Attempt-Token': attemptToken },
            }
        );
        return response.data;
    },

    async getResult(attemptId: number): Promise<AttemptResult> {
        const response = await api.get(`/v1/attempts/${attemptId}/result`);
        return response.data;
    },
};
