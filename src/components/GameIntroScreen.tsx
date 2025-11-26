import { motion } from 'motion/react';
import Character from './Character';
import { Gamepad2, Hash, Hand, Lock, Grid3x3 } from 'lucide-react';
import { useAudio } from './AudioPlayer';

interface GameIntroScreenProps {
  onNext: () => void;
}

export default function GameIntroScreen({ onNext }: GameIntroScreenProps) {
  const { playSound } = useAudio();

  const handleStart = () => {
    playSound('success');
    onNext();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#FFE6EE' }}>
      {/* Floating game icons */}
      <motion.div
        className="absolute top-20 left-10"
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Hash className="w-12 h-12 text-pink-400" />
      </motion.div>
      <motion.div
        className="absolute top-20 right-10"
        animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
      >
        <Hand className="w-12 h-12 text-blue-400" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-1/4"
        animate={{ y: [0, -12, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, delay: 1 }}
      >
        <Lock className="w-12 h-12 text-purple-400" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-1/4"
        animate={{ y: [0, -10, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 0.7 }}
      >
        <Grid3x3 className="w-12 h-12 text-green-400" />
      </motion.div>

      <div className="max-w-4xl w-full space-y-8">
        {/* Character */}
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <Character expression="happy" />
        </motion.div>

        {/* Pixel-style text box */}
        <motion.div
          className="bg-gradient-to-br from-pink-100 to-purple-100 border-8 border-pink-300 rounded-3xl p-8 shadow-2xl relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            boxShadow: '0 8px 0 rgba(219, 39, 119, 0.3), 0 12px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Pixel-style header */}
          <motion.div
            className="flex items-center gap-3 mb-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Gamepad2 className="w-8 h-8 text-pink-500" />
            <h2 
              className="text-3xl text-pink-600"
              style={{ fontFamily: 'monospace' }}
            >
              BIRTHDAY CHALLENGE
            </h2>
          </motion.div>

          <motion.p
            className="text-xl text-gray-700 mb-6"
            style={{ fontFamily: 'monospace', lineHeight: '1.8' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Welcome to the Birthday Challenge! 🎮
            <br />
            You'll play 4 fun games:
          </motion.p>

          {/* Game list */}
          <div className="space-y-4">
            {[
              { icon: '🧩', text: 'Guess the Number (in 3 tries)', delay: 0.9 },
              { icon: '✊', text: 'Rock, Paper & Scissors (3 rounds)', delay: 1.1 },
              { icon: '🔠', text: 'Wordle', delay: 1.3 },
              { icon: '🔒', text: 'Guess the Password', delay: 1.5 }
            ].map((game, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-4 bg-white/60 rounded-2xl p-4 border-4 border-pink-200"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: game.delay, type: "spring" }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                <span className="text-3xl">{game.icon}</span>
                <span 
                  className="text-lg text-gray-800"
                  style={{ fontFamily: 'monospace' }}
                >
                  {game.text}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-xl text-pink-600 mt-6"
            style={{ fontFamily: 'monospace' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
          >
            Ready? Let's begin!
          </motion.p>
        </motion.div>

        {/* Start button */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9 }}
        >
          <motion.button
            onClick={handleStart}
            className="px-12 py-5 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white rounded-full shadow-xl text-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ scale: { duration: 2, repeat: Infinity } }}
          >
            🎮 Start Games!
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
