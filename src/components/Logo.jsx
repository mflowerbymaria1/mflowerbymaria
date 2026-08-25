import React from 'react';
import Link from 'next/link';

export default function Logo({ size = 'medium', color = '#000', className = '', link = false }) {
    const heights = {
        small: '48px',
        medium: '62px',
        large: '84px'
    };

    const currentHeight = heights[size] || heights.medium;

    const content = (
        <div className={`logo-container ${className}`} style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none'
        }}>
            <img 
                src="/images/logo_mflower_typography.png" 
                alt="M•FLOWER BY MARIA" 
                style={{
                    height: currentHeight,
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block'
                }}
            />
        </div>
    );

    if (link) {
        return <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>{content}</Link>;
    }

    return content;
}
