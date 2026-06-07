// PROTOTYPE DATA — fictional upcoming events (dates illustrative). Real event data
// would be managed through the future backend. All user-facing text
// (title/description/location) is translated — see locales: eventData.<id>.*.

import type { Event } from '../types';

export const events: Event[] = [
  {
    id: 'evt-cleanup-jun25',
    category: 'Waste Reduction',
    date: '2025-06-14',
    time: '09:00',
    participantsMax: 80,
    participantsRegistered: 54,
    projectId: 'clean-coastline',
  },
  {
    id: 'evt-biodiversity-workshop',
    category: 'Biodiversity',
    date: '2025-06-21',
    time: '10:00',
    participantsMax: 25,
    participantsRegistered: 18,
    projectId: 'korisia-wetlands',
  },
  {
    id: 'evt-recycling-hub',
    category: 'Circular Economy',
    date: '2025-06-28',
    time: '11:00',
    participantsMax: 150,
    participantsRegistered: 67,
    projectId: 'corfu-recycles',
  },
  {
    id: 'evt-school-garden',
    category: 'Education',
    date: '2025-07-05',
    time: '09:30',
    participantsMax: 40,
    participantsRegistered: 29,
    projectId: 'green-schools',
  },
  {
    id: 'evt-water-monitoring',
    category: 'Water Protection',
    date: '2025-07-12',
    time: '08:30',
    participantsMax: 15,
    participantsRegistered: 11,
    projectId: 'akharavi-water-watch',
  },
  {
    id: 'evt-olive-harvest',
    category: 'Biodiversity',
    date: '2025-07-19',
    time: '10:00',
    participantsMax: 60,
    participantsRegistered: 41,
    projectId: 'olive-grove-revival',
  },
  {
    id: 'evt-sdg-forum',
    category: 'Community Action',
    date: '2025-08-09',
    time: '09:00',
    participantsMax: 200,
    participantsRegistered: 89,
  },
  {
    id: 'evt-sustainable-tourism',
    category: 'Sustainable Tourism',
    date: '2025-08-16',
    time: '14:00',
    participantsMax: 50,
    participantsRegistered: 22,
    projectId: 'blue-economy-tourism',
  },
  {
    id: 'evt-composting-expansion',
    category: 'Circular Economy',
    date: '2025-08-23',
    time: '18:30',
    participantsMax: 80,
    participantsRegistered: 34,
    projectId: 'community-composting',
  },
  {
    id: 'evt-youth-eco',
    category: 'Education',
    date: '2025-09-06',
    time: '09:00',
    participantsMax: 30,
    participantsRegistered: 14,
    projectId: 'green-schools',
  },
];

export const getUpcomingEvents = (): Event[] => {
  return [...events].sort((a, b) => a.date.localeCompare(b.date));
};

export const getEventsByCategory = (category: string): Event[] =>
  events.filter((e) => e.category === category);
