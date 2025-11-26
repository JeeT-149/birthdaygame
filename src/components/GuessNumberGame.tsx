import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Character from './Character';
import { Button } from './ui/button';
import { useAudio } from './AudioPlayer';

interface GuessNumberGameProps {
  onComplete: () => void;
  onRetry: () => void;
}

export default function GuessNumberGame({ onComplete, onRetry }: GuessNumberGameProps) {
  const [secretNumber, setSecretNumber] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [expression, setExpression] = useState<'happy' | 'surprised' | 'thinking'>('happy');
  const { playSound } = useAudio();

  useEffect(() => {
    setSecretNumber(Math.floor(Math.random() * 10) + 1);
  }, []);

  const handleGuess = (num: number) => {
    if (won || lost) return;
    
    playSound('click');
    setSelectedNumber(num);
    setAttempts(prev => prev + 1);

    if (num === secretNumber) {
      setFeedback('🎉 You got it!');
      setWon(true);
      setExpression('surprised');
      playSound('goodresult');
      setTimeout(onComplete, 2500);
    } else if (attempts >= 2) {
      setFeedback(`Let's try again! The number was ${secretNumber}`);
      setLost(true);
      setExpression('thinking');
      playSound('error');
    } else {
      if (num < secretNumber) {
        setFeedback('Higher! ⬆️');
        playSound('error');
      } else {
        setFeedback('Lower! ⬇️');
        playSound('error');
      }
      setExpression('thinking');
      setTimeout(() => setSelectedNumber(null), 1000);
    }
  };

  const handleRetry = () => {
    playSound('click');
    setSecretNumber(Math.floor(Math.random() * 10) + 1);
    setSelectedNumber(null);
    setAttempts(0);
    setFeedback('');
    setWon(false);
    setLost(false);
    setExpression('happy');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#FFE6EE' }}>
      <motion.div
        className="max-w-3xl w-full space-y-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        {/* Title */}
        <motion.h1
          className="text-5xl text-center"
          style={{ fontFamily: 'monospace' }}
          initial={{ y: -50 }}
          animate={{ y: 0 }}
        >
          <span className="text-5xl">🧩</span>
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> GUESS THE NUMBER</span>
        </motion.h1>

        {/* Character and Hint Section */}
        <div className="flex items-center justify-center gap-8">
          <Character 
            expression={expression} 
            showingItem={won ? `${secretNumber}` : null}
          />
          
          {/* Feedback beside character */}
          <AnimatePresence mode="wait">
            {feedback && (
              <motion.div
                key={feedback}
                className={`text-center text-xl p-4 rounded-2xl border-4 max-w-xs ${
                  won 
                    ? 'bg-green-100 border-green-400 text-green-700' 
                    : lost
                    ? 'bg-orange-100 border-orange-400 text-orange-700'
                    : 'bg-yellow-100 border-yellow-400 text-yellow-700'
                }`}
                initial={{ scale: 0, rotate: -10, x: -50 }}
                animate={{ scale: 1, rotate: 0, x: 0 }}
                exit={{ scale: 0, rotate: 10, x: 50 }}
                transition={{ type: "spring", bounce: 0.5 }}
                style={{ fontFamily: 'monospace' }}
              >
                {feedback}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <motion.div
          className="bg-gradient-to-br from-blue-100 to-purple-100 border-6 border-blue-300 rounded-3xl p-6 text-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <p className="text-xl text-gray-700" style={{ fontFamily: 'monospace' }}>
            I'm thinking of a number between 1 and 10.
            <br />
            You have 3 tries to guess it!
          </p>
          <p className="text-lg text-pink-600 mt-2">
            Attempts: {attempts}/3
          </p>
        </motion.div>

        {/* Number Cards - Smaller and more compact */}
        <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <motion.button
              key={num}
              onClick={() => handleGuess(num)}
              disabled={won || lost || selectedNumber !== null}
              className={`aspect-square rounded-2xl border-4 text-2xl font-bold transition-all ${
                selectedNumber === num
                  ? 'bg-pink-300 border-pink-500 scale-95'
                  : 'bg-white border-pink-300 hover:bg-pink-50 hover:scale-105'
              } disabled:opacity-50 shadow-lg w-16 h-16`}
              whileHover={{ scale: (won || lost || selectedNumber !== null) ? 1 : 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * num }}
              style={{ fontFamily: 'monospace' }}
            >
              {num}
            </motion.button>
          ))}
        </div>

        {/* Retry Button */}
        {lost && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleRetry}
              className="px-8 py-6 text-xl bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 rounded-2xl"
            >
              🔄 Retry Number Guess
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
