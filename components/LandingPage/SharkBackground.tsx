"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function LiquidShark() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Subtle rotation
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere args={[1, 100, 100]} scale={2.2} ref={meshRef}>
                <MeshDistortMaterial
                    color="#1C2128"
                    attach="material"
                    distort={0.5}
                    speed={2}
                    roughness={0.2}
                    metalness={0.9}
                    bumpScale={0.01}
                />
            </Sphere>
        </Float>
    );
}

export default function SharkBackground() {
    return (
        <div className="absolute inset-0 z-0 w-full h-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#FF2D55" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0F1419" />
                <LiquidShark />
                <Environment preset="city" />
                <fog attach="fog" args={['#0B0E12', 3, 10]} />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0E12]/50 to-[#0B0E12] z-[1]" />
        </div>
    );
}
