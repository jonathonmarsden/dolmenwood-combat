// Declared actions that must be chosen before initiative in Dolmenwood
export const declaredActions = {
  none: { 
    name: 'No Declaration Needed', 
    description: 'Standard actions like attacking, moving, etc.',
    icon: '⚔️',
    restrictions: []
  },
  flee: { 
    name: 'Flee from Melee', 
    description: 'Turn and run from melee combat',
    icon: '🏃',
    restrictions: [
      'Forfeit attack this round',
      'Opponents get +2 to hit',
      'No shield AC bonus'
    ]
  },
  cast: { 
    name: 'Cast Spell/Use Rune', 
    description: 'Cast a spell or use a fairy rune',
    icon: '✨',
    restrictions: [
      'Cannot move this round',
      'Spell/rune disrupted if hit before acting'
    ]
  }
}

// Optional house rules that groups may use
export const optionalDeclaredActions = {
  parry: { 
    name: 'Parry (House Rule)', 
    description: 'Focus on defense',
    icon: '🛡️',
    restrictions: ['Cannot attack', 'Gain +2 AC bonus']
  },
  charge: {
    name: 'Charge (House Rule)',
    description: 'Rush into combat',
    icon: '🐎',
    restrictions: ['Must move at least 20 feet', '+2 attack, -2 AC']
  },
  aim: {
    name: 'Aim (House Rule)',
    description: 'Take careful aim',
    icon: '🎯',
    restrictions: ['Cannot move', '+2 to ranged attack']
  }
}