// PROTOTYPE DATA — fictional environmental projects for the ZOE program
// All data is illustrative. Real project data would be managed through the future backend.

import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'korisia-wetlands',
    title: 'Korisia Wetlands Restoration',
    category: 'Biodiversity',
    status: 'Active',
    location: 'Korisia Lagoon, Northern Corfu',
    description:
      'A multi-year restoration initiative to rehabilitate the degraded coastal wetlands at Korisia Lagoon. The project involves invasive species removal, native vegetation replanting, and water flow improvement to restore habitat for migratory birds and endemic amphibian species.',
    problem:
      'Korisia Lagoon has experienced significant habitat degradation over the past decades due to agricultural runoff, uncontrolled development near the shoreline, and invasive reed species that outcompete native marsh vegetation. Biodiversity surveys show a 40% decline in bird species since 2005.',
    expectedImpact:
      'Restoration of approximately 12 hectares of wetland habitat, recovery of 15+ bird species, and improvement of water quality metrics. Community-led monitoring will provide long-term ecological data to inform further conservation measures.',
    sdgs: [13, 14, 15, 17],
    progressPercent: 62,
    startDate: '2023-03',
    endDate: '2026-09',
    citizenInvolvement: [
      'Join monthly habitat monitoring walks',
      'Participate in invasive species removal days',
      'Submit biodiversity sightings via the future ZOE app',
      'Adopt a wetland section as a community guardian',
    ],
    transparencyMetrics: [
      { label: 'Area Restored', value: '7.4', unit: 'hectares' },
      { label: 'Volunteer Days', value: '142', unit: 'days' },
      { label: 'Bird Species Recorded', value: '31', unit: 'species' },
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
      'Establishing a network of community recycling hubs across 14 villages in Northern Corfu, combined with an educational campaign to increase household separation of glass, plastics, organics and textiles. Partnerships with local businesses create closed-loop reuse pathways.',
    problem:
      'Northern Corfu currently sends over 85% of household waste to landfill. Seasonal tourism multiplies waste volumes by 3× during summer months. Existing recycling infrastructure is insufficient and poorly understood by residents and tourists alike.',
    expectedImpact:
      'Diversion of 35% of household waste from landfill within 3 years. Creation of 8 new community recycling jobs. Reduced contamination of coastal ecosystems and measurable improvement in visual cleanliness of public spaces.',
    sdgs: [11, 12, 13, 17],
    progressPercent: 45,
    startDate: '2024-01',
    endDate: '2026-12',
    citizenInvolvement: [
      'Register your household as a sorting champion',
      'Volunteer at a community recycling hub',
      'Report illegal dumping sites via the platform',
      'Participate in business partnership program',
    ],
    transparencyMetrics: [
      { label: 'Recycling Hubs Installed', value: '9', unit: 'of 14 planned' },
      { label: 'Waste Diverted', value: '18.3', unit: 'tonnes/month' },
      { label: 'Households Enrolled', value: '1240', unit: 'households' },
      { label: 'Educational Events', value: '27', unit: 'events' },
    ],
    participantCount: 1240,
    thumbnailColor: 'bg-amber-500',
  },
  {
    id: 'olive-grove-revival',
    title: 'Olive Grove Revival & Agroecology',
    category: 'Biodiversity',
    status: 'Active',
    location: 'Agios Markos & Spartilas, Northern Corfu',
    description:
      'Revitalising abandoned traditional olive groves through community stewardship agreements. Participating landowners and volunteers maintain the groves using low-impact agroecological methods, preserving a cultural heritage landscape while supporting pollinators and soil health.',
    problem:
      'Approximately 30% of Corfu\'s traditional olive groves have been abandoned in the past 20 years due to changing economics and rural depopulation. Abandonment leads to fire risk, soil erosion, and loss of a landscape that supports unique biodiversity including 80+ insect species.',
    expectedImpact:
      'Revitalisation of 45 hectares of traditional olive groves. Training of 60 local stewards. Measured increase in pollinator populations and soil organic matter. Development of a local product certification scheme for sustainably managed olive oil.',
    sdgs: [12, 13, 15, 4],
    progressPercent: 38,
    startDate: '2024-04',
    endDate: '2027-04',
    citizenInvolvement: [
      'Become an olive grove steward',
      'Participate in training workshops on agroecology',
      'Help with the spring harvest festival',
      'Buy certified local olive products',
    ],
    transparencyMetrics: [
      { label: 'Groves Revitalised', value: '16', unit: 'hectares' },
      { label: 'Stewards Trained', value: '23', unit: 'persons' },
      { label: 'Pollinator Species Found', value: '48', unit: 'species' },
      { label: 'Fire Risk Reduced', value: '12', unit: 'hectares cleared' },
    ],
    participantCount: 87,
    thumbnailColor: 'bg-lime-600',
  },
  {
    id: 'clean-coastline',
    title: 'Clean Coastline Initiative',
    category: 'Waste Reduction',
    status: 'Active',
    location: 'Northern Corfu Coastline (22 km)',
    description:
      "A systematic, data-driven coastal cleanup and marine litter monitoring program spanning 22 km of Northern Corfu's coastline. Monthly cleanup events are supplemented by year-round citizen science data collection on litter types, sources and trends.",
    problem:
      'Northern Corfu\'s beaches and coastal waters receive significant plastic and fishing gear waste, intensified during the tourist season. Plastics enter the marine food chain and damage the local fishing and tourism economies. No systematic monitoring baseline existed before 2022.',
    expectedImpact:
      'Collection and proper disposal of 25+ tonnes of coastal litter annually. Establishment of a long-term litter baseline dataset available to researchers. Advocacy based on sourced data for upstream policy changes on single-use plastics.',
    sdgs: [14, 12, 11, 6],
    progressPercent: 78,
    startDate: '2022-05',
    endDate: '2025-12',
    citizenInvolvement: [
      'Join the monthly coastal cleanup day',
      'Adopt a beach section as a guardian',
      'Record litter data using citizen science protocols',
      'Schools program: bring your class to a monitoring day',
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
      'A comprehensive environmental education program integrating sustainability topics into the curricula of all 11 primary schools in Northern Corfu. The program includes classroom materials, school garden projects, field visits to ZOE project sites, and a student eco-council network.',
    problem:
      'Environmental issues are not systematically addressed in the local school curriculum. Young people lack the knowledge, skills and agency to contribute to sustainability transitions. Engaging children also increases household awareness as they bring learning home.',
    expectedImpact:
      'Reach 1,200 students annually with structured sustainability education. Establish eco-councils in all 11 schools. Create a generation of informed, engaged young environmental stewards who will sustain the ZOE program long-term.',
    sdgs: [4, 13, 15, 17],
    progressPercent: 55,
    startDate: '2023-09',
    endDate: '2026-06',
    citizenInvolvement: [
      'Volunteer as a guest speaker at a local school',
      'Mentor a student eco-council',
      'Donate materials for school gardens',
      'Offer your land for educational field visits',
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
    id: 'blue-economy-tourism',
    title: 'Sustainable Blue Economy Tourism',
    category: 'Sustainable Tourism',
    status: 'Planning',
    location: 'Northern Corfu coastal villages',
    description:
      'Developing a certification and promotion scheme for sustainable tourism operators in Northern Corfu. Participating businesses commit to environmental standards covering energy use, waste management, local sourcing and ecological impact. A digital trail of certified green experiences will be created.',
    problem:
      'Mass tourism places significant pressure on Northern Corfu\'s natural environment and infrastructure. The current tourism model is highly seasonal and economically fragile. A sustainable tourism offer can extend the season, command premium pricing, and genuinely protect the environment that draws visitors.',
    expectedImpact:
      'Certification of 30 tourism businesses by 2026. Development of three themed eco-tourism routes. Estimated 15% increase in shoulder-season tourism. Measurable reduction in tourism-related waste at certified sites.',
    sdgs: [8, 11, 12, 14, 15],
    progressPercent: 18,
    startDate: '2025-01',
    endDate: '2027-06',
    citizenInvolvement: [
      'Recommend local businesses for the scheme',
      'Participate in community consultation sessions',
      'Share your local knowledge as a guide',
      'Provide feedback on draft eco-tourism routes',
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
    location: 'Akharavi River Basin, Northern Corfu',
    description:
      'Citizen science monitoring network for the Akharavi river system, tracking water quality, flow rates and biodiversity indicators. Data collected by trained volunteers feeds into a municipal water quality dashboard and informs infrastructure maintenance decisions.',
    problem:
      'The Akharavi river and its tributaries face pressures from agricultural runoff, septic system leakage and seasonal drought conditions worsened by climate change. Monitoring has historically been infrequent and purely regulatory, missing important seasonal and event-driven dynamics.',
    expectedImpact:
      'Year-round citizen-collected water quality dataset covering 8 monitoring points. Early warning system for pollution events. Baseline for evaluating effectiveness of upstream agricultural practice changes. Engagement of 80+ citizen monitors.',
    sdgs: [6, 3, 13, 15],
    progressPercent: 71,
    startDate: '2023-06',
    endDate: '2025-12',
    citizenInvolvement: [
      'Train as a certified water quality monitor',
      'Join quarterly river condition assessment walks',
      'Report pollution incidents via the platform',
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
      'Pilot program establishing shared composting facilities in three Northern Corfu communities. Organic household waste and green market waste is processed into compost distributed free to local gardeners, farmers and the municipal parks department.',
    problem:
      "Organic waste makes up nearly 40% of Northern Corfu's household waste stream but is currently landfilled. This produces methane, a potent greenhouse gas. Simultaneously, local farmers pay for commercial soil amendments that could be replaced by local compost.",
    expectedImpact:
      'Diversion of 8 tonnes of organic waste per month from landfill. Production of 4 tonnes of compost distributed to 120 recipients. Reduction of municipal waste costs. Pilot methodology ready to scale to further villages.',
    sdgs: [11, 12, 13],
    progressPercent: 100,
    startDate: '2022-03',
    endDate: '2024-03',
    citizenInvolvement: [
      'Register as a compost recipient',
      'Volunteer at the composting facility',
      'Participate in evaluation survey',
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
