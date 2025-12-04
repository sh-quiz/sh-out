'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Building2, Lock, Diamond } from 'lucide-react';
import Lenis from 'lenis';

// Components
import AuthInput from '@/components/Auth/AuthInput';
import GoogleButton from '@/components/Auth/GoogleButton';
import ParticleBackground from '@/components/ui/ParticleBackground';

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const isAuth = authService.isAuthenticated();
    setIsAuthenticated(isAuth);

    // Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 relative overflow-hidden flex flex-col items-center justify-center">
      <ParticleBackground />

      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      {/* Bottom Lens Flare Glow */}
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

      <main className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">

        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 rounded-full bg-[#0D1117] border border-blue-500/30 flex items-center justify-center mb-6 relative shadow-[0_0_40px_rgba(0,122,255,0.3)]"
          >
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl" />
            <Diamond className="w-10 h-10 text-[#007AFF] fill-[#007AFF]/20" />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">E-Quiz</h1>
          <p className="text-[#878D96] text-sm font-light tracking-wide">Master Anything.</p>
        </motion.div>

        {/* Form Section */}
        <form className="w-full space-y-2 mb-8" onSubmit={(e) => e.preventDefault()}>
          <AuthInput
            label="Full Name"
            type="text"
            icon={User}
            placeholder="Enter your full name"
            delay={0.1}
          />
          <AuthInput
            label="School / Institution"
            type="text"
            icon={Building2}
            placeholder="Enter your school or institution"
            delay={0.2}
          />
          <AuthInput
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            delay={0.3}
          />
        </form>

        {/* Google Button */}
        <div className="w-full mb-8">
          <GoogleButton />
        </div>

        {/* Footer Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[#878D96] text-sm"
        >
          Already have an account?{' '}
          <button className="text-[#007AFF] font-medium hover:underline transition-all">
            Sign in
          </button>
        </motion.p>

      </main>

      {/* Bottom Amber Line */}
      <div className="absolute bottom-8 right-8 w-16 h-1 bg-amber-500/50 rounded-full blur-[1px]" />
    </div>
  );
}


