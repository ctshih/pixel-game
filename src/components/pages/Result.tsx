import React from 'react';
import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';
import BossImage from '../game/BossImage';

interface ResultProps {
    score: number;
    correct: number;
    total: number;
    passThreshold: number;
    onRetry: () => void;
    onHome: () => void;
}

const Result: React.FC<ResultProps> = ({ score, correct, total, passThreshold, onRetry, onHome }) => {
    const passed = correct >= passThreshold;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <PixelCard title="RESULT" className="pixel-box" style={{ textAlign: 'center', maxWidth: '500px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <BossImage seed={passed ? "victory" : "defeat"} isDead={passed} />
                </div>

                <h2 style={{
                    color: passed ? 'var(--pixel-success)' : 'var(--pixel-accent)',
                    marginBottom: '20px'
                }}>
                    {passed ? 'MISSION CLEARED!' : 'GAME OVER'}
                </h2>

                <div style={{ marginBottom: '20px', lineHeight: '2' }}>
                    <p>SCORE: {score}</p>
                    <p>CORRECT: {correct} / {total}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                    {/* Only show Retry if failed? Or always? Requirement implies retry is possible. */}
                    <PixelButton onClick={onRetry} variant="primary">
                        RETRY
                    </PixelButton>
                    <PixelButton onClick={onHome} variant="secondary">
                        HOME
                    </PixelButton>
                </div>
            </PixelCard>
        </div>
    );
};

export default Result;
