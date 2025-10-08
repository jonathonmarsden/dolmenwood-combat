export const statusEffects = [
  { 
    id: 'poisoned', 
    name: 'Poisoned', 
    color: 'bg-green-500', 
    duration: 10, 
    description: 'Suffers ongoing poison damage or penalties'
  },
  { 
    id: 'frightened', 
    name: 'Frightened', 
    color: 'bg-yellow-500', 
    duration: 5, 
    description: 'Cannot willingly move closer to source of fear'
  },
  { 
    id: 'bleeding', 
    name: 'Bleeding', 
    color: 'bg-red-500', 
    duration: 3, 
    description: 'Takes damage at start of each turn'
  },
  { 
    id: 'stunned', 
    name: 'Stunned', 
    color: 'bg-purple-500', 
    duration: 1, 
    description: 'Cannot take actions or move'
  },
  { 
    id: 'concentrating', 
    name: 'Concentrating', 
    color: 'bg-blue-500', 
    duration: 0, 
    description: 'Maintaining a spell - breaks if damaged'
  }
]
