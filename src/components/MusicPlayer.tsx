/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, ListMusic } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants.ts';
import { Track } from '../types.ts';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowPlaylist(false);
  };

  return (
    <div className="w-full max-w-2xl px-4">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="backdrop-blur-xl bg-white/5 px-8 py-4 rounded-full border border-white/10 flex items-center gap-8 shadow-2xl relative overflow-hidden group">
        {/* Progress Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={prevTrack}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button
            onClick={togglePlay}
            className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          <button 
            onClick={nextTrack}
            className="text-white/40 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        {/* Info & Progress */}
        <div className="flex-1 flex flex-col gap-1.5 overflow-hidden">
          <div className="flex justify-between items-center gap-4">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate leading-none mb-0.5">{currentTrack.title}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest leading-none">{currentTrack.artist}</p>
            </div>
            <div className="flex gap-4 items-center shrink-0">
               <button 
                 onClick={() => setShowPlaylist(!showPlaylist)}
                 className={`text-[10px] tracking-widest uppercase transition-colors ${showPlaylist ? 'text-cyan-400' : 'text-white/40'}`}
               >
                 Library
               </button>
               <span className="text-[10px] items-center gap-2 font-mono text-white/40 hidden md:flex">
                 <Volume2 size={12} /> 80%
               </span>
            </div>
          </div>
          
          <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>

        {/* Playlist Mini-Overlay */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full left-0 right-0 mb-4 glass-card p-4 mx-4 overflow-hidden"
            >
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {DUMMY_TRACKS.map((track, i) => (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(i)}
                    className={`w-full text-left p-2 rounded-lg flex items-center gap-3 transition-colors ${
                      i === currentTrackIndex ? 'bg-cyan-500/10 text-cyan-400' : 'hover:bg-white/5 text-white/40'
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full ${i === currentTrackIndex ? 'bg-cyan-400' : 'bg-white/10'}`} />
                    <span className="text-xs font-medium truncate">{track.title}</span>
                    <span className="ml-auto text-[10px] font-mono opacity-50">0{i+1}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
