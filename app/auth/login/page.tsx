'use client';

import { useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, Diamond, Mail } from 'lucide-react';
import Lenis from 'lenis';

// Components
import AuthInput from '@/components/Auth/AuthInput';
import GoogleButton from '@/components/Auth/GoogleButton';
import ParticleBackground from '@/components/ui/ParticleBackground';

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await authService.login(formData);
      router.push('/home'); // Or wherever you want to redirect
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

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

          <h1 className="text-5xl font-extrabold text-white mb-2 tracking-tighter">E-Quiz</h1>
          <p className="text-[#878D96] text-sm font-light tracking-wide">Master Anything.</p>
        </motion.div>

        {/* Form Section */}
        <form className="w-full space-y-2 mb-8" onSubmit={handleLogin}>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          <AuthInput
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            delay={0.1}
          />
          <AuthInput
            label="Password"
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            delay={0.2}
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full h-14 mt-4 bg-[#007AFF] hover:bg-[#0062CC] text-white font-medium rounded-full transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Sign In'
            )}
          </motion.button>
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
          <button
            onClick={() => router.push('/auth/signup')}
            className="text-[#007AFF] font-medium hover:underline transition-all"
          >
            Sign up
          </button>
        </motion.p>

      </main>

      {/* Bottom Amber Line */}
      <div className="absolute bottom-8 right-8 w-16 h-1 bg-amber-500/50 rounded-full blur-[1px]" />
    </div>
  );
}


