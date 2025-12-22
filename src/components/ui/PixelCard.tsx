import React from 'react';

interface PixelCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    style?: React.CSSProperties;
}

const PixelCard: React.FC<PixelCardProps> = ({ children, className = '', title, style }) => {
    return (
        <div className={`pixel-box ${className}`} style={style}>
            {title && (
                <div style={{
                    position: 'absolute',
                    top: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--pixel-bg)',
                    padding: '0 8px',
                    color: 'var(--pixel-primary)',
                    fontSize: '1.2rem',
                    zIndex: 2,
                }}>
                    {title}
                </div>
            )}
            {children}
        </div>
    );
};

export default PixelCard;
