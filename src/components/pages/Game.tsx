import React, { useState } from 'react';
import PixelCard from '../ui/PixelCard';
import PixelButton from '../ui/PixelButton';
import BossImage from '../game/BossImage';
import ProgressBar from '../ui/ProgressBar';
import type { Question } from '../../services/api';

interface GameProps {
    questions: Question[];
    onFinish: (answers: Record<string, string>) => void;
}

const Game: React.FC<GameProps> = ({ questions, onFinish }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const currentQuestion = questions[currentIndex];
    // Generate a consistent seed for the boss based on the question ID
    const bossSeed = currentQuestion ? currentQuestion.id : 'default';

    const handleOptionSelect = (option: string) => {
        setSelectedOption(option);
    };

    const handleNext = () => {
        if (selectedOption && currentQuestion) {
            setAnswers(prev => ({
                ...prev,
                [currentQuestion.id]: selectedOption
            }));

            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                // Finish
                onFinish({
                    ...answers,
                    [currentQuestion.id]: selectedOption
                });
            }
        }
    };

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <ProgressBar
                current={currentIndex + 1}
                total={questions.length}
                label={`Battle ${currentIndex + 1}`}
            />

            <div style={{ marginBottom: '20px' }}>
                <BossImage seed={bossSeed} />
            </div>

            <PixelCard className="pixel-box" style={{ width: '100%', marginBottom: '20px' }}>
                <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                    {currentQuestion.q}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                        <PixelButton
                            key={key}
                            variant={selectedOption === key ? 'secondary' : 'primary'}
                            onClick={() => handleOptionSelect(key)}
                            style={{
                                textAlign: 'left',
                                backgroundColor: selectedOption === key ? 'var(--pixel-secondary)' : '#fff',
                                color: '#000'
                            }}
                        >
                            {key}. {value}
                        </PixelButton>
                    ))}
                </div>
            </PixelCard>

            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <PixelButton
                    onClick={handleNext}
                    disabled={!selectedOption}
                    variant="accent"
                >
                    {currentIndex === questions.length - 1 ? 'FINISH' : 'ATTACK >'}
                </PixelButton>
            </div>
        </div>
    );
};

export default Game;
