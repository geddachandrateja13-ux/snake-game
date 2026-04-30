/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from './types.ts';

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 60;

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'AI Virtuoso',
    coverUrl: 'https://picsum.photos/seed/neon1/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Synthetic Pulse',
    artist: 'Cyber Beats',
    coverUrl: 'https://picsum.photos/seed/neon2/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: '3',
    title: 'Cyber Glide',
    artist: 'Digital Dreamer',
    coverUrl: 'https://picsum.photos/seed/neon3/400/400',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
];
