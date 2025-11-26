import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Character from './Character';
import { Button } from './ui/button';
import { useAudio } from './AudioPlayer';

interface RockPaperScissorsGameProps {
  onComplete: () => void;
  onRetry: () => void;
}

type Choice = '✊' | '✋' | '✌️';

export default function RockPaperScissorsGame({ onComplete, onRetry }: RockPaperScissorsGameProps) {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState('');
  const [expression, setExpression] = useState<'happy' | 'surprised' | 'thinking'>('happy');
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [round, setRound] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const { playSound } = useAudio();

  const choices: Choice[] = ['✊', '✋', '✌️'];
  const choiceNames = { '✊': 'Rock', '✋': 'Paper', '✌️': 'Scissors' };

  const determineWinner = (player: Choice, computer: Choice) => {
    if (player === computer) return 'draw';
    if (
      (player === '✊' && computer === '✌️') ||
      (player === '✋' && computer === '✊') ||
      (player === '✌️' && computer === '✋')
    ) {
      return 'win';
    }
    return 'lose';
  };

  const handleChoice = (choice: Choice) => {
    if (gameOver) return;
    
    playSound('click');
    const computerPick = choices[Math.floor(Math.random() * choices.length)];
    setPlayerChoice(choice);
    setComputerChoice(computerPick);

    const outcome = determineWinner(choice, computerPick);
    
    if (outcome === 'win') {
      setResult('🎉 You Won This Round!');
      setExpression('surprised');
      playSound('success');
      const newWins = wins + 1;
      setWins(newWins);
      
      if (newWins >= 3) {
        setTimeout(() => {
          setGameOver(true);
          setResult('🏆 You Won the Game!');
          playSound('goodresult');
        }, 1500);
        setTimeout(onComplete, 3000);
      } else {
        setTimeout(nextRound, 2000);
      }
    } else if (outcome === 'lose') {
      setResult('Computer Won This Round!');
      setExpression('thinking');
      playSound('error');
      const newLosses = losses + 1;
      setLosses(newLosses);
      
      if (newLosses >= 3) {
        setTimeout(() => {
          setGameOver(true);
          setResult('Computer won! Let\'s try again!');
        }, 1500);
      } else {
        setTimeout(nextRound, 2000);
      }
    } else {
      setResult('🤝 It\'s a Draw!');
      setExpression('happy');
      playSound('click');
      setTimeout(nextRound, 2000);
    }
  };

  const nextRound = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
    setExpression('happy');
    setRound(prev => prev + 1);
  };

  const handleRetry = () => {
    playSound('click');
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
    setExpression('happy');
    setWins(0);
    setLosses(0);
    setRound(1);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 overflow-y-scroll" style={{ backgroundColor: '#FFE6EE' }}>
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
          <span className="text-5xl">✊</span>
          <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent"> ROCK PAPER SCISSORS</span>
        </motion.h1>

        {/* Character with Computer Choice and Result */}
        <div className="flex items-center justify-center gap-8">
          <Character 
            expression={expression}
            showingItem={null}
          />
          
          {/* Computer Choice and Result beside character */}
          <div className="flex flex-col gap-4 min-h-[200px]">
            {/* Computer Choice */}
            <div className="h-[90px] flex items-center justify-center">
              <AnimatePresence>
                {computerChoice && (
                  <motion.div
                    className="text-center bg-white border-4 border-blue-300 rounded-2xl p-4 shadow-lg"
                    initial={{ scale: 0, rotate: -10, x: -50 }}
                    animate={{ scale: 1, rotate: 0, x: 0 }}
                    exit={{ scale: 0, rotate: 10, x: 50 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <div className="text-5xl mb-2">{computerChoice}</div>
                    <div className="text-sm text-gray-600" style={{ fontFamily: 'monospace' }}>
                      Computer's Choice
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Result */}
            <div className="h-[90px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    key={result}
                    className={`text-center text-xl p-4 rounded-2xl border-4 max-w-xs ${
                      result.includes('Won This Round') || result.includes('Won the Game')
                        ? 'bg-green-100 border-green-400 text-green-700' 
                        : result.includes('Draw')
                        ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
                        : 'bg-orange-100 border-orange-400 text-orange-700'
                    }`}
                    initial={{ scale: 0, rotate: -10, x: -50 }}
                    animate={{ scale: 1, rotate: 0, x: 0 }}
                    exit={{ scale: 0, rotate: 10, x: 50 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    style={{ fontFamily: 'monospace' }}
                  >
                    {result}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Round and Score Display */}
        <motion.div
          className="bg-gradient-to-br from-green-100 to-blue-100 border-6 border-green-300 rounded-3xl p-6 text-center"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <p className="text-2xl text-gray-700 mb-2" style={{ fontFamily: 'monospace' }}>
            Round {round}
          </p>
          <p className="text-xl text-gray-700" style={{ fontFamily: 'monospace' }}>
            You: {wins} | Computer: {losses}
          </p>
          <p className="text-lg text-gray-600" style={{ fontFamily: 'monospace' }}>
            First to win 3 rounds wins!
          </p>
        </motion.div>

        {/* Choices */}
        {!gameOver && (
          <div className="grid grid-cols-3 gap-6">
            {choices.map((choice) => (
              <motion.button
                key={choice}
                onClick={() => !playerChoice && handleChoice(choice)}
                disabled={!!playerChoice}
                className="bg-white border-6 border-blue-300 rounded-3xl p-8 text-7xl hover:bg-blue-50 disabled:opacity-50 shadow-lg"
                whileHover={{ scale: playerChoice ? 1 : 1.1, rotate: playerChoice ? 0 : 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * choices.indexOf(choice) }}
              >
                {choice}
                <div className="text-sm text-gray-600 mt-2" style={{ fontFamily: 'monospace' }}>
                  {choiceNames[choice]}
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Player choice display */}
        <div className="h-[60px] flex items-center justify-center">
          <AnimatePresence>
            {playerChoice && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                style={{ fontFamily: 'monospace' }}
              >
                <p className="text-2xl">
                  You chose: <span className="text-5xl">{playerChoice}</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Retry Button */}
        {gameOver && losses >= 3 && (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              onClick={handleRetry}
              className="px-8 py-6 text-xl bg-gradient-to-r from-blue-400 to-green-400 hover:from-blue-500 hover:to-green-500 rounded-2xl"
            >
              🔄 Retry Rock, Paper & Scissors
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
