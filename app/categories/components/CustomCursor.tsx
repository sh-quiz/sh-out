"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('a') || target.closest('button') || target.closest('.cursor-pointer')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[10000] hidden md:flex items-center justify-center"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
            }}
        >
            <motion.div
                className="rounded-full border border-[#007AFF]"
                animate={{
                    width: isHovering ? 48 : 12,
                    height: isHovering ? 48 : 12,
                    backgroundColor: isHovering ? "rgba(0, 122, 255, 0.1)" : "rgba(0, 0, 0, 0)",
                    borderColor: isHovering ? "#007AFF" : "#007AFF",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            />
        </motion.div>
    );
}
