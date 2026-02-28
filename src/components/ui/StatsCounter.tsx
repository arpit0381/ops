import React, { useEffect, useState, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';

interface StatsCounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    label: string;
}

const StatsCounter: React.FC<StatsCounterProps> = ({
    end,
    duration = 2,
    suffix = '',
    prefix = '',
    label
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const [current, setCurrent] = useState(0);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        duration: duration * 1000,
        bounce: 0,
    });

    useEffect(() => {
        if (isInView) {
            motionValue.set(end);
        }
    }, [isInView, end, motionValue]);

    useEffect(() => {
        return springValue.on("change", (latest) => {
            setCurrent(Math.floor(latest));
        });
    }, [springValue]);

    return (
        <div className="text-center" ref={ref}>
            <div className="text-4xl md:text-5xl font-bold text-brand-blue dark:text-brand-yellow mb-2">
                {prefix}{current}{suffix}
            </div>
            <div className="text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider text-sm">
                {label}
            </div>
        </div>
    );
};

export default StatsCounter;
