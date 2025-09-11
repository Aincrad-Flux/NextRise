// Mock projects dataset for local CRUD on the Projects page
// Fields: id, title, description, progress (0-100), investorsWanted, amountNeeded (EUR), tags[]

export const projectMock = [
  {
    id: 'p-1',
    title: 'GreenGrid Optimizer',
    description: 'Energy optimisation tool for real estate portfolios. Pilot deployment live on 3 sites.',
    progress: 45,
    investorsWanted: 3,
    amountNeeded: 250000,
    tags: ['Greentech', 'SaaS']
  },
  {
    id: 'p-2',
    title: 'AstraBio Analytics',
    description: 'AI assisted biological analysis platform for clinical labs. Certification in progress.',
    progress: 60,
    investorsWanted: 2,
    amountNeeded: 400000,
    tags: ['Health', 'AI']
  },
  {
    id: 'p-3',
    title: 'FinFlow Mobile',
    description: 'Mobile cashflow management app for small businesses, private beta open.',
    progress: 30,
    investorsWanted: 5,
    amountNeeded: 150000,
    tags: ['Fintech', 'Mobile']
  },
  {
    id: 'p-4',
    title: 'AeroSense Drones',
    description: 'Autonomous inspection drones for solar farms reducing manual checks by 70%.',
    progress: 52,
    investorsWanted: 4,
    amountNeeded: 320000,
    tags: ['Drones', 'Energy', 'AI']
  },
  {
    id: 'p-5',
    title: 'MedTrack Cloud',
    description: 'Cloud based patient adherence tracking with secure data exchange APIs.',
    progress: 68,
    investorsWanted: 2,
    amountNeeded: 500000,
    tags: ['Health', 'Cloud', 'SaaS']
  },
  {
    id: 'p-6',
    title: 'QuantumFleet',
    description: 'Route optimisation engine using quantum-inspired heuristics for logistics.',
    progress: 25,
    investorsWanted: 6,
    amountNeeded: 800000,
    tags: ['Logistics', 'AI', 'DeepTech']
  },
  {
    id: 'p-7',
    title: 'EduSpark XR',
    description: 'Immersive XR learning modules for STEM classrooms with real-time analytics.',
    progress: 40,
    investorsWanted: 3,
    amountNeeded: 350000,
    tags: ['EdTech', 'XR', 'Analytics']
  },
  {
    id: 'p-8',
    title: 'AgriSoil SensorNet',
    description: 'Low-power soil sensor mesh network improving fertilizer efficiency.',
    progress: 55,
    investorsWanted: 4,
    amountNeeded: 270000,
    tags: ['AgriTech', 'IoT', 'Greentech']
  },
  {
    id: 'p-9',
    title: 'SafeID Vault',
    description: 'Decentralised identity storage with zero-knowledge verification layer.',
    progress: 35,
    investorsWanted: 5,
    amountNeeded: 600000,
    tags: ['Cybersecurity', 'Blockchain']
  },
  {
    id: 'p-10',
    title: 'NeuroMeal Coach',
    description: 'Personalised nutrition recommender leveraging continuous glucose monitoring.',
    progress: 48,
    investorsWanted: 3,
    amountNeeded: 290000,
    tags: ['Health', 'AI', 'Wearables']
  }
];

// Optional: initial tag suggestions for MultiSelect or inputs
export const projectTagSuggestions = [
  'AI', 'SaaS', 'Greentech', 'Fintech', 'Mobile', 'Blockchain', 'EdTech', 'Health', 'IoT'
];
