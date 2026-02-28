import React from 'react';
import { cn } from '../Navbar';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5';

    const variants = {
        primary: 'bg-gradient-to-r from-brand-blue to-cyan-500 hover:from-cyan-500 hover:to-brand-blue text-white shadow-brand-blue/30 hover:shadow-brand-blue/50',
        secondary: 'bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-500 hover:to-brand-green text-white shadow-brand-green/30 hover:shadow-brand-green/50',
        accent: 'bg-gradient-to-r from-brand-yellow to-orange-400 hover:from-orange-400 hover:to-brand-yellow text-brand-dark shadow-brand-yellow/30 hover:shadow-brand-yellow/50',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg font-semibold',
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default GradientButton;
