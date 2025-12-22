import React from 'react';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'accent' | 'success';
}

const PixelButton: React.FC<PixelButtonProps> = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseStyle: React.CSSProperties = {
        fontFamily: 'var(--pixel-font)',
        fontSize: '1rem',
        padding: '12px 24px',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        backgroundColor: `var(--pixel-${variant})`,
        color: '#000', // Text is usually black on bright buttons in this style
        boxShadow: `
      inset -4px -4px 0px 0px rgba(0,0,0,0.5),
      4px 4px 0px 0px #000
    `,
        imageRendering: 'pixelated',
        textTransform: 'uppercase',
        marginTop: '4px', // To account for press effect space
        marginLeft: '4px',
        marginRight: '4px',
        marginBottom: '8px',
    };

    return (
        <button
            className={`pixel-btn ${className}`}
            style={baseStyle}
            {...props}
        >
            {children}
        </button>
    );
};

export default PixelButton;
