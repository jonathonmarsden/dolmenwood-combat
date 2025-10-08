// Dice rolling utilities for Dolmenwood combat

export function rollDice(sides, count = 1) {
  let total = 0
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1
  }
  return total
}

export function parseDiceString(diceString) {
  const cleaned = (diceString || '').toLowerCase().replace(/\s+/g, '')
  const match = cleaned.match(/(\d+)d(\d+)([+-]\d+)?/)
  
  if (match) {
    return {
      count: parseInt(match[1], 10),
      sides: parseInt(match[2], 10),
      modifier: match[3] ? parseInt(match[3], 10) : 0
    }
  }
  
  // Try to parse as a simple number
  const asNumber = parseInt(cleaned, 10)
  if (!isNaN(asNumber)) {
    return { count: 0, sides: 0, modifier: asNumber }
  }
  
  // Default to 1d6
  return { count: 1, sides: 6, modifier: 0 }
}

export function rollDamage(damageString, strModifier = 0) {
  const { count, sides, modifier } = parseDiceString(damageString)
  
  if (count === 0) {
    // Fixed damage
    return Math.max(1, modifier)
  }
  
  let damage = rollDice(sides, count) + modifier + strModifier
  return Math.max(1, damage)
}

export function rollAttack(attacker, targetAC, advantage = 'normal', isRanged = false) {
  const roll1 = rollDice(20)
  const roll2 = rollDice(20)
  
  let finalRoll
  if (advantage === 'advantage') {
    finalRoll = Math.max(roll1, roll2)
  } else if (advantage === 'disadvantage') {
    finalRoll = Math.min(roll1, roll2)
  } else {
    finalRoll = roll1
  }
  
  const total = finalRoll + (attacker.attack || 0)
  const hit = finalRoll === 20 || (finalRoll !== 1 && total >= targetAC)
  
  let damage = 0
  if (hit && attacker.damage) {
    damage = rollDamage(attacker.damage, isRanged ? 0 : attacker.strMod)
    // Critical hit on natural 20
    if (finalRoll === 20) {
      damage *= 2
    }
  }
  
  return {
    roll: finalRoll,
    roll1,
    roll2,
    total,
    hit,
    damage,
    advantage,
    critical: finalRoll === 20,
    fumble: finalRoll === 1,
    isRanged
  }
}

export function rollMorale(combatant) {
  const die1 = rollDice(6)
  const die2 = rollDice(6)
  const roll = die1 + die2
  
  const baseMorale = combatant.morale || 8
  
  // Calculate morale modifiers
  let moraleModifier = 0
  
  // HP-based modifiers
  const hpPercentage = combatant.maxHp ? combatant.hp / combatant.maxHp : 1
  if (hpPercentage <= 0) {
    moraleModifier -= 99
  } else if (hpPercentage <= 0.25) {
    moraleModifier -= 2
  } else if (hpPercentage <= 0.5) {
    moraleModifier -= 1
  }
  
  const finalMorale = Math.max(2, baseMorale + moraleModifier)
  const passed = roll <= finalMorale
  
  return {
    roll,
    dice: [die1, die2],
    morale: baseMorale,
    finalMorale,
    modifier: moraleModifier,
    passed
  }
}

export function rollSavingThrow(combatant, saveType) {
  const roll = rollDice(20)
  const target = (combatant.saves && combatant.saves[saveType]) || 14
  const passed = roll >= target
  
  return {
    roll,
    target,
    passed,
    saveType,
    critical: roll === 20,
    fumble: roll === 1
  }
}

export function rollInitiative(dexMod = 0) {
  return rollDice(6) + dexMod
}

// Dolmenwood Skill Check (d6, roll >= target)
export function rollSkillCheck(target = 6, modifier = 0) {
  const roll = rollDice(6)
  const total = roll + modifier
  const passed = roll === 6 || (roll !== 1 && total >= target)
  
  return {
    roll,
    modifier,
    total,
    target,
    passed,
    critical: roll === 6,
    fumble: roll === 1
  }
}

// Dolmenwood Ability Check (d6 + modifier >= 4)
export function rollAbilityCheck(modifier = 0) {
  const roll = rollDice(6)
  const total = roll + modifier
  const target = 4
  const passed = total >= target
  
  return {
    roll,
    modifier,
    total,
    target,
    passed
  }
}

// Concentration Check (d20 >= 10 or half damage taken, whichever is higher)
export function rollConcentrationCheck(damageTaken = 0) {
  const roll = rollDice(20)
  const dc = Math.max(10, Math.floor(damageTaken / 2))
  const passed = roll >= dc
  
  return {
    roll,
    dc,
    passed,
    damageTaken
  }
}

// Turn Undead (2d6 roll on turning table)
export function rollTurnUndead(clericLevel = 1) {
  const die1 = rollDice(6)
  const die2 = rollDice(6)
  const roll = die1 + die2
  
  // Simplified turning results based on roll
  let result = 'Failed'
  if (roll >= 11) {
    result = 'Destroyed'
  } else if (roll >= 9) {
    result = 'Turned'
  } else if (roll >= 7) {
    result = '2d6 HD Turned'
  }
  
  return {
    roll,
    dice: [die1, die2],
    result,
    clericLevel
  }
}
