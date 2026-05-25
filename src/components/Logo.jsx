import React from 'react';
import Link from 'next/link';

export default function Logo({ size = 'medium', color = '#000', className = '', link = false }) {
    const sizes = {
        small: { title: '1.4rem', subtitle: '0.85rem', gap: '2px' },
        medium: { title: '1.8rem', subtitle: '1rem', gap: '3px' },
        large: { title: '2.5rem', subtitle: '1.4rem', gap: '4px' }
    };

    const currentSize = sizes[size] || sizes.medium;

    const content = (
        <div className={`logo-container ${className}`} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: color,
            lineHeight: 1
        }}>
            <span className="logo-title font-brand" style={{
                fontSize: currentSize.title,
                margin: 0,
                fontWeight: 'normal'
            }}>
                M•flower
            </span>
            <span className="logo-subtitle font-brand" style={{
                fontSize: currentSize.subtitle,
                marginTop: currentSize.gap,
                fontWeight: 600
            }}>
                by Maria
            </span>
        </div>
    );

    if (link) {
        return <Link href="/" style={{ textDecoration: 'none' }}>{content}</Link>;
    }

    return content;
}
