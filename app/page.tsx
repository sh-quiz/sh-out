import HeroSection from "@/components/landing/HeroSection";
import LeaderboardPreview from "@/components/landing/LeaderboardPreview";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
    return (
        <main className="min-h-screen bg-sharks-navy text-sharks-white selection:bg-sharks-red selection:text-white">
            <HeroSection />
            <LeaderboardPreview />
            <FeaturesSection />
            <TestimonialsSection />
            <Footer />
        </main>
    );
}
