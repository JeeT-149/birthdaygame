import { useState, useEffect } from 'react';
import BirthdayScreen from './components/BirthdayScreen';
import GameIntroScreen from './components/GameIntroScreen';
import GuessNumberGame from './components/GuessNumberGame';
import RockPaperScissorsGame from './components/RockPaperScissorsGame';
import WordleGame from './components/WordleGame';
import PasswordGameScreen from './components/PasswordGameScreen';
import CongratulationsScreen from './components/CongratulationsScreen';
import BirthdayCreate from './components/BirthdayCreate';
import Confetti from './components/Confetti';
import { AudioProvider } from './components/AudioPlayer';
import { CursorProvider, Cursor } from './components/ui/cursor';

type Screen = 'birthday' | 'intro' | 'guess-number' | 'rps' | 'wordle' | 'password' | 'congratulations' | 'create' | 'complete';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('create');
  const [showConfetti, setShowConfetti] = useState(false);
  const [customGameData, setCustomGameData] = useState<any>(null);

  // Check for URL parameters to access test screens and shared games
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const testScreen = urlParams.get('screen');
    const gameParam = urlParams.get('game');
    
    if (gameParam) {
      // Decode shared game data
      try {
        const decodedData = JSON.parse(atob(gameParam));
        setCustomGameData(decodedData);
        setCurrentScreen('birthday'); // Start the game with custom data
      } catch (error) {
        console.error('Error decoding game data:', error);
        setCurrentScreen('create'); // Fallback to create screen
      }
    } else if (testScreen === 'congratulations') {
      setCurrentScreen('congratulations');
    } else if (testScreen === 'create') {
      setCurrentScreen('create');
    }
  }, []);

  const handleReplay = (action?: string) => {
    if (action === 'create') {
      setCurrentScreen('create');
    } else {
      setCurrentScreen('birthday');
    }
    setShowConfetti(false);
  };

  const handleNext = () => {
    if (currentScreen === 'create') {
      // Load custom game data from localStorage
      const savedData = localStorage.getItem('customBirthdayGame');
      if (savedData) {
        setCustomGameData(JSON.parse(savedData));
      }
      setCurrentScreen('birthday');
    }
    else if (currentScreen === 'birthday') setCurrentScreen('intro');
    else if (currentScreen === 'intro') setCurrentScreen('guess-number');
    else if (currentScreen === 'guess-number') setCurrentScreen('rps');
    else if (currentScreen === 'rps') setCurrentScreen('wordle');
    else if (currentScreen === 'wordle') setCurrentScreen('password');
    else if (currentScreen === 'password') setCurrentScreen('congratulations');
    else if (currentScreen === 'congratulations') {
      setCurrentScreen('complete');
      setShowConfetti(true);
    }
  };

  const handleRetry = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  return (
    <CursorProvider global={true}>
      <AudioProvider>
        <div className="min-h-screen bg-white relative animate-ui-cursor-none">
          <Cursor>
            <div className="relative">
              {/* White arrow pointer */}
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="drop-shadow-md">
                <path
                  d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                  fill="white"
                  stroke="black"
                  strokeWidth="1"
                />
              </svg>
            </div>
          </Cursor>
          {showConfetti && <Confetti />}
        
        {currentScreen === 'create' && (
          <BirthdayCreate onComplete={handleNext} />
        )}
        
        {currentScreen === 'birthday' && (
          <BirthdayScreen onReplay={handleReplay} onNext={handleNext} customData={customGameData} />
        )}
        
        {currentScreen === 'intro' && (
          <GameIntroScreen onNext={handleNext} />
        )}
        
        {currentScreen === 'guess-number' && (
          <GuessNumberGame onComplete={handleNext} onRetry={() => handleRetry('guess-number')} />
        )}
        
        {currentScreen === 'rps' && (
          <RockPaperScissorsGame onComplete={handleNext} onRetry={() => handleRetry('rps')} />
        )}
        
        {currentScreen === 'wordle' && (
          <WordleGame onComplete={handleNext} onRetry={() => handleRetry('wordle')} />
        )}
        
        {currentScreen === 'password' && (
          <PasswordGameScreen onComplete={handleNext} customData={customGameData} />
        )}
        
        {currentScreen === 'congratulations' && (
          <CongratulationsScreen onComplete={handleReplay} customData={customGameData} />
        )}
        
        {currentScreen === 'complete' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#FFE6EE' }}>
            <div className="text-center space-y-6">
              <h1 className="text-6xl">🎉</h1>
              <h2 className="text-5xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                You Won All Games, {customGameData?.name || 'JeeT'}!
              </h2>
              <p className="text-xl text-gray-600">
                Happy Birthday! 🎂 Hope you had fun!
              </p>
              <button
                onClick={() => handleReplay()}
                className="px-8 py-4 bg-gradient-to-r from-pink-400 to-orange-400 text-white rounded-full hover:scale-105 transition-transform shadow-lg"
              >
                🔄 Play Again
              </button>
            </div>
          </div>
          )}
        </div>
      </AudioProvider>
    </CursorProvider>
  );
}