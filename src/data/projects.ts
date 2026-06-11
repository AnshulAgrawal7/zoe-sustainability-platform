// PROTOTYPE DATA — fallback project catalogue mirroring the seeded API projects
// (same `proj-*` ids, 5-value category taxonomy, official programme SDGs).
//
// Project FACTS & FIGURES are programme data of the Municipality of North Corfu,
// sourced primarily from the Verde.tec environmental award, Feb 2026 (life-news.gr,
// 03.03.2026); additional figures/context from Attica Green Expo 2026
// (kerkyrasimera.gr), the ODEK/ARCHELON cooperation (Corfu TV News, 31.07.2025) and
// a parliamentary question on turtle deaths (Corfu Stories, 15.04.2026) — see each
// project's `sourceNote`. They are MUNICIPAL PROGRAMME STATEMENTS,
// NOT a ZOE impact measurement (impact evaluation = Phase 5). The `progressPercent`
// and `participantCount` fields are ILLUSTRATIVE status indicators for the
// prototype, not measured values. SDGs are drawn only from the official programme
// set {4, 6, 11, 12, 13, 14, 15, 17}.
//
// `lat`/`lng` are verified public North-Corfu locations. The municipality-wide
// actions share the Acharavi centroid (greenmove = exact); led + education carry a
// small DISPLAY offset (~180 m) so all three map markers stay clickable — they are
// not precise point locations. Mirrors backend/prisma/seed.ts.

import type { Project } from '../types';

const SRC = 'Verde.tec 2026 / life-news.gr';

export const projects: Project[] = [
  {
    id: 'proj-greenmove',
    lat: 39.7467,
    lng: 19.9244,
    title: 'GreenMove — Sustainable Mobility',
    category: 'MOBILITY',
    status: 'Active',
    location: 'Municipality of North Corfu',
    description:
      'Sustainable urban mobility for North Corfu under the EU programme GreenMove — promoting low-emission transport and active mobility as part of the ZOE mobility axis.',
    problem:
      'Car-dependent, seasonal traffic on a small island strains roads and air quality, while alternatives for residents and visitors remain limited.',
    expectedImpact:
      'Lower-emission, more active mobility options for residents and visitors, aligned with EU sustainable-mobility funding.',
    sdgs: [11, 13],
    progressPercent: 40,
    startDate: '2024',
    endDate: '2027',
    citizenInvolvement: [
      'Share routes and mobility needs with the municipality',
      'Take part in consultation on active-mobility measures',
    ],
    transparencyMetrics: [],
    participantCount: 0,
    thumbnailColor: 'bg-blue-600',
    sourceNote: SRC,
  },
  {
    id: 'proj-circular',
    lat: 39.7433,
    lng: 19.9178,
    title: 'Circular Economy Network',
    category: 'COMMUNITY',
    status: 'Active',
    location: 'Municipality-wide, North Corfu',
    description:
      'Municipal circular-economy programme: in 2025 it diverted 2,682.699 t of residual waste from landfill — 15.08% of 17,787 t. It runs 20 recycling streams across 210 collection points (up to 95% sorting purity) and educates 2,000+ pupils; North Corfu hosted the Circular Municipalities Forum (Feb 2025).',
    problem:
      'Seasonal tourism multiplies waste volumes; without dense collection and sorting infrastructure, recyclables are lost to landfill.',
    expectedImpact:
      'A municipality-wide circular system that keeps recyclables in the loop and builds waste literacy among young people.',
    sdgs: [12, 11, 4],
    progressPercent: 60,
    startDate: '2023',
    endDate: '2026',
    citizenInvolvement: [
      'Sort household waste into the municipal streams',
      'Bring recyclables to one of the 210 collection points',
      'Join school and community education activities',
    ],
    transparencyMetrics: [
      {
        label: 'Residual Waste Diverted (2025)',
        value: '2,682.699',
        unit: 't · 15.08% of 17,787 t',
      },
      { label: 'Recycling Streams', value: '20', unit: 'streams' },
      { label: 'Collection Points', value: '210', unit: 'points' },
      { label: 'Sorting Purity', value: 'up to 95', unit: '%' },
      { label: 'Pupils Reached', value: '2,000+', unit: 'pupils' },
    ],
    participantCount: 0,
    thumbnailColor: 'bg-amber-500',
    sourceNote:
      'Attica Green Expo 2026 / kerkyrasimera.gr (diversion figure); Verde.tec 2026 (streams, points, purity, education)',
  },
  {
    id: 'proj-marine',
    lat: 39.8019,
    lng: 19.8697,
    title: 'Marine Protection & Sea Turtles',
    category: 'ENVIRONMENT',
    status: 'Active',
    location: 'North Corfu coast',
    description:
      'Marine protection on the North Corfu coast: sea-turtle conservation with ARCHELON (nest fencing and awareness campaigns) and marine-mammal stranding response with ODEK Kerkyra, the local cetacean (whale and dolphin) rescue team, alongside a marine-mammal congress (May 2025).',
    problem:
      'Coastal and marine habitats face pressure from tourism, litter and disturbance of nesting sites. The need for action is documented, not hypothetical: 17 sea turtles were found dead off Corfu in Q1 2026, prompting a parliamentary question (Corfu Stories, 15.04.2026).',
    expectedImpact:
      'Better-protected nesting sites, faster stranding response and stronger scientific cooperation — and transparency that makes ongoing pressures visible, not only successes, so citizens and decision-makers can see where action is still needed.',
    sdgs: [14, 15],
    progressPercent: 45,
    startDate: '2024',
    endDate: '2027',
    citizenInvolvement: [
      'Respect fenced sea-turtle nesting areas',
      'Join awareness campaigns and beach actions',
      'Report stranded or injured marine animals',
    ],
    transparencyMetrics: [],
    participantCount: 0,
    thumbnailColor: 'bg-sky-600',
    sourceNote:
      'ODEK/ARCHELON cooperation: Corfu TV News, 31.07.2025; turtle deaths: Corfu Stories, 15.04.2026',
  },
  {
    id: 'proj-antinioti',
    lat: 39.7792,
    lng: 19.8534,
    title: 'Antinioti Lagoon — Natural Monument',
    category: 'ENVIRONMENT',
    status: 'Active',
    location: 'Antinioti Lagoon, NE Corfu (Natura 2000)',
    description:
      'Protection of the Antinioti Lagoon, a Natura 2000 wetland between Kassiopi and Roda — part of ZOE’s natural-monuments axis (with Erimitis, the Nymfes waterfalls, the Agios Panteleimon basin and the Klimatia watermills).',
    problem:
      'The lagoon faces pressure from runoff, unregulated access and abandoned traditional land management.',
    expectedImpact:
      'A protected, monitored wetland habitat and a reference site for conservation in the northern Ionian.',
    sdgs: [15, 6, 14],
    progressPercent: 55,
    startDate: '2023',
    endDate: '2026',
    citizenInvolvement: [
      'Join habitat monitoring walks',
      'Report biodiversity sightings',
      'Respect protected-area rules',
    ],
    transparencyMetrics: [],
    participantCount: 0,
    thumbnailColor: 'bg-emerald-600',
    sourceNote: SRC,
  },
  {
    id: 'proj-natural-monuments',
    lat: 39.765,
    lng: 19.865,
    title: 'Natural Monuments & Reforestation',
    category: 'ENVIRONMENT',
    status: 'Active',
    location: 'Northern Corfu',
    description:
      'Conservation and monitoring of North Corfu’s natural monuments — Erimitis, the Nymfes waterfalls, the Agios Panteleimon lake basin and the Klimatia watermills — together with reforestation and ecological monitoring.',
    problem:
      'Irreplaceable landscapes and water features face development pressure, neglect and fire risk.',
    expectedImpact:
      'Safeguarded natural monuments, restored tree cover and an evidence base for long-term protection.',
    sdgs: [15, 13],
    progressPercent: 40,
    startDate: '2024',
    endDate: '2027',
    citizenInvolvement: [
      'Volunteer for reforestation days',
      'Help document and monitor sites',
      'Support protection through public consultations',
    ],
    transparencyMetrics: [],
    participantCount: 0,
    thumbnailColor: 'bg-lime-600',
    sourceNote: SRC,
  },
  {
    id: 'proj-led',
    lat: 39.748,
    lng: 19.93,
    title: 'LED Street Lighting Upgrade',
    category: 'COMMUNITY',
    status: 'Completed',
    location: 'Municipality-wide, North Corfu',
    description:
      'Replacement of 4,866 municipal luminaires with energy-efficient LED, reducing energy use and CO₂ emissions across North Corfu.',
    problem:
      'Older street lighting consumed excess energy and added avoidable CO₂ emissions to municipal operations.',
    expectedImpact:
      'Lower municipal energy consumption and reduced CO₂ emissions from public lighting.',
    sdgs: [12, 13],
    progressPercent: 100,
    startDate: '2023',
    endDate: '2025',
    citizenInvolvement: [
      'Report broken or missing street lights',
      'Give feedback on lighting quality and safety',
    ],
    transparencyMetrics: [
      { label: 'Luminaires Upgraded', value: '4,866', unit: 'units' },
    ],
    participantCount: 0,
    thumbnailColor: 'bg-amber-600',
    sourceNote: SRC,
  },
  {
    id: 'proj-education',
    lat: 39.7454,
    lng: 19.9188,
    title: 'Environmental Education & University Partnership',
    category: 'EDUCATION',
    status: 'Active',
    location: 'North Corfu / Ionian University',
    description:
      'Environmental education and research in cooperation with the Ionian University and the University of Nuremberg — scientific congresses and active student participation.',
    problem:
      'Local environmental value is high, but structured education and research links were limited.',
    expectedImpact:
      'A standing education-and-research partnership that builds sustainability literacy and involves students directly.',
    sdgs: [4, 17],
    progressPercent: 50,
    startDate: '2023',
    endDate: '2027',
    citizenInvolvement: [
      'Attend public lectures and congresses',
      'Students: join ZOE research and field activities',
    ],
    transparencyMetrics: [],
    participantCount: 0,
    thumbnailColor: 'bg-rose-500',
    sourceNote: SRC,
  },
  {
    id: 'proj-water-quality',
    lat: 39.735,
    lng: 19.905,
    title: 'Drinking Water Quality Monitoring',
    category: 'ENVIRONMENT',
    status: 'Active',
    location: 'Northern Corfu',
    description:
      'Monitoring of drinking-water quality and protection of freshwater sources across North Corfu, including the Agios Panteleimon basin.',
    problem:
      'Small watercourses and sources face runoff, seasonal drought and pressure from tourism infrastructure.',
    expectedImpact:
      'A clearer picture of water quality and better-protected freshwater sources.',
    sdgs: [6, 11],
    progressPercent: 60,
    startDate: '2023',
    endDate: '2026',
    citizenInvolvement: [
      'Report pollution incidents',
      'Train as a citizen water monitor',
    ],
    transparencyMetrics: [],
    participantCount: 0,
    thumbnailColor: 'bg-blue-500',
    sourceNote: SRC,
  },
];

export const getProjectById = (id: string): Project | undefined =>
  projects.find((p) => p.id === id);

export const getProjectsByCategory = (category: string): Project[] =>
  projects.filter((p) => p.category === category);

export const getProjectsByStatus = (status: string): Project[] =>
  projects.filter((p) => p.status === status);
