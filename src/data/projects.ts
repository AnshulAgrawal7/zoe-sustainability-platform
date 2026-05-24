// PROTOTYPE DATA — fictional project progress/metrics; context grounded in real Northern Corfu issues.
// Real references: Antinioti Lagoon (Natura 2000), Erimitis Peninsula (conservation campaign),
// IEF (Ionian Environment Foundation), SIN.PRAXI Sinies, All For Blue, Temploni landfill crisis.

import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'antinioti-lagoon',
    title: 'Antinioti Lagoon Restoration',
    category: 'Biodiversity',
    status: 'Active',
    location: 'Antinioti Lagoon, NE Corfu (Natura 2000)',
    description:
      'Multi-year restoration of the Antinioti Lagoon — the most significant protected wetland in Northern Corfu and a Natura 2000 site between Kassiopi and Roda. The project removes invasive reed species, improves water flow, and protects habitat for 44+ migratory bird species in partnership with the Ionian Environment Foundation (IEF).',
    problem:
      "Antinioti Lagoon faces degradation from agricultural runoff from the Ropa Valley corridor, unregulated access, and invasive vegetation outcompeting native marsh species. Northern Corfu's shift from agriculture to tourism over the past 50 years has left traditional land management — which historically maintained the lagoon margins — largely abandoned.",
    expectedImpact:
      'Restoration of 10+ hectares of wetland habitat, measurable recovery of nesting bird populations, and establishment of a citizen science monitoring network with trained local volunteers. Long-term: a reference site for wetland restoration methodology in the northern Ionian islands.',
    sdgs: [13, 14, 15, 17],
    progressPercent: 62,
    startDate: '2023-03',
    endDate: '2026-09',
    citizenInvolvement: [
      'Join monthly habitat monitoring walks with trained ecologists',
      'Participate in invasive species removal days',
      'Report biodiversity sightings via the ZOE platform',
      'Volunteer as a lagoon guardian (weekly 1-hour patrols)',
    ],
    transparencyMetrics: [
      { label: 'Area Restored', value: '7.4', unit: 'hectares' },
      { label: 'Volunteer Days', value: '142', unit: 'days' },
      { label: 'Bird Species Recorded', value: '44', unit: 'species' },
      { label: 'Invasive Plants Removed', value: '2.8', unit: 'tonnes' },
    ],
    participantCount: 218,
    thumbnailColor: 'bg-emerald-600',
  },
  {
    id: 'corfu-recycles',
    title: 'Corfu Recycles: Circular Waste Network',
    category: 'Circular Economy',
    status: 'Active',
    location: 'Municipality-wide, Northern Corfu',
    description:
      'Expanding the multi-stream recycling infrastructure across Northern Corfu villages, building on the model pioneered by SIN.PRAXI in Sinies — the only licensed "Small Green Spot" on the island. The project establishes community recycling hubs in Kassiopi, Acharavi, Roda and Sidari, with educational campaigns targeting both residents and tourism businesses.',
    problem:
      "Corfu's single landfill at Temploni filled to capacity and was blockaded by protesters in 2018, creating a visible island-wide garbage crisis during peak tourist season. In summer, daily waste generation rises from ~170 tonnes to over 350 tonnes as visitor numbers multiply. Currently, most waste still reaches landfill; recycling infrastructure outside Sinies is patchy.",
    expectedImpact:
      'Diversion of 35% of household and tourism waste from landfill within 3 years, replicating the SIN.PRAXI model in 6 additional village hubs. Creation of local recycling employment. Measurable reduction in the seasonal waste spike visible to tourists and residents alike.',
    sdgs: [11, 12, 13, 17],
    progressPercent: 45,
    startDate: '2024-01',
    endDate: '2026-12',
    citizenInvolvement: [
      'Register your household as a sorting champion',
      'Volunteer at a community hub alongside SIN.PRAXI partners',
      'Report illegal dumping on the ZOE platform',
      'Ask your hotel or restaurant to join the business programme',
    ],
    transparencyMetrics: [
      { label: 'Recycling Hubs Installed', value: '9', unit: 'of 14 planned' },
      { label: 'Waste Diverted', value: '18.3', unit: 'tonnes/month' },
      { label: 'Households Enrolled', value: '1240', unit: 'households' },
      { label: 'Partner Businesses', value: '27', unit: 'businesses' },
    ],
    participantCount: 1240,
    thumbnailColor: 'bg-amber-500',
  },
  {
    id: 'olive-grove-revival',
    title: 'Olive Grove Revival & Agroecology',
    category: 'Biodiversity',
    status: 'Active',
    location: 'Agios Markos, Spartilas & Sokraki, Northern Corfu',
    description:
      "Revitalising abandoned terraced olive groves in the northern hill villages through community stewardship agreements. Corfu has approximately 3.5 million olive trees — but the post-1960s shift to tourism employment caused widespread grove abandonment, especially in upland areas. Participating landowners and volunteers maintain groves using agroecological methods, protecting soil on terraced slopes and supporting pollinators.",
    problem:
      'Abandoned olive terraces in Northern Corfu are deteriorating: without maintenance, stone walls collapse, soil erodes, and fire risk rises dramatically in the dense maquis that colonises untended land. The loss of active cultivation also severs a cultural practice central to Corfiot identity stretching back centuries.',
    expectedImpact:
      'Revitalisation of 45 hectares of traditional olive groves. Training of 60 local stewards. Measured increase in pollinator populations and soil organic matter. Development of a local agroecology certification to support premium olive oil marketing, creating economic incentive for continued stewardship.',
    sdgs: [12, 13, 15, 4],
    progressPercent: 38,
    startDate: '2024-04',
    endDate: '2027-04',
    citizenInvolvement: [
      'Become an olive grove steward (training provided)',
      'Participate in agroecology workshops in Agios Markos',
      'Help with the autumn harvest and traditional press days',
      'Buy certified local olive products through the ZOE marketplace',
    ],
    transparencyMetrics: [
      { label: 'Groves Revitalised', value: '16', unit: 'hectares' },
      { label: 'Stewards Trained', value: '23', unit: 'persons' },
      { label: 'Pollinator Species Found', value: '48', unit: 'species' },
      { label: 'Stone Walls Restored', value: '340', unit: 'metres' },
    ],
    participantCount: 87,
    thumbnailColor: 'bg-lime-600',
  },
  {
    id: 'clean-coastline',
    title: 'Clean Coastline Initiative',
    category: 'Waste Reduction',
    status: 'Active',
    location: 'Northern Corfu coastline — Kassiopi to Sidari (22 km)',
    description:
      "Systematic, data-driven coastal cleanup and marine litter monitoring along Northern Corfu's 22 km coastline from Kassiopi to Sidari, including Palaiokastritsa and the beaches around Roda and Acharavi. Monthly cleanup events are conducted in partnership with All For Blue. Year-round citizen science data collection tracks litter types, hotspots and seasonal trends.",
    problem:
      "Northern Corfu's beaches absorb a significant share of the island's 4-million-visitor annual tourism impact. Beach litter — plastics, fishing gear, food packaging — is a persistent issue documented at Palaiokastritsa, Sidari and road corridors through olive groves. No systematic monitoring baseline existed before 2022, making it impossible to measure whether conditions were improving.",
    expectedImpact:
      'Collection of 25+ tonnes of coastal litter annually. A long-term litter baseline dataset shared with the Ionian Environment Foundation and marine researchers. Evidence base for advocacy on single-use plastics in Northern Corfu businesses and municipal policy.',
    sdgs: [14, 12, 11, 6],
    progressPercent: 78,
    startDate: '2022-05',
    endDate: '2025-12',
    citizenInvolvement: [
      'Join the monthly cleanup at Kassiopi, Sidari or Palaiokastritsa',
      'Adopt a beach section as a named guardian',
      'Record litter data using All For Blue citizen science protocols',
      'Schools programme: bring your class to a monitoring day',
    ],
    transparencyMetrics: [
      { label: 'Litter Collected', value: '47.2', unit: 'tonnes total' },
      { label: 'Cleanup Events', value: '62', unit: 'events' },
      { label: 'Volunteers Engaged', value: '2140', unit: 'persons' },
      { label: 'Litter Data Points', value: '18400', unit: 'records' },
    ],
    participantCount: 2140,
    thumbnailColor: 'bg-sky-600',
  },
  {
    id: 'green-schools',
    title: 'Green Schools & Environmental Literacy',
    category: 'Education',
    status: 'Active',
    location: 'All primary schools, Northern Corfu',
    description:
      "Integrating environmental education into the curricula of all 11 primary schools in Northern Corfu, with support from the Ionian Environment Foundation (IEF), which has already funded biodiversity education posters reaching Corfu's 8,000 primary school children. The programme includes school garden projects, field visits to Antinioti Lagoon and Erimitis Peninsula, and a student eco-council network.",
    problem:
      'Environmental issues are not systematically addressed in the local school curriculum. Young people in Northern Corfu grow up in a region of exceptional ecological value but often without the knowledge or tools to understand or protect it. Engaging children also raises household awareness as they bring learning home to families.',
    expectedImpact:
      'Reach 1,200 students annually with structured sustainability education. Eco-councils active in all 11 schools. A generation of informed young environmental stewards who understand their local ecosystem — Antinioti Lagoon, the Erimitis forests, the Ropa Valley — by name and by experience.',
    sdgs: [4, 13, 15, 17],
    progressPercent: 55,
    startDate: '2023-09',
    endDate: '2026-06',
    citizenInvolvement: [
      'Volunteer as a guest speaker at a Northern Corfu primary school',
      'Mentor a student eco-council in Kassiopi or Acharavi',
      'Donate materials or seeds for school gardens',
      'Offer land near Agios Markos for educational field visits',
    ],
    transparencyMetrics: [
      { label: 'Schools Participating', value: '8', unit: 'of 11' },
      { label: 'Students Reached', value: '870', unit: 'students' },
      { label: 'Eco-Councils Active', value: '6', unit: 'councils' },
      { label: 'Field Visits Completed', value: '34', unit: 'visits' },
    ],
    participantCount: 870,
    thumbnailColor: 'bg-rose-500',
  },
  {
    id: 'erimitis-conservation',
    title: 'Erimitis Peninsula Conservation',
    category: 'Community Action',
    status: 'Active',
    location: 'Erimitis Peninsula, NE Corfu',
    description:
      "Supporting the community-led campaign to protect the Erimitis Peninsula — the last virgin forested headland in Northeast Corfu, and the site of three wetlands protected by Greek presidential decree. The ZOE programme works alongside the Save Erimitis coalition and the Ionian Environment Foundation to strengthen the legal and civic case for permanent protection of this irreplaceable landscape.",
    problem:
      'A major development proposal — 90 hotel rooms, 76 bungalows, 40 villas and a marina — threatens the Erimitis Peninsula, which is currently the most high-profile environmental conflict in Corfu. The peninsula is home to rare endemic species, three protected wetlands, and represents the kind of intact coastal forest that has largely disappeared from the rest of the island.',
    expectedImpact:
      "Permanent legal protection for the Erimitis Peninsula. A documented model for community-led environmental advocacy in small Greek municipalities, applicable beyond Corfu. Strengthened citizen engagement in land-use governance — demonstrating that Northern Corfu residents can shape the island's environmental future.",
    sdgs: [15, 11, 17, 13],
    progressPercent: 44,
    startDate: '2024-06',
    endDate: '2027-12',
    citizenInvolvement: [
      'Sign and share the Save Erimitis petition',
      'Attend public hearings and community assemblies',
      'Participate in biodiversity surveys of the peninsula',
      'Write to regional government representatives',
    ],
    transparencyMetrics: [
      { label: 'Petition Signatures', value: '14200', unit: 'signatures' },
      { label: 'Public Hearings Attended', value: '8', unit: 'hearings' },
      { label: 'Species Documented', value: '67', unit: 'species' },
      { label: 'Media Coverage', value: '34', unit: 'articles' },
    ],
    participantCount: 14200,
    thumbnailColor: 'bg-violet-600',
  },
  {
    id: 'blue-economy-tourism',
    title: 'Sustainable Blue Economy Tourism',
    category: 'Sustainable Tourism',
    status: 'Planning',
    location: 'Northern Corfu coastal villages',
    description:
      'Developing a certification and promotion scheme for sustainable tourism operators in Northern Corfu. With 4 million annual visitors and summer daily waste surging from 170 to 350+ tonnes, the current tourism model carries a heavy environmental cost. Participating businesses commit to standards covering energy, waste, local sourcing and ecological impact — and gain access to a green marketing scheme targeting the growing eco-conscious travel segment.',
    problem:
      "Mass tourism is simultaneously Northern Corfu's primary economic driver and its greatest environmental pressure. The 2018 Temploni landfill crisis — caused largely by the seasonal tourism waste spike — made this tension visible to the whole island. The current model is also economically fragile: highly seasonal, concentrated in a few beach zones, vulnerable to the reputational damage that unchecked environmental degradation brings.",
    expectedImpact:
      'Certification of 30 tourism businesses by 2026. Three themed eco-tourism routes highlighting Antinioti Lagoon, the Erimitis forests and the olive grove landscapes. Estimated 15% increase in shoulder-season bookings among certified operators.',
    sdgs: [8, 11, 12, 14, 15],
    progressPercent: 18,
    startDate: '2025-01',
    endDate: '2027-06',
    citizenInvolvement: [
      'Recommend local businesses for the certification scheme',
      'Participate in community consultation sessions',
      'Share your local knowledge as a route guide',
      'Give feedback on draft eco-tourism route proposals',
    ],
    transparencyMetrics: [
      { label: 'Businesses in Pipeline', value: '14', unit: 'businesses' },
      { label: 'Community Consultations', value: '3', unit: 'sessions' },
      { label: 'Route Proposals', value: '2', unit: 'drafts' },
      { label: 'Stakeholder Meetings', value: '7', unit: 'meetings' },
    ],
    participantCount: 42,
    thumbnailColor: 'bg-teal-500',
  },
  {
    id: 'akharavi-water-watch',
    title: 'Akharavi Water Watch',
    category: 'Water Protection',
    status: 'Active',
    location: 'Akharavi stream & north coast watershed',
    description:
      'Citizen science water quality monitoring network for the Akharavi stream and connected north-coast watershed. While Corfu receives more rainfall than anywhere else in Greece, summer drying of small watercourses — exacerbated by climate change — affects local ecology. Trained volunteers collect water quality, flow and biodiversity data at 8 monitoring points.',
    problem:
      'The Akharavi stream and similar small watercourses in Northern Corfu face pressures from agricultural runoff, septic leakage from rapidly-built tourist accommodation, and increasingly frequent summer drought conditions. Monitoring has historically been purely regulatory and infrequent, missing the seasonal and event-driven dynamics that matter most for local ecology.',
    expectedImpact:
      'Year-round citizen-collected water quality dataset. Early warning system for pollution events linked to tourism infrastructure. Baseline for evaluating effectiveness of upstream land management changes. Engagement of 80+ citizen monitors from Acharavi, Roda and Kassiopi.',
    sdgs: [6, 3, 13, 15],
    progressPercent: 71,
    startDate: '2023-06',
    endDate: '2025-12',
    citizenInvolvement: [
      'Train as a certified water quality monitor (free, 1-day course)',
      'Join quarterly river condition assessment walks',
      'Report pollution incidents to the ZOE platform',
      'Participate in riparian vegetation surveys',
    ],
    transparencyMetrics: [
      { label: 'Monitoring Points Active', value: '8', unit: 'points' },
      { label: 'Water Tests Completed', value: '1840', unit: 'tests' },
      { label: 'Trained Monitors', value: '54', unit: 'volunteers' },
      { label: 'Pollution Incidents Reported', value: '7', unit: 'incidents' },
    ],
    participantCount: 54,
    thumbnailColor: 'bg-blue-500',
  },
  {
    id: 'community-composting',
    title: 'Community Composting Network',
    category: 'Circular Economy',
    status: 'Completed',
    location: 'Kassiopi, Acharavi, Roda — Northern Corfu',
    description:
      "Pilot programme establishing shared composting facilities in three Northern Corfu communities. Organic household and market waste is processed into compost distributed free to local olive growers, farmers and the municipal parks department — closing a nutrient loop that reduces both landfill pressure and farmers' input costs.",
    problem:
      "Organic waste makes up nearly 40% of Northern Corfu's household waste stream but historically went to the Temploni landfill. After the 2018 landfill crisis highlighted the unsustainable nature of this approach, the municipality prioritised organic waste diversion as a lower-cost, community-manageable alternative to centralised infrastructure.",
    expectedImpact:
      'Diversion of 8 tonnes of organic waste per month from landfill. Production of 4 tonnes of compost distributed to 120 recipients including olive growers in Agios Markos and Spartilas. Pilot methodology ready to scale to further villages in 2025.',
    sdgs: [11, 12, 13],
    progressPercent: 100,
    startDate: '2022-03',
    endDate: '2024-03',
    citizenInvolvement: [
      'Register as a compost recipient',
      'Volunteer at the composting facility',
      'Participate in the post-pilot evaluation survey',
      'Advocate for expansion to your village',
    ],
    transparencyMetrics: [
      { label: 'Organic Waste Diverted', value: '8.2', unit: 'tonnes/month' },
      { label: 'Compost Produced', value: '3.9', unit: 'tonnes/month' },
      { label: 'Compost Recipients', value: '127', unit: 'persons' },
      { label: 'GHG Avoided', value: '14.7', unit: 'tCO2eq/year' },
    ],
    participantCount: 312,
    thumbnailColor: 'bg-orange-500',
  },
];

export const getProjectById = (id: string): Project | undefined =>
  projects.find((p) => p.id === id);

export const getProjectsByCategory = (category: string): Project[] =>
  projects.filter((p) => p.category === category);

export const getProjectsByStatus = (status: string): Project[] =>
  projects.filter((p) => p.status === status);
