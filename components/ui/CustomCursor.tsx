"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
    const smoothX = useSpring(mouseX, smoothOptions);
    const smoothY = useSpring(mouseY, smoothOptions);

    useEffect(() => {
        const manageMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const manageMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", manageMouseMove);
        window.addEventListener("mouseover", manageMouseOver);

        return () => {
            window.removeEventListener("mousemove", manageMouseMove);
            window.removeEventListener("mouseover", manageMouseOver);
        };
    }, [mouseX, mouseY]);

    return (
        <motion.div
            ref={cursorRef}
            className="pointer-events-none fixed left-0 top-0 z-[10000] mix-blend-difference"
            style={{
                x: smoothX,
                y: smoothY,
                translateX: "-50%",
                translateY: "-50%"
            }}
        >
            <motion.div
                animate={{
                    width: isHovering ? 60 : 12,
                    height: isHovering ? 60 : 12,
                    backgroundColor: isHovering ? "#FF2D55" : "#FF2D55",
                    borderRadius: isHovering ? "0%" : "50%",
                    clipPath: isHovering
                        ? "polygon(50% 0%, 0% 100%, 100% 100%)" // Shark fin shape approx
                        : "circle(50% at 50% 50%)"
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="relative flex items-center justify-center shadow-[0_0_20px_rgba(255,45,85,0.5)]"
            >
            </motion.div>
        </motion.div>
    );
}
