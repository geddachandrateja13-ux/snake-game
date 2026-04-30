/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame.tsx';
import MusicPlayer from './components/MusicPlayer.tsx';
import { Music, Gamepad2, Zap, Info } from 'lucide-react';
import { DUMMY_TRACKS } from './constants.ts';

export default function App() {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-[#050508] text-white font-sans overflow-hidden relative">
      {/* Background Decorative Blurs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Sidebar (Library & Global Stats) */}
      <aside className="hidden lg:flex w-72 h-full flex-col border-r border-white/5 backdrop-blur-3xl bg-black/40 z-10 shrink-0">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-8 h-8 track-gradient-1 rounded-lg"></div>
            <h1 className="text-xl font-bold tracking-tighter uppercase whitespace-nowrap">Neon Slither</h1>
          </div>
          
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-6">Simulation Intel</p>
          <div className="space-y-4 mb-12">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 group">
              <div className="flex items-center gap-3 mb-3">
                <Info className="w-4 h-4 text-cyan-400 opacity-50" />
                <p className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">Briefing</p>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed font-mono">
                Growth is exponential. Maintain thermal equilibrium and tactical rhythm.
              </p>
            </div>
          </div>

          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-4">Neural Library</p>
          <ul className="space-y-3">
            {DUMMY_TRACKS.map((track, i) => (
              <li key={track.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer group">
                <div className={`w-10 h-10 rounded flex items-center justify-center track-gradient-${(i % 3) + 2}`}>
                  <span className="text-[10px] font-mono">0{i + 1}</span>
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold truncate">{track.title}</p>
                  <p className="text-[10px] text-white/40 truncate">{track.artist}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto p-6">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
              <Zap className="w-3 h-3 fill-current" /> System Status
            </p>
            <p className="text-xs font-mono text-white/40 mb-2">Protocol: Online</p>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Arena */}
      <main className="flex-1 flex flex-col items-center justify-center relative p-8">
        <div className="w-full h-full flex flex-col items-center justify-between">
          <header className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="text-center md:text-left">
              <h2 className="text-white/40 text-[10px] uppercase tracking-[0.4em]">Arena Interface</h2>
              <p className="text-xl font-light tracking-tight">Cyber-Slither Nexus</p>
            </div>
            
            <div className="flex gap-12">
               <div className="text-center md:text-right">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">Active Ops</span>
                  <p className="text-2xl font-mono text-cyan-400 tracking-tighter">0001</p>
               </div>
               <div className="text-center md:text-right">
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">Latency</span>
                  <p className="text-2xl font-mono text-pink-500 tracking-tighter">14ms</p>
               </div>
            </div>
          </header>

          <div className="flex-1 flex items-center justify-center w-full">
            <SnakeGame />
          </div>

          <footer className="w-full mt-12 flex justify-center">
            <MusicPlayer />
          </footer>
        </div>
      </main>
    </div>
  );
}

