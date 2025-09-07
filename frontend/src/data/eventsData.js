// Mock events data keyed by ISO date (YYYY-MM-DD)
// Each event: { id, title, time, location, description, tags: string[] }

const eventsByDate = {
  // Current month examples (adjust freely)
  '2025-09-05': [
    {
      id: 'ev-1',
      title: 'Demo Day: AI Startups',
      time: '10:00 - 12:00',
      location: 'Online',
      description: 'Pitch session featuring 8 AI startups with live Q&A.',
      tags: ['Pitch', 'AI', 'Online']
    },
    {
      id: 'ev-2',
      title: 'Networking Breakfast',
      time: '08:30 - 09:45',
      location: 'Paris Station F',
      description: 'Casual breakfast to meet founders and investors.',
      tags: ['Networking', 'Community']
    }
  ],
  '2025-09-07': [
    {
      id: 'ev-3',
      title: 'Web3 Builders Meetup',
      time: '18:00 - 20:00',
      location: 'Lyon Tech Hub',
      description: 'Lightning talks on L2s and real-world use-cases.',
      tags: ['Web3', 'Meetup']
    }
  ],
  '2025-09-18': [
    {
      id: 'ev-4',
      title: 'Hiring Fair: Scaleups',
      time: '14:00 - 17:00',
      location: 'Remote',
      description: 'Fast 1:1 interviews with teams hiring this quarter.',
      tags: ['Hiring', 'Careers']
    }
  ],
  // Next month examples
  '2025-10-02': [
    {
      id: 'ev-5',
      title: 'SaaS Pricing Workshop',
      time: '09:30 - 11:00',
      location: 'Bordeaux',
      description: 'Hands-on session to optimize your pricing strategy.',
      tags: ['Workshop', 'SaaS']
    }
  ]
}

export default eventsByDate
