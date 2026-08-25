import React from 'react';
import Link from 'next/link';

export default function Logo({ size = 'medium', color = '#000', className = '', link = false }) {
    const heights = {
        small: '42px',
        medium: '56px',
        large: '78px'
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
