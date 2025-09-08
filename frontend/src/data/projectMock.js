// Mock projects dataset for local CRUD on the Projects page
// Fields: id, title, description, progress (0-100), investorsWanted, amountNeeded (EUR), tags[]

export const projectMock = [
  {
    id: 'p-1',
    title: 'GreenGrid Optimizer',
    description: 'Outil d’optimisation énergétique pour parcs immobiliers. Déploiement pilote sur 3 sites.',
    progress: 45,
    investorsWanted: 3,
    amountNeeded: 250000,
    tags: ['Greentech', 'SaaS']
  },
  {
    id: 'p-2',
    title: 'AstraBio Analytics',
    description: 'Suite d’analyses biologiques assistées par IA pour labos cliniques. Certification en cours.',
    progress: 60,
    investorsWanted: 2,
    amountNeeded: 400000,
    tags: ['Health', 'AI']
  },
  {
    id: 'p-3',
    title: 'FinFlow Mobile',
    description: 'Application mobile de gestion de flux de trésorerie pour TPE/PME, bêta privée ouverte.',
    progress: 30,
    investorsWanted: 5,
    amountNeeded: 150000,
    tags: ['Fintech', 'Mobile']
  }
];

// Optional: initial tag suggestions for MultiSelect or inputs
export const projectTagSuggestions = [
  'AI', 'SaaS', 'Greentech', 'Fintech', 'Mobile', 'Blockchain', 'EdTech', 'Health', 'IoT'
];
