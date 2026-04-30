/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction, GameState } from '../types.ts';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants.ts';
import { Trophy, RefreshCw, Play } from 'lucide-react';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.RIGHT);
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snake-highscore');
    return saved ? parseInt(saved) : 0;
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastProcessedDirection = useRef<Direction>(Direction.RIGHT);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, []);

  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      // Check Collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameState('GAMEOVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check Food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      lastProcessedDirection.current = direction;
      return newSnake;
    });
  }, [direction, food, generateFood]);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, moveSnake, speed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (lastProcessedDirection.current !== Direction.DOWN) setDirection(Direction.UP);
          break;
        case 'ArrowDown':
          if (lastProcessedDirection.current !== Direction.UP) setDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
          if (lastProcessedDirection.current !== Direction.RIGHT) setDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
          if (lastProcessedDirection.current !== Direction.LEFT) setDirection(Direction.RIGHT);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snake-highscore', score.toString());
    }
  }, [score, highScore]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection(Direction.RIGHT);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState('PLAYING');
    generateFood([{ x: 10, y: 10 }]);
  };

  return (
    <div id="game-container" className="relative flex flex-col items-center">
      {/* Stats Header Area */}
      <div className="flex justify-between w-full mb-6 font-mono">
        <div className="glass-card px-6 py-3 border-cyan-500/10">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">Grid Sync</p>
          <p className="text-2xl font-bold text-cyan-400 leading-none">
            {score.toString().padStart(5, '0')}
          </p>
        </div>
        <div className="glass-card px-6 py-3 border-pink-500/10">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-1">Peak Record</p>
          <p className="text-2xl font-bold text-pink-500 leading-none">
             {highScore.toString().padStart(5, '0')}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div 
        className="relative p-3 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl"
      >
        <div 
          className="relative overflow-hidden bg-[#0c0c14] rounded-2xl border border-cyan-500/20"
          style={{
            width: `min(75vw, 450px)`,
            aspectRatio: '1/1',
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
          {/* Snake segments */}
          {snake.map((segment, i) => (
            <div
              key={`${segment.x}-${segment.y}-${i}`}
              className={`
                ${i === 0 ? 'bg-cyan-400 shadow-[0_0_15px_#22d3ee]' : 'bg-cyan-400/40'}
                rounded-sm transition-all duration-150
              `}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                opacity: Math.max(0.2, 1 - i * 0.05),
              }}
            />
          ))}

          {/* Food */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="bg-pink-500 rounded-full shadow-[0_0_15px_#ec4899]"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
              transform: 'scale(0.8)',
            }}
          />

          {/* Border Glow Inset */}
          <div className="absolute inset-0 pointer-events-none border-[12px] border-cyan-500/5 rounded-2xl" />

          {/* Screens */}
          <AnimatePresence>
            {gameState !== 'PLAYING' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0c0c14]/90 backdrop-blur-md"
              >
                {gameState === 'START' ? (
                  <div className="text-center space-y-8 p-12">
                    <div>
                      <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">NEON<span className="text-cyan-400">SLITHER</span></h2>
                      <p className="text-[10px] text-white/30 font-mono text-center uppercase tracking-[0.4em]">Sub-Neural Simulation 01</p>
                    </div>
                    <button
                      onClick={startGame}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      INITIATE LINK
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-8 p-12">
                    <div>
                      <h2 className="text-4xl font-black text-pink-500 tracking-tighter uppercase mb-2">LINK SEVERED</h2>
                      <p className="text-[10px] text-white/30 font-mono text-center uppercase tracking-[0.4em]">Critical Sequence Failure</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                       <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Final Score</p>
                       <p className="text-3xl font-mono text-white tracking-tight">{score}</p>
                    </div>
                    <button
                      onClick={startGame}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-600 hover:scale-105 transition-all shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                    >
                      <RefreshCw className="w-5 h-5" />
                      RE-LINK
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] text-white/40 font-mono tracking-widest">
           <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
           AUTO-DETECT: ON
        </div>
      </div>
    </div>
  );
}
