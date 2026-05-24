// PROTOTYPE DATA — fictional upcoming events and initiatives for the ZOE program
// Dates are illustrative. Real event data would be managed through the future backend.

import type { Event } from '../types';

export const events: Event[] = [
  {
    id: 'evt-cleanup-jun25',
    title: 'Northern Coastline Cleanup Day',
    category: 'Waste Reduction',
    date: '2025-06-14',
    time: '09:00',
    location: 'Kassiopi Beach, Northern Corfu',
    description:
      'Join our monthly coastal cleanup initiative! We provide all equipment (gloves, bags, grabbers) and a citizen science litter data sheet. After the cleanup we share a communal breakfast and debrief. Suitable for all ages.',
    participantsMax: 80,
    participantsRegistered: 54,
    projectId: 'clean-coastline',
  },
  {
    id: 'evt-biodiversity-workshop',
    title: 'Wetland Biodiversity Workshop',
    category: 'Biodiversity',
    date: '2025-06-21',
    time: '10:00',
    location: 'Korisia Lagoon Visitor Point',
    description:
      'A half-day educational workshop led by the Hellenic Ornithological Society. Learn to identify wetland birds, amphibians and plant species using field guides. Workshop includes a guided walk around the lagoon restoration area.',
    participantsMax: 25,
    participantsRegistered: 18,
    projectId: 'korisia-wetlands',
  },
  {
    id: 'evt-recycling-hub',
    title: 'Recycling Hub Grand Opening — Acharavi',
    category: 'Circular Economy',
    date: '2025-06-28',
    time: '11:00',
    location: 'Acharavi Village Square',
    description:
      'Celebrate the opening of the 9th ZOE Recycling Hub with demonstrations, sorting games for children, and a brief presentation on the Circular Waste Network project results. Free coffee and local snacks provided.',
    participantsMax: 150,
    participantsRegistered: 67,
    projectId: 'corfu-recycles',
  },
  {
    id: 'evt-school-garden',
    title: 'School Garden Planting Day',
    category: 'Education',
    date: '2025-07-05',
    time: '09:30',
    location: 'Acharavi Primary School',
    description:
      'Help students plant their school vegetable and herb garden! Volunteers assist 60 children in planting, learning about soil health and composting. Parents welcome. All ages and experience levels invited.',
    participantsMax: 40,
    participantsRegistered: 29,
    projectId: 'green-schools',
  },
  {
    id: 'evt-water-monitoring',
    title: 'Citizen Water Monitor Training Day',
    category: 'Water Protection',
    date: '2025-07-12',
    time: '08:30',
    location: 'Akharavi River (near bridge)',
    description:
      'Full-day training for new volunteer water quality monitors. Learn to use test kits, GPS data entry, and the ZOE reporting protocol. Certified on completion. Basic Greek or English required. 15 places available.',
    participantsMax: 15,
    participantsRegistered: 11,
    projectId: 'akharavi-water-watch',
  },
  {
    id: 'evt-olive-harvest',
    title: 'Traditional Olive Harvest Festival',
    category: 'Biodiversity',
    date: '2025-07-19',
    time: '10:00',
    location: 'Agios Markos Village',
    description:
      'Join local farmers and volunteers for a traditional olive harvest experience. Learn about agroecological olive cultivation, taste local products, and celebrate the cultural heritage of Corfiot olive farming. Lunch included for registered participants.',
    participantsMax: 60,
    participantsRegistered: 41,
    projectId: 'olive-grove-revival',
  },
  {
    id: 'evt-sdg-forum',
    title: 'ZOE Annual SDG Forum',
    category: 'Community Action',
    date: '2025-08-09',
    time: '09:00',
    location: 'Municipal Cultural Centre, Kassiopi',
    description:
      'Annual public forum presenting ZOE programme results, SDG progress, and community priorities for the next year. All citizens welcome. Morning: project presentations. Afternoon: participatory workshops on future priorities. Translation available.',
    participantsMax: 200,
    participantsRegistered: 89,
  },
  {
    id: 'evt-sustainable-tourism',
    title: 'Sustainable Tourism Stakeholder Consultation',
    category: 'Sustainable Tourism',
    date: '2025-08-16',
    time: '14:00',
    location: 'Roda Beach Hotel Conference Room',
    description:
      'Community consultation session for the Sustainable Blue Economy Tourism project. Tourism business owners, residents, and visitors are invited to share their perspective on sustainable tourism standards and eco-route proposals.',
    participantsMax: 50,
    participantsRegistered: 22,
    projectId: 'blue-economy-tourism',
  },
  {
    id: 'evt-composting-expansion',
    title: 'Composting Expansion Planning Meeting',
    category: 'Circular Economy',
    date: '2025-08-23',
    time: '18:30',
    location: 'Kassiopi Community Hall',
    description:
      'Open planning meeting for communities interested in hosting the next wave of ZOE composting facilities. Hear results from the completed pilot, ask questions, and express interest in bringing composting to your village.',
    participantsMax: 80,
    participantsRegistered: 34,
    projectId: 'community-composting',
  },
  {
    id: 'evt-youth-eco',
    title: 'Youth Environmental Leadership Camp',
    category: 'Education',
    date: '2025-09-06',
    time: '09:00',
    location: 'Paleokastritsa Environmental Education Centre',
    description:
      'A 3-day residential camp for young people aged 14–18. Topics include climate science, project management, digital communication and environmental advocacy. Applications open to all students in Northern Corfu.',
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
