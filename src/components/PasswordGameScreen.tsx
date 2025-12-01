import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useAudio } from './AudioPlayer';
import CongratulationsScreen from './CongratulationsScreen';

interface PasswordGameScreenProps {
  onComplete: () => void;
  customData?: {
    name: string;
    hint: string;
    password: string;
    secretMessage: string;
  } | null;
}

export default function PasswordGameScreen({ onComplete, customData }: PasswordGameScreenProps) {
  const [password] = useState(customData?.password.toUpperCase() || 'JEET');
  const [hint] = useState(customData?.hint || 'The password is related to YOU.');
  const [input, setInput] = useState('');
  const [won, setWon] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [error, setError] = useState(false);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [cursorBlink, setCursorBlink] = useState(true);
  const { playSound } = useAudio();

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorBlink(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (input.toUpperCase() === password) {
      setWon(true);
      playSound('goodresult');
      setTimeout(() => setShowCongratulations(true), 1500);
    }
  }, [input, password]);

  const handleCongratulationsComplete = () => {
    onComplete();
  };

  // Show congratulations screen if won
  if (showCongratulations) {
    return <CongratulationsScreen onComplete={handleCongratulationsComplete} customData={customData} />;
  }

  const handleKeyPress = (key: string) => {
    if (won) return;
    
    playSound('type');
    setActiveKey(key);
    setTimeout(() => setActiveKey(null), 200);

    if (key === 'BACK') {
      setInput(prev => prev.slice(0, -1));
      setError(false);
    } else if (key === 'SPACE') {
      setInput(prev => prev + ' ');
    } else if (key === 'ENTER') {
      if (input.toUpperCase() !== password) {
        setError(true);
        playSound('error');
        setTimeout(() => setError(false), 500);
      }
    } else if (input.length < 20) {
      setInput(prev => prev + key);
    }
  };

  const keyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#FFE6EE' }}>
      <motion.div
        className="max-w-4xl w-full space-y-8"
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
          <span className="text-5xl">🔒</span>
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> PASSWORD GAME</span>
        </motion.h1>

        {/* Computer Setup */}
        <div className="relative">
          {/* Monitor */}
          <motion.div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 border-8 border-gray-700 shadow-2xl relative"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
          >
            {/* Sticky Note Hint */}
            <motion.div
              className="absolute -top-4 -right-4 bg-yellow-200 p-4 rounded-lg shadow-lg border-2 border-yellow-400 rotate-6 z-10"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 6 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <p className="text-sm text-gray-800" style={{ fontFamily: 'monospace' }}>
                💡 Hint: {hint}
              </p>
            </motion.div>

            {/* Screen */}
            <motion.div 
              className="bg-black rounded-2xl p-8 min-h-[200px] flex flex-col justify-center border-4 border-gray-600 relative overflow-hidden"
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.5 }}
            >
              {won && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}

              <div className="relative z-10">
                <p className="text-green-400 text-lg mb-4" style={{ fontFamily: 'monospace' }}>
                  {'>'} Enter Password:
                </p>
                <div className="text-green-400 text-3xl" style={{ fontFamily: 'monospace' }}>
                  {input}
                  {!won && (
                    <motion.span
                      animate={{ opacity: cursorBlink ? 1 : 0 }}
                      className="inline-block w-3 h-8 bg-green-400 ml-1"
                    />
                  )}
                </div>

                <AnimatePresence>
                  {won && (
                    <motion.div
                      className="mt-6 text-center"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", bounce: 0.6 }}
                    >
                      <p className="text-4xl mb-2">🎉</p>
                      <p className="text-green-400 text-2xl" style={{ fontFamily: 'monospace' }}>
                        ACCESS GRANTED!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      className="text-red-400 text-lg mt-4"
                      style={{ fontFamily: 'monospace' }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      ❌ ACCESS DENIED
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Sparkles effect when won */}
              {won && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 30}%`
                      }}
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ 
                        scale: [0, 1, 0],
                        rotate: [0, 180, 360]
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-300" />
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>

            {/* Monitor Stand */}
            <div className="flex justify-center mt-4">
              <div className="w-32 h-4 bg-gray-700 rounded-full" />
            </div>
            <div className="flex justify-center">
              <div className="w-48 h-3 bg-gray-600 rounded-full" />
            </div>
          </motion.div>

          {/* Desk Items */}
          <motion.div
            className="absolute -right-16 top-1/2 text-4xl cursor-pointer"
            animate={{ rotate: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            whileHover={{ scale: 1.1 }}
            onClick={() => playSound('click')}
          >
            🖱️
          </motion.div>
          <motion.div
            className="absolute -left-16 top-1/3 text-4xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            ☕
          </motion.div>
          <motion.div
            className="absolute -left-20 bottom-1/4 text-3xl"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌱
          </motion.div>
        </div>

        {/* Keyboard */}
        <motion.div
          className="bg-gradient-to-br from-gray-300 to-gray-400 rounded-3xl p-6 border-8 border-gray-500 shadow-2xl"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-3">
            {keyboardRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center gap-2">
                {row.map((key) => (
                  <motion.button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    disabled={won}
                    className={`${
                      key === 'BACK' ? 'px-6' : 'w-12'
                    } h-12 bg-white border-4 border-gray-400 rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-50 text-gray-800 transition-colors`}
                    style={{ fontFamily: 'monospace' }}
                    whileHover={{ scale: won ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      y: activeKey === key ? 4 : 0,
                      boxShadow: activeKey === key 
                        ? '0 2px 4px rgba(0,0,0,0.2)' 
                        : '0 4px 6px rgba(0,0,0,0.3)'
                    }}
                    transition={{ duration: 0.1 }}
                  >
                    {key === 'BACK' ? '←' : key}
                  </motion.button>
                ))}
              </div>
            ))}
            {/* Space bar and Enter */}
            <div className="flex justify-center gap-2">
              <motion.button
                onClick={() => handleKeyPress('SPACE')}
                disabled={won}
                className="w-48 h-12 bg-white border-4 border-gray-400 rounded-lg shadow-md hover:bg-gray-100 disabled:opacity-50"
                style={{ fontFamily: 'monospace' }}
                whileHover={{ scale: won ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  y: activeKey === 'SPACE' ? 4 : 0,
                  boxShadow: activeKey === 'SPACE'
                    ? '0 2px 4px rgba(0,0,0,0.2)'
                    : '0 4px 6px rgba(0,0,0,0.3)'
                }}
                transition={{ duration: 0.1 }}
              >
                SPACE
              </motion.button>
              <motion.button
                onClick={() => handleKeyPress('ENTER')}
                disabled={won}
                className="px-8 h-12 bg-green-400 border-4 border-green-600 rounded-lg shadow-md hover:bg-green-500 disabled:opacity-50 text-white"
                style={{ fontFamily: 'monospace' }}
                whileHover={{ scale: won ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  y: activeKey === 'ENTER' ? 4 : 0,
                  boxShadow: activeKey === 'ENTER'
                    ? '0 2px 4px rgba(0,0,0,0.2)'
                    : '0 4px 6px rgba(0,0,0,0.3)'
                }}
                transition={{ duration: 0.1 }}
              >
                ENTER
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
