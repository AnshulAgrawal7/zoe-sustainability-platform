// PROTOTYPE DATA — fallback school ranking, shown only if the API is unreachable.
// The live data comes from the backend via services/schoolService.ts.
import type { SchoolSummary } from '../types';

export const fallbackSchools: SchoolSummary[] = [
  {
    id: 'school-lefkimmi',
    name: 'Lefkimmi High School',
    location: 'Lefkimmi',
    memberCount: 3,
    totalPoints: 620,
    avgPoints: 207,
    ranked: true,
  },
  {
    id: 'school-gym-kerkyra',
    name: '1ο Γυμνάσιο Κέρκυρας',
    location: 'Corfu Town',
    memberCount: 4,
    totalPoints: 590,
    avgPoints: 148,
    ranked: true,
  },
  {
    id: 'school-acharavi',
    name: 'Gymnasium Acharavi',
    location: 'Acharavi',
    memberCount: 2,
    totalPoints: 190,
    avgPoints: 95,
    ranked: false,
  },
];

export const FALLBACK_MIN_RANKED_MEMBERS = 3;
