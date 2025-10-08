export const monsterTemplates = {
  weak: {
    rat: { 
      name: 'Giant Rat', 
      hp: 2, 
      maxHp: 2, 
      ac: 11, 
      attack: 0, 
      damage: '1d4', 
      saves: { doom: 14, ray: 15, hold: 14, blast: 16, spell: 15 } 
    },
    goblin: { 
      name: 'Goblin', 
      hp: 4, 
      maxHp: 4, 
      ac: 13, 
      attack: 1, 
      damage: '1d6', 
      saves: { doom: 13, ray: 14, hold: 13, blast: 15, spell: 14 } 
    },
    bandit: { 
      name: 'Bandit', 
      hp: 5, 
      maxHp: 5, 
      ac: 12, 
      attack: 2, 
      damage: '1d6+1', 
      saves: { doom: 12, ray: 13, hold: 12, blast: 14, spell: 13 } 
    },
    skeleton: { 
      name: 'Skeleton', 
      hp: 4, 
      maxHp: 4, 
      ac: 13, 
      attack: 1, 
      damage: '1d6', 
      saves: { doom: 10, ray: 13, hold: 10, blast: 14, spell: 11 } 
    }
  },
  medium: {
    wolf: { 
      name: 'Wolf', 
      hp: 11, 
      maxHp: 11, 
      ac: 13, 
      attack: 2, 
      damage: '1d6+1', 
      saves: { doom: 12, ray: 13, hold: 12, blast: 14, spell: 13 } 
    },
    orc: { 
      name: 'Crookhorn Warrior', 
      hp: 9, 
      maxHp: 9, 
      ac: 14, 
      attack: 3, 
      damage: '1d8+1', 
      saves: { doom: 11, ray: 12, hold: 11, blast: 13, spell: 12 } 
    },
    brigand: { 
      name: 'Brigand', 
      hp: 12, 
      maxHp: 12, 
      ac: 14, 
      attack: 3, 
      damage: '1d8+1', 
      saves: { doom: 11, ray: 12, hold: 11, blast: 13, spell: 12 } 
    }
  },
  strong: {
    ogre: { 
      name: 'Ogre', 
      hp: 28, 
      maxHp: 28, 
      ac: 13, 
      attack: 5, 
      damage: '1d10+3', 
      saves: { doom: 8, ray: 9, hold: 8, blast: 10, spell: 9 } 
    },
    owlbear: { 
      name: 'Owlbear', 
      hp: 32, 
      maxHp: 32, 
      ac: 13, 
      attack: 4, 
      damage: '1d8+2', 
      saves: { doom: 7, ray: 8, hold: 7, blast: 9, spell: 8 } 
    }
  },
  dolmenwood: {
    drune_cultist: { 
      name: 'Drune Cultist', 
      hp: 6, 
      maxHp: 6, 
      ac: 12, 
      attack: 2, 
      damage: '1d6', 
      saves: { doom: 11, ray: 12, hold: 11, blast: 13, spell: 12 } 
    },
    fairy_knight: { 
      name: 'Fairy Knight', 
      hp: 24, 
      maxHp: 24, 
      ac: 17, 
      attack: 5, 
      damage: '1d10+2', 
      saves: { doom: 6, ray: 7, hold: 6, blast: 8, spell: 7 } 
    }
  }
}
