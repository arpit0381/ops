import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
    title = 'OM Power Solutions | Powering Tomorrow Since 2000',
    description = 'Premium residential, commercial, and industrial solar energy installations across India. Empowering businesses with sustainable energy since 2000.',
    keywords = 'Solar panel installation, Commercial solar provider, Best solar company since 2000, Industrial solar, Renewable energy India'
}) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
    );
};

export default SEO;
