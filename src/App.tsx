import { useState } from 'react';
import Home from './components/pages/Home';
import Game from './components/pages/Game';
import Result from './components/pages/Result';
import { api } from './services/api';
import type { Question, GameResult } from './services/api';
import PixelCard from './components/ui/PixelCard';

type GameState = 'IDLE' | 'LOADING' | 'PLAYING' | 'SUBMITTING' | 'FINISHED';

function App() {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [playerId, setPlayerId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startQuestionCount = parseInt(import.meta.env.VITE_QUESTION_COUNT || '5', 10);
  const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD || '3', 10);

  const handleStart = async (id: string) => {
    setPlayerId(id);
    setGameState('LOADING');
    setError(null);
    try {
      const q = await api.getQuestions(startQuestionCount);
      setQuestions(q);
      setGameState('PLAYING');
    } catch (err) {
      console.error(err);
      setError('FAILED TO LOAD QUESTIONS. CHECK NETWORK OR GAS URL.');
      setGameState('IDLE');
    }
  };

  const handleFinish = async (answers: Record<string, string>) => {
    setGameState('SUBMITTING');
    try {
      const res = await api.submitAnswers(playerId, answers);
      setResult(res);
      setGameState('FINISHED');
    } catch (err) {
      console.error(err);
      setError('FAILED TO SUBMIT RESULTS.');
      // Optionally stay in game or go to error screen? 
      // For now, let's go to IDLE so they can restart.
      setGameState('IDLE');
    }
  };

  const handleRetry = () => {
    setGameState('IDLE');
    setResult(null);
    setQuestions([]);
    // Keep ID? Or reset? Requirement says "login", maybe keep ID is friendlier? 
    // Let's keep ID and auto-start? Or go back to Home with ID pre-filled?
    // "Home: Login/Start screen" implies going back to Home.
  };

  const handleHome = () => {
    setPlayerId('');
    handleRetry();
  };

  return (
    <div className="app-container">
      {gameState === 'IDLE' && (
        <Home onStart={handleStart} />
      )}

      {(gameState === 'LOADING' || gameState === 'SUBMITTING') && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <PixelCard className="pixel-box">
            <p>LOADING...</p>
          </PixelCard>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <Game questions={questions} onFinish={handleFinish} />
      )}

      {gameState === 'FINISHED' && result && (
        <Result
          score={result.score}
          correct={result.correct}
          total={result.total}
          passThreshold={passThreshold}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}

      {error && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--pixel-accent)',
          border: '4px solid #fff',
          padding: '10px',
          color: '#fff',
          zIndex: 100
        }}>
          ERROR: {error}
        </div>
      )}
    </div>
  );
}

export default App;
