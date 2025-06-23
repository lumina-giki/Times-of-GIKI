"use client";

import { useEffect, useState } from "react";
import GlobalAudioManager from "../utils/GlobalAudioManager";

interface BackgroundAudioProps {
    volume?: number;
    autoPlay?: boolean;
}

export default function BackgroundAudio({
    volume = 0.2,
    autoPlay = false
}: BackgroundAudioProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentVolume, setCurrentVolume] = useState(volume);
    const [currentTrack, setCurrentTrack] = useState("Track 1");
    const [showPlayPrompt, setShowPlayPrompt] = useState(false); // Start as false to prevent hydration mismatch
    const [isClient, setIsClient] = useState(false); // Track if we're on the client

    useEffect(() => {
        // Set client flag to true after mounting
        setIsClient(true);
        setShowPlayPrompt(true); // Now safe to show the prompt

        const audioManager = GlobalAudioManager.getInstance();

        // Initialize audio manager
        audioManager.initialize();
        audioManager.setVolume(volume);

        // Update local state based on audio manager
        const updateState = () => {
            setIsPlaying(audioManager.getIsPlaying());
            setIsMuted(audioManager.getIsMuted());
            setCurrentVolume(audioManager.getVolume());
            setCurrentTrack(audioManager.getCurrentTrackName());
        };

        // Add listener for state changes
        audioManager.addListener(updateState);        // Initial state update
        updateState();

        // Auto play if enabled
        if (autoPlay) {
            audioManager.play();
        }

        // Auto-hide prompt after 10 seconds
        const hidePromptTimer = setTimeout(() => {
            setShowPlayPrompt(false);
        }, 10000);

        // Cleanup listener on unmount
        return () => {
            audioManager.removeListener(updateState);
            clearTimeout(hidePromptTimer);
        };
    }, [volume, autoPlay]); const togglePlay = () => {
        const audioManager = GlobalAudioManager.getInstance();
        audioManager.togglePlay();
        setShowPlayPrompt(false); // Hide prompt once user interacts
    };

    const toggleMute = () => {
        const audioManager = GlobalAudioManager.getInstance();
        audioManager.toggleMute();
    };

    const skipToNext = () => {
        const audioManager = GlobalAudioManager.getInstance();
        audioManager.skipToNext();
    }; const handleVolumeChange = (newVolume: number) => {
        const audioManager = GlobalAudioManager.getInstance();
        audioManager.setVolume(newVolume);
    };

    return (
        <>
            {/* Only render when client-side to prevent hydration mismatch */}
            {isClient && (
                <>
                    {/* Playful Click Me Prompt */}
                    {showPlayPrompt && !isPlaying && (
                        <div className="fixed bottom-32 right-8 z-50 animate-bounce-gentle">
                            {/* Speech Bubble */}
                            <div className="relative">
                                <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-2xl px-4 py-3 shadow-lg border-2 border-white/30 animate-pulse-soft">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-bold text-sm">🎵 Click me for music!</span>
                                        <div className="animate-wiggle">
                                            <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {/* Arrow pointing down to play button */}
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-purple-400"></div>
                                </div>
                            </div>

                            {/* Floating Hearts */}
                            <div className="absolute -top-6 -left-2 animate-float-heart">
                                <span className="text-pink-400 text-lg">💖</span>
                            </div>
                            <div className="absolute -top-4 right-2 animate-float-heart-delayed">
                                <span className="text-purple-400 text-sm">✨</span>
                            </div>

                            {/* Close button */}
                            <button
                                onClick={() => setShowPlayPrompt(false)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold transition-colors animate-bounce-tiny"
                                aria-label="Close prompt"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    {/* Audio Controls */}
                    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
                        <div className="glass-enhanced rounded-2xl p-3 flex items-center gap-3">
                            {/* Current Track Info */}
                            <div className="text-white/60 text-xs font-medium">
                                {currentTrack}
                            </div>                    {/* Play/Pause Button */}
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
                                aria-label={isPlaying ? "Pause audio" : "Play audio"}
                            >
                                {isPlaying ? (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.68L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                                    </svg>
                                )}
                            </button>

                            {/* Skip Button */}
                            <button
                                onClick={skipToNext}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group"
                                aria-label="Skip to next track"
                            >
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M6 4l12 8-12 8V4z" />
                                    <path d="M18 4h2v16h-2V4z" />
                                </svg>
                            </button>

                            {/* Mute Button */}
                            <button
                                onClick={toggleMute}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
                                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                            >
                                {isMuted ? (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                )}
                            </button>

                            {/* Volume Slider */}
                            <div className="w-20 relative">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={currentVolume}
                                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                                />
                            </div>

                            {/* Audio Indicator */}
                            {isPlaying && (
                                <div className="flex items-center gap-1">
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                                    <div className="w-1 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            )}

                            {/* Shuffle Indicator */}
                            <div className="text-white/40 text-xs">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5l5 5-5 5M13 5l5 5-5 5" />
                                </svg>
                            </div>
                        </div>
                    </div>            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .animate-bounce-gentle {
          animation: bounceGentle 2s ease-in-out infinite;
        }

        .animate-pulse-soft {
          animation: pulseSoft 2s ease-in-out infinite;
        }

        .animate-wiggle {
          animation: wiggle 1s ease-in-out infinite;
        }

        .animate-float-heart {
          animation: floatHeart 3s ease-in-out infinite;
        }

        .animate-float-heart-delayed {
          animation: floatHeart 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        .animate-bounce-tiny {
          animation: bounceTiny 1s ease-in-out infinite;
        }

        @keyframes bounceGentle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 20px rgba(147, 51, 234, 0.3);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 8px 30px rgba(147, 51, 234, 0.5);
          }
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }

        @keyframes floatHeart {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
            opacity: 0.7;
          }
        }

        @keyframes bounceTiny {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }      `}</style>
                </>
            )}
        </>
    );
}
