// PROTOTYPE DATA — fallback news/blog posts, shown only if the API is unreachable.
// The live feed comes from the backend via services/postService.ts.
import type { Post } from '../types';

export const fallbackPosts: Post[] = [
  {
    id: 'post-welcome',
    type: 'ANNOUNCEMENT',
    titleEn: 'Welcome to the ZOE platform',
    titleEl: 'Καλωσήρθατε στην πλατφόρμα ZOE',
    titleDe: 'Willkommen auf der ZOE-Plattform',
    bodyEn:
      'ZOE brings transparency and citizen participation to sustainability projects across Northern Corfu.',
    bodyEl:
      'Το ZOE φέρνει διαφάνεια και συμμετοχή των πολιτών στα έργα βιωσιμότητας σε όλη τη Βόρεια Κέρκυρα.',
    bodyDe:
      'ZOE bringt Transparenz und Bürgerbeteiligung in Nachhaltigkeitsprojekte in ganz Nordkorfu.',
    imageUrl: null,
    published: true,
    projectId: null,
    createdAt: '2026-06-01T09:00:00.000Z',
  },
  {
    id: 'post-completed-beach',
    type: 'PROJECT_COMPLETED',
    titleEn: 'Completed: Kassiopi Coastal Clean-Up',
    titleEl: 'Ολοκληρώθηκε: Καθαρισμός Ακτής Κασσιωπής',
    titleDe: 'Abgeschlossen: Küstenreinigung Kassiopi',
    bodyEn:
      'Our monthly beach and underwater clean-up around Kassiopi harbour has wrapped up.',
    bodyEl:
      'Ο μηνιαίος καθαρισμός παραλίας και βυθού γύρω από το λιμάνι της Κασσιωπής ολοκληρώθηκε.',
    bodyDe:
      'Unsere monatliche Strand- und Unterwasserreinigung rund um den Hafen von Kassiopi ist abgeschlossen.',
    imageUrl:
      'https://placehold.co/800x400/0ea5e9/ffffff?text=Kassiopi+Clean-Up',
    published: true,
    projectId: 'proj-beach-clean',
    createdAt: '2026-05-20T09:00:00.000Z',
  },
  {
    id: 'post-new-solar',
    type: 'PROJECT_NEW',
    titleEn: 'New project: Solar Panels for Corfu Schools',
    titleEl: 'Νέο έργο: Ηλιακά Πάνελ για τα Σχολεία',
    titleDe: 'Neues Projekt: Solaranlagen für Korfu-Schulen',
    bodyEn:
      'We are installing solar photovoltaic systems on municipal school rooftops across Northern Corfu.',
    bodyEl:
      'Εγκαθιστούμε ηλιακά φωτοβολταϊκά συστήματα στις στέγες σχολείων σε όλη τη Βόρεια Κέρκυρα.',
    bodyDe:
      'Wir installieren Photovoltaik-Anlagen auf Schuldächern in ganz Nordkorfu.',
    imageUrl: null,
    published: true,
    projectId: 'proj-solar-schools',
    createdAt: '2026-05-10T09:00:00.000Z',
  },
];
