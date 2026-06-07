// PROTOTYPE DATA — target audience profiles for Northern Corfu (sensitization strategy).
// All user-facing text is translated — see locales: audienceData.<id>.* (channel labels
// are an array aligned by index with `channels` below, which keeps only the type).

import type { TargetAudience } from '../types';

export const targetAudiences: TargetAudience[] = [
  {
    id: 'residents',
    icon: 'Home',
    channels: [
      { type: 'online' },
      { type: 'offline' },
      { type: 'offline' },
      { type: 'offline' },
      { type: 'online' },
    ],
  },
  {
    id: 'farmers',
    icon: 'Wheat',
    channels: [
      { type: 'offline' },
      { type: 'offline' },
      { type: 'offline' },
      { type: 'offline' },
    ],
  },
  {
    id: 'fishermen',
    icon: 'Anchor',
    channels: [{ type: 'offline' }, { type: 'offline' }, { type: 'offline' }],
  },
  {
    id: 'tourism-businesses',
    icon: 'Building2',
    channels: [
      { type: 'offline' },
      { type: 'offline' },
      { type: 'online' },
      { type: 'online' },
    ],
  },
  {
    id: 'young-people',
    icon: 'Sparkles',
    channels: [
      { type: 'online' },
      { type: 'offline' },
      { type: 'offline' },
      { type: 'offline' },
    ],
  },
  {
    id: 'tourists',
    icon: 'Plane',
    channels: [
      { type: 'offline' },
      { type: 'offline' },
      { type: 'online' },
      { type: 'online' },
    ],
  },
];
