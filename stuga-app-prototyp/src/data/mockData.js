// Mock data for Stuga demo
// Real app will get this from CivicBase/SQLite

export const currentUser = {
  id: 'user-1',
  name: 'Du',
  heartsBalance: 180,
};

export const neighbors = [
  {
    id: 'neighbor-1',
    name: 'Anna Svensson',
    distance: 50,
    direction: '↗️',
    connectionType: 'direct', // 'direct', 'mesh-1', 'mesh-2'
    heartsBalance: 245,
    resourcesOffered: ['Ved', 'Generator'],
    resourcesNeeded: [],
    resources: [
      {
        id: 'resource-1',
        type: 'offer',
        category: 'värme',
        title: 'Ved, ca 0.5 m³',
        description: 'Sågade träd förra veckan, kan dela med 2-3 familjer',
      },
      {
        id: 'resource-2',
        type: 'offer',
        category: 'värme',
        title: 'Generator, 5kW',
        description: 'Diesel, kan köra 8h/dag. Vi har eldvärme själva.',
      },
    ],
  },
  {
    id: 'neighbor-2',
    name: 'Sven Andersson',
    distance: 120,
    direction: '↙️',
    connectionType: 'direct',
    heartsBalance: 180,
    resourcesOffered: [],
    resourcesNeeded: ['Mat', 'Värme'],
    resources: [
      {
        id: 'resource-3',
        type: 'need',
        category: 'mat',
        title: 'Behöver mat för familj',
        description: 'Har 4 personer hemma, konserver eller torkad mat fungerar bra',
      },
    ],
  },
  {
    id: 'neighbor-3',
    name: 'Maria Johansson',
    distance: 350,
    direction: '↖️',
    connectionType: 'mesh-1',
    heartsBalance: 320,
    resourcesOffered: ['Matlagning'],
    resourcesNeeded: [],
    resources: [
      {
        id: 'resource-4',
        type: 'offer',
        category: 'mat',
        title: 'Matlagning',
        description: 'Kan laga mat för flera familjer om någon har råvaror',
      },
    ],
  },
  {
    id: 'neighbor-4',
    name: 'Erik Nilsson',
    distance: 480,
    direction: '↘️',
    connectionType: 'mesh-2',
    heartsBalance: 95,
    resourcesOffered: [],
    resourcesNeeded: ['Verktyg'],
    resources: [
      {
        id: 'resource-5',
        type: 'need',
        category: 'verktyg',
        title: 'Behöver såg och yxa',
        description: 'För att hugga ved',
      },
    ],
  },
];

export const heartsHistory = [
  {
    id: 'tx-1',
    type: 'sent',
    toUser: 'Anna Svensson',
    amount: 50,
    reason: 'Tack för veden!',
    timestamp: '2024-12-25 14:30',
    confirmed: true,
  },
  {
    id: 'tx-2',
    type: 'sent',
    toUser: 'Sven Andersson',
    amount: 30,
    reason: 'Hjälp med snöskottning',
    timestamp: '2024-12-24 09:15',
    confirmed: false,
  },
  {
    id: 'tx-3',
    type: 'received',
    fromUser: 'Maria Johansson',
    amount: 75,
    reason: 'För matlagningen!',
    timestamp: '2024-12-23 18:00',
    confirmed: true,
  },
  {
    id: 'tx-4',
    type: 'received',
    fromUser: 'System',
    amount: 100,
    reason: 'Välkommen till Stuga!',
    timestamp: '2024-12-20 12:00',
    confirmed: true,
  },
];

export const resourceCategories = [
  { id: 'mat', label: 'Mat', icon: '🥖' },
  { id: 'värme', label: 'Värme', icon: '🔥' },
  { id: 'verktyg', label: 'Verktyg', icon: '🔨' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'kunskap', label: 'Kunskap', icon: '📚' },
  { id: 'boende', label: 'Boende', icon: '🏠' },
  { id: 'första_hjälpen', label: 'Första hjälpen', icon: '⚕️' },
  { id: 'annat', label: 'Annat', icon: '⭕' },
];
