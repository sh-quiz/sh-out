"use client";

import { useEffect, useRef } from "react";

export default function GrainOverlay() {
    return (
        <div className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.07] mix-blend-overlay">
            <div
                className="absolute inset-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"
                style={{ filter: 'contrast(170%) brightness(100%)' }}
            />
        </div>
    );
}
