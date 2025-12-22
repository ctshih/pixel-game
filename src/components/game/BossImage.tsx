import React from 'react';

interface BossImageProps {
    seed: string;
    className?: string;
    isDead?: boolean;
}

const BossImage: React.FC<BossImageProps> = ({ seed, className = '', isDead = false }) => {
    // Using 'pixel-art' collection from DiceBear
    const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&scale=100`;

    return (
        <div className={`boss-container ${className}`} style={{
            position: 'relative',
            width: '150px',
            height: '150px',
            margin: '0 auto',
            filter: isDead ? 'grayscale(100%) brightness(50%)' : 'none',
            transition: 'filter 0.5s ease'
        }}>
            <img
                src={avatarUrl}
                alt="Boss"
                style={{
                    width: '100%',
                    height: '100%',
                    imageRendering: 'pixelated'
                }}
            />
            {isDead && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'var(--pixel-accent)',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 0 #000'
                }}>
                    X
                </div>
            )}
        </div>
    );
};

export default BossImage;
