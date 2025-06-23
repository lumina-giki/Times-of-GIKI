"use client";

import { memo } from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: 'blue' | 'green' | 'white';
    message?: string;
}

const LoadingSpinner = memo(({
    size = 'md',
    color = 'blue',
    message = 'Loading...'
}: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-12 w-12',
        lg: 'h-16 w-16'
    };

    const colorClasses = {
        blue: 'border-blue-400',
        green: 'border-green-400',
        white: 'border-white'
    };

    return (
        <div className="flex flex-col items-center justify-center p-8">
            <div
                className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} mb-4`}
            />
            <p className="text-white/80 text-center">{message}</p>
        </div>
    );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
