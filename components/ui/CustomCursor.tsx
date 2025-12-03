"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [cursorType, setCursorType] = useState<"default" | "pointer" | "avatar">("default");
    const [cursorImage, setCursorImage] = useState<string | null>(null);

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
            const cursorElement = target.closest('[data-cursor]') as HTMLElement;

            if (cursorElement) {
                const type = cursorElement.getAttribute('data-cursor');
                if (type === 'avatar') {
                    setCursorType('avatar');
                    setIsHovering(true);
                    const img = cursorElement.getAttribute('data-cursor-image');
                    if (img) setCursorImage(img);
                    return;
                }
            }

            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
                setIsHovering(true);
                setCursorType('pointer');
                setCursorImage(null);
            } else {
                setIsHovering(false);
                setCursorType('default');
                setCursorImage(null);
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
            className="pointer-events-none fixed left-0 top-0 z-[10000] hidden lg:block"
            style={{
                x: smoothX,
                y: smoothY,
                translateX: "-50%",
                translateY: "-50%"
            }}
        >
            <motion.div
                animate={{
                    width: cursorType === 'avatar' ? 100 : (isHovering ? 40 : 16),
                    height: cursorType === 'avatar' ? 100 : (isHovering ? 40 : 16),
                    backgroundColor: cursorType === 'avatar' ? "rgba(0, 0, 0, 0.5)" : "transparent",
                    borderWidth: cursorType === 'avatar' ? "0px" : "2px",
                    borderColor: "#007AFF",
                    borderRadius: "50%",
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative flex items-center justify-center shadow-[0_0_10px_rgba(0,122,255,0.3)] overflow-hidden"
            >
                {cursorType === 'avatar' && cursorImage ? (
                    <motion.img
                        src={cursorImage}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />
                ) : (
                    /* Center dot */
                    <motion.div
                        animate={{ scale: isHovering ? 0 : 1 }}
                        className="w-1 h-1 bg-[#007AFF] rounded-full"
                    />
                )}
            </motion.div>
        </motion.div>
    );
}
