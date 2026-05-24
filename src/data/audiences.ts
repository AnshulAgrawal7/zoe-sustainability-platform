// PROTOTYPE DATA — target audience profiles and sensitization strategies for Northern Corfu.
// Based on documented demographic and civic engagement research for the Ionian islands.

import type { TargetAudience } from '../types';

export const targetAudiences: TargetAudience[] = [
  {
    id: 'residents',
    name: 'Permanent Residents',
    icon: 'Home',
    tagline: 'The people who live with the consequences year-round',
    description:
      "Northern Corfu's ~25,000 permanent residents experience both the environmental pressures and the solutions firsthand. They remember the 2018 Temploni landfill crisis, they walk past abandoned olive terraces, and they notice when the beaches are cleaner or dirtier than the year before. Their long-term stake makes them the core of any lasting programme.",
    keyConcerns: [
      'Quality of life and local environment for families',
      'Waste management — Temploni landfill crisis still fresh',
      'Maintaining the landscape and cultural heritage of olive groves',
      'Access to clean beaches and watercourses',
    ],
    channels: [
      { label: 'Facebook groups (Corfu Forum, local village groups)', type: 'online' },
      { label: 'Kafeneion (village coffee-house) word-of-mouth', type: 'offline' },
      { label: 'Local radio (Radio Corfu, local FM stations)', type: 'offline' },
      { label: 'Church and community notice boards', type: 'offline' },
      { label: 'Municipal website and postal notices', type: 'online' },
    ],
    entryPoint:
      'Frame ZOE around community pride and practical improvement — cleaner beaches, less landfill, better village environments. Avoid abstract sustainability language.',
    barrierNote:
      'Historically high mistrust of municipal institutions post-2010 financial crisis. Transparency and visible results matter more than promises.',
  },
  {
    id: 'farmers',
    name: 'Farmers & Olive Growers',
    icon: 'Wheat',
    tagline: 'Stewards of 3.5 million olive trees and centuries of terraced landscape',
    description:
      "Corfu has approximately 3.5 million olive trees — one of the highest densities in Greece — but commercial cultivation has declined sharply since the 1960s. Many groves in Northern Corfu hill villages (Agios Markos, Spartilas, Sokraki) are abandoned or under-maintained. Engaging farmers means speaking to economic viability, family heritage, and practical land management — not abstract environmentalism.",
    keyConcerns: [
      'Economic viability of olive cultivation vs. tourism wages',
      'Soil erosion and collapse of terraced stone walls when groves are abandoned',
      'Fire risk from untended maquis vegetation',
      'EU agricultural policy and its local implications',
    ],
    channels: [
      { label: "Agri-cooperative networks and farmers' associations", type: 'offline' },
      { label: 'Kafeneion in Agios Markos, Spartilas, Sokraki', type: 'offline' },
      { label: 'Peer-to-peer via respected local farmers', type: 'offline' },
      { label: 'Regional agricultural authority (OPEKEPE) contacts', type: 'offline' },
    ],
    entryPoint:
      'Lead with land value protection, soil health, and olive oil quality/PDO certification — not "environment." Show the economic case before the ecological one.',
    barrierNote:
      "Sceptical of EU 'green' mandates seen as external impositions. Must be approached through trusted local intermediaries, not top-down municipal communications.",
  },
  {
    id: 'fishermen',
    name: 'Fishermen & Coastal Workers',
    icon: 'Anchor',
    tagline: 'First witnesses to changes in the marine environment',
    description:
      'The Northern Ionian Sea has the highest concentration of small-scale fishing vessels in Greece. Corfu fishermen observe marine degradation directly — plastic in nets, declining catches, degraded Posidonia seagrass meadows. The Ionian Environment Foundation has already demonstrated fishermen-as-stewards partnerships, with fishing trawlers hauling marine debris as part of funded cleanup programmes.',
    keyConcerns: [
      'Declining fish catches and changes in species distribution',
      'Marine litter fouling fishing gear',
      'Degradation of Posidonia oceanica seagrass meadows',
      'Competition from aquaculture and recreational boat traffic',
    ],
    channels: [
      { label: 'Harbour associations and fishing cooperative networks', type: 'offline' },
      { label: 'Direct outreach at Kassiopi and Agios Spyridon harbours', type: 'offline' },
      { label: 'IEF fishermen-steward programme (proven model)', type: 'offline' },
    ],
    entryPoint:
      'Lead with the fishermen-as-stewards model — marine cleanup activity compensated or recognised. Frame conservation as protecting their livelihood, not restricting it.',
    barrierNote:
      "Distrust of 'green' NGOs is common. The IEF trawler cleanup model works because it engages fishermen as active partners with recognised expertise, not as passive recipients of outreach.",
  },
  {
    id: 'tourism-businesses',
    name: 'Tourism Businesses',
    icon: 'Building2',
    tagline: 'Economic engine — and highest-impact sector for seasonal waste',
    description:
      'Hotels, restaurants, rental agencies, and tour operators drive Northern Corfu\'s economy but also generate its largest seasonal environmental footprint. The 2018 landfill crisis — in which garbage piled up visibly during peak tourist season — was a direct reputational threat to the tourism sector. This creates both motivation and resistance: the sector knows the environment is its product, but faces competitive pressure that discourages short-term cost increases.',
    keyConcerns: [
      'Destination reputation and repeat visitor loyalty',
      "Another garbage crisis like 2018 damaging the island's image",
      'Rising eco-certification expectations from European tourists',
      'Cost of waste management and energy',
    ],
    channels: [
      { label: 'Hotel and restaurant associations (SETE, local chapters)', type: 'offline' },
      { label: 'Business-to-business meetings and peer referrals', type: 'offline' },
      { label: 'Trade media (Greek Tourism Confederation publications)', type: 'online' },
      { label: 'Municipal business newsletters and events', type: 'online' },
    ],
    entryPoint:
      "Lead with the business case: eco-certification reduces waste costs, increases bookings from eco-conscious travellers, and builds resilience against another 'garbage island' story in European media.",
    barrierNote:
      'Short seasonal operating windows create urgency; sustainability investments are deprioritised when staff are stretched. Simplicity and low administrative burden are essential for adoption.',
  },
  {
    id: 'young-people',
    name: 'Young People (16–30)',
    icon: 'Sparkles',
    tagline: 'The generation that will live longest with today\'s environmental decisions',
    description:
      "Young people in Northern Corfu face a particular tension: they are growing up in a place of exceptional natural beauty that is under measurable pressure, in a local economy that offers limited long-term opportunities outside seasonal tourism. Many feel climate anxiety but lack local structures for meaningful action. ZOE's school programme and youth events are designed to create a pathway from awareness to agency.",
    keyConcerns: [
      'Future of the island and its environment',
      'Climate change impacts already visible on Corfu (fires, beach erosion)',
      'Limited local economic alternatives to seasonal tourism work',
      'Feeling disconnected from civic decision-making',
    ],
    channels: [
      { label: 'Instagram and Facebook (visual, shareable content)', type: 'online' },
      { label: 'School eco-councils and university networks', type: 'offline' },
      { label: 'Events and beach cleanups with social media visibility', type: 'offline' },
      { label: 'ZOE youth leadership camp and workshops', type: 'offline' },
    ],
    entryPoint:
      'Offer concrete, visible roles: lead a beach cleanup, run an eco-council, map biodiversity at Antinioti Lagoon. Social shareability of participation matters for this group.',
    barrierNote:
      "Risk of performative engagement ('Instagram environmentalism') without lasting commitment. Design activities with real responsibility and follow-up, not one-off events.",
  },
  {
    id: 'tourists',
    name: 'Visitors & Tourists',
    icon: 'Plane',
    tagline: '4 million visitors per year — part of the problem, and a potential part of the solution',
    description:
      "Corfu receives over 4 million visitors annually, more than 40× its permanent population. Visitors are a key audience for the ZOE platform: many are already frustrated by beach litter, many come specifically for the island's natural beauty, and many are open to responsible travel choices if presented clearly. The platform serves as both education and a participation channel for visitors who want to contribute something positive during their stay.",
    keyConcerns: [
      'Experiencing pristine beaches and natural landscapes',
      'Frustration at visible plastic litter',
      'Wanting to travel responsibly without complex logistics',
      'Supporting local businesses that care about the environment',
    ],
    channels: [
      { label: 'Hotel check-in materials and QR codes', type: 'offline' },
      { label: 'Tourist information centres in Kassiopi and Roda', type: 'offline' },
      { label: 'Google and TripAdvisor (eco-tourism search terms)', type: 'online' },
      { label: 'All For Blue social media (beach cleanups)', type: 'online' },
    ],
    entryPoint:
      'Simple, multilingual, in-the-moment actions: join a beach cleanup, report litter, choose a ZOE-certified local business. Reduce friction to near zero.',
    barrierNote:
      'Transient engagement — visitors stay 1–2 weeks. Focus on memorable single actions, not sustained commitment. Multilingual content (English, German, Italian) is essential.',
  },
];
