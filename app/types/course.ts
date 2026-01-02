export interface ChallengeOption {
    id: number;
    text: string;
    correct: boolean;
    imageSrc?: string;
    audioSrc?: string;
}

export interface Challenge {
    id: number;
    question: string;
    type: 'SELECT' | 'ASSIST' | 'LEGACY';
    order: number;
    options: ChallengeOption[];
}

export interface Lesson {
    id: number;
    title: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
    order: number;
    challenges: Challenge[];
    isCompleted?: boolean; // Hydrated from progress
    isLocked?: boolean;    // Hydrated from progress
}

export interface Unit {
    id: number;
    title: string;
    description: string;
    order: number;
    lessons: Lesson[];
}

export interface Course {
    id: number;
    title: string;
    description: string;
    imageSrc?: string;
    units: Unit[];
}
