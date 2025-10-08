import { useState } from 'react'
import useCombatStore from '../store/combatStore'
import { rollSkillCheck, rollAbilityCheck, rollConcentrationCheck, rollTurnUndead } from '../utils/diceRolls'

export function SpecialChecks({ combatant }) {
  const { setLastRoll } = useCombatStore()
  const [skillModifier, setSkillModifier] = useState(0)
  const [abilityModifier, setAbilityModifier] = useState(0)
  const [damageForConcentration, setDamageForConcentration] = useState(0)

  const handleSkillCheck = (skillName, target = 6) => {
    const result = rollSkillCheck(target, skillModifier)
    setLastRoll({
      type: 'skill',
      combatant: combatant.name,
      skillName,
      ...result
    })
  }

  const handleAbilityCheck = (abilityName) => {
    const result = rollAbilityCheck(abilityModifier)
    setLastRoll({
      type: 'ability',
      combatant: combatant.name,
      abilityName,
      ...result
    })
  }

  const handleConcentrationCheck = () => {
    const result = rollConcentrationCheck(damageForConcentration)
    setLastRoll({
      type: 'concentration',
      combatant: combatant.name,
      ...result
    })
  }

  const handleTurnUndead = () => {
    // Assume cleric level from HD or default to 1
    const clericLevel = Math.max(1, Math.floor(combatant.maxHp / 8))
    const result = rollTurnUndead(clericLevel)
    setLastRoll({
      type: 'turnUndead',
      combatant: combatant.name,
      ...result
    })
  }

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-semibold mb-2">Special Checks</h4>
      
      {/* Skill Checks */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs">Skill Check (d6):</span>
          <input
            type="number"
            value={skillModifier}
            onChange={(e) => setSkillModifier(parseInt(e.target.value) || 0)}
            className="w-16 px-1 py-0.5 text-xs border rounded"
            placeholder="Mod"
          />
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => handleSkillCheck('Listen', 6)}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
          >
            Listen
          </button>
          <button
            onClick={() => handleSkillCheck('Search', 6)}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
          >
            Search
          </button>
          <button
            onClick={() => handleSkillCheck('Survival', 6)}
            className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs"
          >
            Survival
          </button>
        </div>
      </div>

      {/* Ability Checks */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs">Ability Check (d6+mod ≥ 4):</span>
          <input
            type="number"
            value={abilityModifier}
            onChange={(e) => setAbilityModifier(parseInt(e.target.value) || 0)}
            className="w-16 px-1 py-0.5 text-xs border rounded"
            placeholder="Mod"
          />
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => handleAbilityCheck('STR')}
            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
          >
            STR
          </button>
          <button
            onClick={() => handleAbilityCheck('DEX')}
            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
          >
            DEX
          </button>
          <button
            onClick={() => handleAbilityCheck('CON')}
            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
          >
            CON
          </button>
          <button
            onClick={() => handleAbilityCheck('INT')}
            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
          >
            INT
          </button>
          <button
            onClick={() => handleAbilityCheck('WIS')}
            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
          >
            WIS
          </button>
          <button
            onClick={() => handleAbilityCheck('CHA')}
            className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs"
          >
            CHA
          </button>
        </div>
      </div>

      {/* Concentration Check */}
      {combatant.concentratingOn && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs">Concentration (damage taken):</span>
            <input
              type="number"
              value={damageForConcentration}
              onChange={(e) => setDamageForConcentration(parseInt(e.target.value) || 0)}
              className="w-16 px-1 py-0.5 text-xs border rounded"
              placeholder="Dmg"
            />
            <button
              onClick={handleConcentrationCheck}
              className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded text-xs"
            >
              Check
            </button>
          </div>
        </div>
      )}

      {/* Turn Undead */}
      {combatant.isCleric && (
        <button
          onClick={handleTurnUndead}
          className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-xs"
        >
          Turn Undead
        </button>
      )}
    </div>
  )
}
