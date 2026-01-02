'use client';

import { use } from 'react';
import LessonPlayer from '@/components/LessonPlayer/LessonPlayer';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function LessonPage({ params }: PageProps) {
    const { id } = use(params);
    const lessonId = parseInt(id);

    return <LessonPlayer lessonId={lessonId} />;
}
