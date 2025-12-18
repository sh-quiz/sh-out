import QuizResult from '@/components/QuizPlayer/QuizResult';

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const attemptId = parseInt(id);

    return <QuizResult attemptId={attemptId} />;
}
