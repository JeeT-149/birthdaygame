import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { useAudio } from './AudioPlayer';

interface WordleGameProps {
  onComplete: () => void;
  onRetry: () => void;
}

type LetterState = 'correct' | 'present' | 'absent' | 'empty';

interface Tile {
  letter: string;
  state: LetterState;
}

export default function WordleGame({ onComplete, onRetry }: WordleGameProps) {
  const [wordList, setWordList] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState('');
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses, setGuesses] = useState<Tile[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const { playSound } = useAudio();

  // Load words from JSON file
  useEffect(() => {
    const loadWords = async () => {
      try {
        const response = await fetch('/words.json');
        const data = await response.json();
        
        // Handle new format: array of objects with "word" property
        const fiveLetterWords = data
          .map((item: { word: string }) => item.word.toUpperCase())
          .filter((word: string) => word.length === 5);
        
        setWordList(fiveLetterWords);
        
        // Set random target word
        if (fiveLetterWords.length > 0) {
          const randomWord = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)];
          setTargetWord(randomWord);
        }
      } catch (error) {
        console.error('Error loading words:', error);
        // Fallback to default words if loading fails
        const fallbackWords = ['HAPPY', 'PARTY', 'SMILE', 'CHEER', 'SWEET'];
        setWordList(fallbackWords);
        setTargetWord(fallbackWords[Math.floor(Math.random() * fallbackWords.length)]);
      }
    };

    loadWords();
  }, []);

  useEffect(() => {
    setGuesses(Array(6).fill(null).map(() => 
      Array(5).fill({ letter: '', state: 'empty' as LetterState })
    ));
  }, []);

  const isValidWord = (word: string) => {
    const isValid = wordList.includes(word.toUpperCase());
    console.log(`Checking word: "${word}" -> "${word.toUpperCase()}" -> Valid: ${isValid}`);
    console.log(`Word list length: ${wordList.length}`);
    if (!isValid && wordList.length > 0) {
      console.log('First 5 words in list:', wordList.slice(0, 5));
    }
    return isValid;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return;

      if (e.key === 'Enter') {
        handleSubmit();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (/^[a-zA-Z]$/.test(e.key) && currentGuess.length < 5) {
        playSound('type');
        setCurrentGuess(prev => prev + e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentGuess, currentRow, gameOver, targetWord]);

  const handleSubmit = () => {
    if (currentGuess.length !== 5) {
      setShake(true);
      playSound('error');
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!isValidWord(currentGuess)) {
      setShake(true);
      playSound('error');
      setTimeout(() => setShake(false), 500);
      return;
    }

    playSound('enter');
    const newGuesses = [...guesses];
    const guess = currentGuess.split('');
    const target = targetWord.split('');
    const result: Tile[] = [];

    // First pass: mark correct letters
    guess.forEach((letter, i) => {
      if (letter === target[i]) {
        result[i] = { letter, state: 'correct' };
        target[i] = '';
      } else {
        result[i] = { letter, state: 'absent' };
      }
    });

    // Second pass: mark present letters
    guess.forEach((letter, i) => {
      if (result[i].state === 'correct') return;
      const index = target.indexOf(letter);
      if (index !== -1) {
        result[i] = { letter, state: 'present' };
        target[index] = '';
      }
    });

    newGuesses[currentRow] = result;
    setGuesses(newGuesses);

    if (currentGuess === targetWord) {
      setWon(true);
      setGameOver(true);
      playSound('goodresult');
      setTimeout(onComplete, 2500);
    } else if (currentRow >= 5) {
      setGameOver(true);
      playSound('lose');
    } else {
      setCurrentRow(prev => prev + 1);
    }

    setCurrentGuess('');
  };

  const handleBackspace = () => {
    playSound('type');
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  const handleLetterClick = (letter: string) => {
    if (gameOver || currentGuess.length >= 5) return;
    playSound('type');
    setCurrentGuess(prev => prev + letter);
  };

  const handleRetry = () => {
    playSound('click');
    // Pick a new random word from the loaded word list
    if (wordList.length > 0) {
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
      setTargetWord(randomWord);
    }
    setCurrentRow(0);
    setCurrentGuess('');
    setGuesses(Array(6).fill(null).map(() => 
      Array(5).fill({ letter: '', state: 'empty' as LetterState })
    ));
    setGameOver(false);
    setWon(false);
  };

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
  ];

  // Don't render the game until words are loaded
  if (wordList.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFE6EE' }}>
        <div className="text-xl font-bold">Loading words...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#FFE6EE' }}>
      <motion.div
        className="max-w-2xl w-full space-y-8"
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
          <span className="text-5xl">🔠</span>
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent"> WORDLE</span>
        </motion.h1>

        {/* Instructions */}
        <motion.div
          className="bg-white border-6 border-green-300 rounded-3xl p-4 text-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <p className="text-lg text-gray-700" style={{ fontFamily: 'monospace' }}>
            Guess the 5-letter word!
          </p>
        </motion.div>

        {/* Game Board */}
        <motion.div
          className="space-y-2"
          animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.5 }}
        >
          {guesses.map((guess, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {guess.map((tile, colIndex) => {
                const isCurrentRow = rowIndex === currentRow;
                const letter = isCurrentRow && colIndex < currentGuess.length 
                  ? currentGuess[colIndex] 
                  : tile.letter;
                
                const bgColor = tile.state === 'correct' 
                  ? 'bg-green-400 border-green-600'
                  : tile.state === 'present'
                  ? 'bg-yellow-400 border-yellow-600'
                  : tile.state === 'absent' && tile.letter
                  ? 'bg-gray-400 border-gray-600'
                  : 'bg-white border-gray-300';

                return (
                  <motion.div
                    key={colIndex}
                    className={`w-16 h-16 border-4 rounded-xl flex items-center justify-center text-3xl ${bgColor}`}
                    style={{ fontFamily: 'monospace' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: rowIndex * 0.05 + colIndex * 0.05 }}
                  >
                    {letter}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.div>

        {/* Result Message */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              className={`text-center text-2xl p-6 rounded-3xl border-4 ${
                won 
                  ? 'bg-green-100 border-green-400 text-green-700'
                  : 'bg-orange-100 border-orange-400 text-orange-700'
              }`}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.5 }}
              style={{ fontFamily: 'monospace' }}
            >
              {won ? '🎉 You Won!' : `The word was: ${targetWord}`}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard */}
        <div className="space-y-2">
          {keyboard.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1 justify-center">
              {row.map((key) => (
                <motion.button
                  key={key}
                  onClick={() => {
                    if (key === 'ENTER') handleSubmit();
                    else if (key === '⌫') handleBackspace();
                    else handleLetterClick(key);
                  }}
                  disabled={gameOver}
                  className={`${
                    key === 'ENTER' || key === '⌫' ? 'px-4' : 'w-10'
                  } h-12 bg-gray-200 border-3 border-gray-400 rounded-lg text-sm hover:bg-gray-300 disabled:opacity-50`}
                  style={{ fontFamily: 'monospace' }}
                  whileHover={{ scale: gameOver ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {key}
                </motion.button>
              ))}
            </div>
          ))}
        </div>

        {/* Retry Button */}
        {gameOver && !won && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleRetry}
              className="px-8 py-6 text-xl bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 rounded-2xl"
            >
              🔄 Retry Wordle
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
