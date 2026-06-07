// PROTOTYPE DATA — illustrative impact metrics + participation options.
// Numeric values are fictional. All user-facing text is translated
// (see locales: impactMetrics.<id>.* and participationOpts.<id>.*).

import type { ImpactMetric, ParticipationOption } from '../types';

export const impactMetrics: ImpactMetric[] = [
  { id: 'active-projects', value: 8, icon: 'Leaf', trend: 'up' },
  { id: 'citizens-engaged', value: 4963, icon: 'Users', trend: 'up' },
  { id: 'waste-diverted', value: '65.5', icon: 'Recycle', trend: 'up' },
  { id: 'coastline-monitored', value: 22, icon: 'Waves', trend: 'stable' },
  { id: 'habitats-restored', value: '23.4', icon: 'TreePine', trend: 'up' },
  { id: 'ghg-avoided', value: '14.7', icon: 'Wind', trend: 'up' },
  { id: 'students-reached', value: 870, icon: 'GraduationCap', trend: 'up' },
  { id: 'sdgs-addressed', value: 10, icon: 'Globe', trend: 'stable' },
];

export const participationOptions: ParticipationOption[] = [
  { id: 'submit-idea', icon: 'Lightbulb' },
  { id: 'volunteer', icon: 'HandHeart' },
  { id: 'join-event', icon: 'Calendar' },
  { id: 'report-issue', icon: 'AlertTriangle' },
  { id: 'feedback', icon: 'MessageSquare' },
];
