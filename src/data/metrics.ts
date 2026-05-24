// PROTOTYPE DATA — illustrative impact metrics for the ZOE program overview
// All values are fictional prototype data for demonstration purposes only.

import type { ImpactMetric, ParticipationOption } from '../types';

export const impactMetrics: ImpactMetric[] = [
  {
    label: 'Active Projects',
    value: 8,
    unit: 'projects',
    icon: 'Leaf',
    description: 'Environmental action projects currently running or recently completed under the ZOE programme.',
    trend: 'up',
  },
  {
    label: 'Citizens Engaged',
    value: 4963,
    unit: 'participants',
    icon: 'Users',
    description: 'Unique participants across all ZOE project activities, events and monitoring programs (cumulative).',
    trend: 'up',
  },
  {
    label: 'Waste Diverted',
    value: '65.5',
    unit: 'tonnes/month',
    icon: 'Recycle',
    description: 'Solid waste diverted from landfill through recycling and composting programs.',
    trend: 'up',
  },
  {
    label: 'Coastline Monitored',
    value: 22,
    unit: 'km',
    icon: 'Waves',
    description: 'Kilometres of Northern Corfu coastline covered by regular ZOE litter monitoring and cleanup programs.',
    trend: 'stable',
  },
  {
    label: 'Habitats Restored',
    value: '23.4',
    unit: 'hectares',
    icon: 'TreePine',
    description: 'Terrestrial and wetland habitat restored or under active restoration management.',
    trend: 'up',
  },
  {
    label: 'GHG Avoided',
    value: '14.7',
    unit: 'tCO2eq/year',
    icon: 'Wind',
    description: 'Estimated greenhouse gas emissions avoided through organic waste diversion (composting programme).',
    trend: 'up',
  },
  {
    label: 'Students Reached',
    value: 870,
    unit: 'students',
    icon: 'GraduationCap',
    description: 'Students in Northern Corfu primary schools currently receiving structured environmental education through ZOE.',
    trend: 'up',
  },
  {
    label: 'SDGs Addressed',
    value: 9,
    unit: 'SDGs',
    icon: 'Globe',
    description: 'UN Sustainable Development Goals directly addressed by one or more ZOE project activities.',
    trend: 'stable',
  },
];

export const participationOptions: ParticipationOption[] = [
  {
    id: 'submit-idea',
    title: 'Submit an Idea',
    description:
      'Have an idea for a new environmental initiative in your community? Share it with the ZOE team. All ideas are reviewed by the municipal coordination committee.',
    icon: 'Lightbulb',
    actionLabel: 'Submit Your Idea',
  },
  {
    id: 'volunteer',
    title: 'Volunteer',
    description:
      'Lend your time, skills or local knowledge to an active project. Opportunities range from field restoration work to data entry, event organisation and school presentations.',
    icon: 'HandHeart',
    actionLabel: 'Sign Up to Volunteer',
  },
  {
    id: 'join-event',
    title: 'Join an Event',
    description:
      'Attend one of the regular ZOE events: cleanup days, biodiversity walks, workshops, community forums, and more. Family-friendly options available.',
    icon: 'Calendar',
    actionLabel: 'Browse Events',
  },
  {
    id: 'report-issue',
    title: 'Report an Environmental Issue',
    description:
      'Spotted illegal dumping, water pollution, or habitat damage? Report it through the platform and the municipality will be notified. Each report is tracked and responded to.',
    icon: 'AlertTriangle',
    actionLabel: 'Report an Issue',
  },
  {
    id: 'feedback',
    title: 'Give Feedback',
    description:
      'Tell us what you think about the ZOE programme, which projects matter most to you, or how we can improve citizen participation. Your input shapes future iterations.',
    icon: 'MessageSquare',
    actionLabel: 'Share Feedback',
  },
];
