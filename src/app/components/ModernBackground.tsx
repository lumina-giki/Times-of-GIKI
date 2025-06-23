"use client";

import { useEffect, useState } from "react";

export default function ModernBackground() {
    const [particles, setParticles] = useState<Array<{ id: number; delay: number; duration: number; left: string }>>([]);

    useEffect(() => {
        // Generate dynamic particles
        const particleArray = Array.from({ length: 15 }, (_, i) => ({
            id: i,
            delay: Math.random() * 20,
            duration: 15 + Math.random() * 10,
            left: `${Math.random() * 100}%`
        }));
        setParticles(particleArray);
    }, []);

    return (
        <div className="fixed inset-0 z-0 overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 bg-animated"></div>

            {/* Modern Floating Orbs */}
            <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-r from-blue-500/8 to-purple-500/8 rounded-full mix-blend-multiply filter blur-2xl animate-modern-float"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-l from-purple-500/10 to-indigo-500/8 rounded-full mix-blend-multiply filter blur-2xl animate-modern-float-reverse"></div>
            <div className="absolute -bottom-20 left-20 w-72 h-72 bg-gradient-to-t from-indigo-500/6 to-cyan-500/8 rounded-full mix-blend-multiply filter blur-xl animate-nebula-drift"></div>
            <div className="absolute top-60 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-500/8 to-blue-500/6 rounded-full mix-blend-multiply filter blur-xl animate-modern-pulse"></div>
            <div className="absolute bottom-40 right-1/4 w-88 h-88 bg-gradient-to-tl from-violet-500/8 to-pink-500/6 rounded-full mix-blend-multiply filter blur-2xl animate-modern-float"></div>

            {/* Aurora Wave Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-aurora-wave"></div>
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-r from-transparent via-purple-500/4 to-transparent animate-aurora-wave" style={{ animationDelay: '-10s' }}></div>
            </div>

            {/* Enhanced Gradient Waves */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/3 to-transparent animate-gradient-wave-x"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/2 to-transparent animate-gradient-wave-y"></div>
            </div>

            {/* Modern Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="h-full w-full bg-[linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:80px_80px] animate-modern-grid"></div>
            </div>

            {/* Enhanced Star Field */}
            <div className="absolute inset-0">
                <div className="modern-star" style={{ top: '15%', left: '20%', animationDelay: '0s' }}></div>
                <div className="modern-star" style={{ top: '75%', left: '80%', animationDelay: '1s' }}></div>
                <div className="modern-star" style={{ top: '35%', left: '70%', animationDelay: '2s' }}></div>
                <div className="modern-star" style={{ top: '65%', left: '25%', animationDelay: '0.5s' }}></div>
                <div className="modern-star" style={{ top: '10%', left: '60%', animationDelay: '1.5s' }}></div>
                <div className="modern-star" style={{ top: '90%', left: '40%', animationDelay: '3s' }}></div>
                <div className="modern-star" style={{ top: '50%', left: '15%', animationDelay: '2.5s' }}></div>
                <div className="modern-star" style={{ top: '25%', left: '85%', animationDelay: '4s' }}></div>
            </div>

            {/* Modern Dynamic Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {particles.map((particle) => (
                    <div
                        key={particle.id}
                        className="modern-particle"
                        style={{
                            left: particle.left,
                            animationDelay: `${particle.delay}s`,
                            animationDuration: `${particle.duration}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* Subtle Noise Texture */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            ></div>
        </div>
    );
}
