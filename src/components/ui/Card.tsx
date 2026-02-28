import React, { type ReactNode } from 'react';
import { cn } from '../Navbar';

interface CardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: boolean;
    glowColor?: 'blue' | 'yellow' | 'green';
}

const Card: React.FC<CardProps> = ({
    children,
    className,
    hoverEffect = true,
    glowColor
}) => {
    return (
        <div
            className={cn(
                'bg-white dark:bg-brand-dark border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm transition-all duration-300',
                hoverEffect && 'hover:shadow-xl hover:-translate-y-1',
                glowColor === 'blue' && 'hover:glow-blue hover:border-brand-blue/30',
                glowColor === 'yellow' && 'hover:glow-yellow hover:border-brand-yellow/30',
                glowColor === 'green' && 'hover:glow-green hover:border-brand-green/30',
                className
            )}
        >
            {children}
        </div>
    );
};

export default Card;
