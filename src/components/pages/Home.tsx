import React, { useState } from 'react';
import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';

interface HomeProps {
    onStart: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
    const [id, setId] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (id.trim()) {
            onStart(id.trim());
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <PixelCard title="PIXEL QUIZ" className="pixel-box">
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                        WELCOME, CHALLENGER!
                        <br />
                        ENTER YOUR ID TO BEGIN
                    </p>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input
                            type="text"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            placeholder="PLAYER ID"
                            style={{
                                fontFamily: 'var(--pixel-font)',
                                padding: '12px',
                                border: '4px solid #000',
                                outline: 'none',
                                backgroundColor: '#fff',
                                color: '#000',
                                textAlign: 'center',
                                fontSize: '1rem'
                            }}
                            autoFocus
                        />
                        <PixelButton type="submit" disabled={!id.trim()}>
                            START GAME
                        </PixelButton>
                    </form>
                </div>
            </PixelCard>
        </div>
    );
};

export default Home;
