import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
    label?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, label }) => {
    const percentage = Math.min(100, Math.max(0, (current / total) * 100));

    return (
        <div style={{ width: '100%', marginBottom: 'var(--spacing-md)' }}>
            {label && (
                <div style={{ marginBottom: '4px', fontSize: '0.8rem' }}>
                    {label} ({current}/{total})
                </div>
            )}
            <div style={{
                height: '20px',
                backgroundColor: '#000',
                border: '2px solid #fff',
                position: 'relative',
                padding: '2px'
            }}>
                <div style={{
                    height: '100%',
                    width: `${percentage}%`,
                    backgroundColor: 'var(--pixel-success)',
                    transition: 'width 0.3s ease-out'
                }} />
            </div>
        </div>
    );
};

export default ProgressBar;
