'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';

interface Props {
    label: string;
    type: string;
    icon: LucideIcon;
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    delay?: number;
}

export default function AuthInput({ label, type, icon: Icon, placeholder, value, onChange, delay = 0 }: Props) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        setHasValue(e.target.value.length > 0);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(e.target.value.length > 0);
        if (onChange) onChange(e);
    };

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className="relative w-full mb-4"
        >
            <div className="relative group">
                {/* Icon */}
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within:text-blue-500">
                    <Icon className="w-5 h-5" />
                </div>

                {/* Input */}
                <input
                    type={inputType}
                    className="w-full h-16 pl-14 pr-12 bg-[#161B22]/90 backdrop-blur-[32px] border border-zinc-800/60 rounded-[32px] text-white placeholder-transparent focus:outline-none focus:border-blue-500/50 focus:bg-[#161B22] transition-all duration-300"
                    placeholder={placeholder}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={value}
                />

                {/* Floating Label */}
                <motion.label
                    initial={false}
                    animate={{
                        y: isFocused || hasValue ? -28 : 0,
                        x: isFocused || hasValue ? -12 : 0,
                        scale: isFocused || hasValue ? 0.85 : 1,
                        color: isFocused ? '#3b82f6' : '#878D96'
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute left-14 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none origin-left"
                >
                    {isFocused || hasValue ? label : placeholder}
                </motion.label>

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                )}
            </div>
        </motion.div>
    );
}
