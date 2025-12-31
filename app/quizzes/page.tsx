'use client';

import { useEffect, useState } from 'react';
import JourneyPath from '@/components/Journey/JourneyPath';
import { ReactLenis } from 'lenis/react';
import { Play, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/api/client';
import CyberLoader from '@/components/ui/CyberLoader';
import { Course } from '@/app/types/course';

export default function QuizzesPage() {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Hardcoded to active course, defaulted to 1
                const { data } = await api.get('/v1/courses/1');
                // Data is now enriched by the backend
                setCourse(data);

            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, []);


    const handleStartLesson = async (lessonId: number) => {
        router.push(`/courses/lessons/${lessonId}`);
    };

    return (
        <ReactLenis root>
            <div className="relative min-h-screen text-white overflow-x-hidden">
                <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                    {loading ? (
                        <div className="flex h-[calc(100vh-250px)] items-center justify-center">
                            <CyberLoader text="ACCESSING ARCHIVES..." />
                        </div>
                    ) : (
                        <JourneyPath
                            course={course}
                            onStartLesson={handleStartLesson}
                        />
                    )}
                </div>
            </div>
        </ReactLenis>
    );
}