import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    backgroundImage?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    backgroundImage = 'https://images.unsplash.com/photo-1508514177221-188b1fc16e9d?q=80&w=2070&auto=format&fit=crop'
}) => {
    return (
        <div className="relative py-24 md:py-32 lg:py-40 bg-brand-dark overflow-hidden flex items-center">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
                <div className="mt-8 flex justify-center">
                    <div className="w-24 h-1 bg-brand-blue rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader;
