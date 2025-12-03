import Hero from "@/components/LandingPage/Hero";
import HowItWorks from "@/components/LandingPage/HowItWorks";
import Features from "@/components/LandingPage/Features";
import Categories from "@/components/LandingPage/Categories";
import Leaderboard from "@/components/LandingPage/Leaderboard";
import Testimonials from "@/components/LandingPage/Testimonials";
import CTA from "@/components/LandingPage/CTA";
import Footer from "@/components/LandingPage/Footer";

export default function Home() {
    return (
        <main className="bg-[#0B0E12] min-h-screen">
            <Hero />
            <HowItWorks />
            <Features />
            <Categories />
            <Leaderboard />
            <Testimonials />
            <CTA />
            <Footer />
        </main>
    );
}
