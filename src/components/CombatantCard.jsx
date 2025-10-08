import { useState } from 'react'
import useCombatStore from '../store/combatStore'
import { statusEffects } from '../data/statusEffects'
import { declaredActions } from '../data/declaredActions'
import { rollAttack, rollMorale, rollSavingThrow } from '../utils/diceRolls'
import { SpecialChecks } from './SpecialChecks'

export function CombatantCard({ combatant, index, isActive }) {
  const {
    updateCombatant,
    removeCombatant,
    applyDamage,
    applyHealing,
    addStatus,
    removeStatus,
    targetingMode,
    setTargetingMode,
    setLastRoll,
    combatPhase
  } = useCombatStore()
  
  const [selectedStatus, setSelectedStatus] = useState('')
  const [concentrationInput, setConcentrationInput] = useState(combatant.concentratingOn || '')
  const [showSpecialChecks, setShowSpecialChecks] = useState(false)

  const isDead = combatant.hp <= 0
  const isBloodied = combatant.hp <= combatant.maxHp / 2
  const hpPercentage = (combatant.hp / combatant.maxHp) * 100

  const handleAttack = (isRanged = false) => {
    if (isDead) return
    
    // Check if they declared flee
    if (combatant.declaredAction === 'flee') {
      alert(`Cannot attack - declared ${declaredActions[combatant.declaredAction].name}`)
      return
    }
    
    setTargetingMode({ attacker: combatant.id, type: 'attack', isRanged })
  }

  const handleMoraleCheck = () => {
    if (isDead) return
    const result = rollMorale(combatant)
    setLastRoll({
      type: 'morale',
      combatant: combatant.name,
      ...result
    })
  }

  const handleSave = (saveType) => {
    if (isDead || !saveType) return
    const result = rollSavingThrow(combatant, saveType)
    setLastRoll({
      type: 'save',
      combatant: combatant.name,
      saveType,
      ...result
    })
  }

  const handleDeclaredAction = (action) => {
    updateCombatant(combatant.id, { declaredAction: action })
  }

  const getModifiedAC = () => {
    let ac = combatant.ac
    // Apply parry bonus if declared
    if (combatant.declaredAction === 'parry') ac += 2
    // Apply charge penalty if declared
    if (combatant.declaredAction === 'charge') ac -= 2
    // Apply status effects
    combatant.statuses?.forEach(status => {
      const effect = statusEffects[status.id]
      if (effect?.acModifier) ac += effect.acModifier
    })
    return ac
  }

  // Handle being a target
  if (targetingMode && targetingMode.attacker !== combatant.id) {
    const handleTargetClick = () => {
      if (targetingMode.type === 'attack') {
        const attacker = useCombatStore.getState().combatants.find(c => c.id === targetingMode.attacker)
        if (attacker) {
          const result = rollAttack(attacker, getModifiedAC(), 'normal', targetingMode.isRanged)
          setLastRoll({
            type: 'attack',
            combatant: attacker.name,
            target: combatant.name,
            targetAC: getModifiedAC(),
            ...result
          })
          if (result.hit && result.damage > 0) {
            applyDamage(combatant.id, result.damage)
            // Check concentration if target is spellcaster and was concentrating
            if (combatant.concentratingOn && combatant.isSpellcaster) {
              alert(`${combatant.name} must make a concentration check!`)
            }
          }
        }
        setTargetingMode(null)
      }
    }

    return (
      <div
        onClick={handleTargetClick}
        className={`p-4 rounded-lg cursor-pointer animate-pulse border-4 
          ${isActive ? 'border-blue-500 bg-blue-50' : 'border-red-500 bg-red-50'}`}
      >
        <div className="text-center">
          <div className="text-2xl font-bold">{combatant.name}</div>
          <div className="text-lg">AC: {getModifiedAC()}</div>
          <div className="text-sm mt-2">Click to target</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-lg border-2 ${
      isActive ? 'border-blue-500 bg-blue-50' : 
      isDead ? 'border-gray-500 bg-gray-100 opacity-75' : 
      'border-gray-300 bg-white'
    }`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            {combatant.name}
            {isActive && <span className="text-blue-500">⚡</span>}
            {isDead && <span className="text-red-500">💀</span>}
          </h3>
          <div className="text-sm text-gray-600">
            Initiative: {combatant.initiative || 0} | AC: {getModifiedAC()} | Attack: +{combatant.attack}
          </div>
        </div>
        <button
          onClick={() => removeCombatant(combatant.id)}
          className="text-red-500 hover:text-red-700"
        >
          ✕
        </button>
      </div>

      {/* HP Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span>HP: {combatant.hp}/{combatant.maxHp}</span>
          <span className={isBloodied ? 'text-red-600 font-bold' : ''}>
            {isBloodied && 'Bloodied'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 relative">
          <div
            className={`h-full rounded-full transition-all ${
              isDead ? 'bg-gray-500' :
              isBloodied ? 'bg-red-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.max(0, hpPercentage)}%` }}
          />
        </div>
      </div>

      {/* Declared Action (if in declaring phase) */}
      {combatPhase === 'declaring' && !isDead && (
        <div className="mb-3">
          <label className="text-sm font-semibold block mb-1">Declared Action:</label>
          <select
            value={combatant.declaredAction || 'none'}
            onChange={(e) => handleDeclaredAction(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {Object.entries(declaredActions).map(([key, action]) => (
              <option key={key} value={key}>
                {action.icon} {action.name}
              </option>
            ))}
          </select>
          {combatant.declaredAction && combatant.declaredAction !== 'none' && (
            <div className="text-xs text-gray-600 mt-1">
              {declaredActions[combatant.declaredAction].restrictions.map((r, i) => (
                <div key={i}>• {r}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Status Effects */}
      {combatant.statuses && combatant.statuses.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-semibold mb-1">Status Effects:</div>
          <div className="flex flex-wrap gap-1">
            {combatant.statuses.map((status, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800"
                title={statusEffects[status.id]?.description}
              >
                {statusEffects[status.id]?.name || status.id}
                {status.rounds > 0 && ` (${status.rounds})`}
                <button
                  onClick={() => removeStatus(combatant.id, i)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Concentration */}
      {combatant.isSpellcaster && (
        <div className="mb-3 flex items-center gap-2">
          <label className="text-sm">Concentrating on:</label>
          <input
            type="text"
            value={concentrationInput}
            onChange={(e) => setConcentrationInput(e.target.value)}
            onBlur={() => updateCombatant(combatant.id, { concentratingOn: concentrationInput })}
            className="flex-1 border rounded px-2 py-1 text-sm"
            placeholder="Spell name..."
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={() => {
            const damage = parseInt(prompt('Apply damage:') || '0')
            if (damage > 0) applyDamage(combatant.id, damage)
          }}
          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
          disabled={isDead}
        >
          Damage
        </button>
        <button
          onClick={() => {
            const healing = parseInt(prompt('Apply healing:') || '0')
            if (healing > 0) applyHealing(combatant.id, healing)
          }}
          className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
        >
          Heal
        </button>
      </div>

      {/* Combat Actions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Status Effect Selector */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            if (e.target.value) {
              addStatus(combatant.id, e.target.value)
              setSelectedStatus('')
            }
          }}
          className="border rounded px-2 py-1 text-sm"
          disabled={isDead}
        >
          <option value="">Add Status...</option>
          {Object.entries(statusEffects).map(([key, effect]) => (
            <option key={key} value={key}>{effect.name}</option>
          ))}
        </select>

        {/* Attack Buttons */}
        <button
          onClick={() => handleAttack(false)}
          className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm"
          disabled={isDead}
        >
          ⚔️ Melee
        </button>
        <button
          onClick={() => handleAttack(true)}
          className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm"
          disabled={isDead}
        >
          🏹 Ranged
        </button>

        {/* Morale Check */}
        <button
          onClick={handleMoraleCheck}
          className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm"
          disabled={isDead}
        >
          Morale
        </button>

        {/* Saving Throws */}
        <select
          onChange={(e) => {
            handleSave(e.target.value)
            e.target.value = ''
          }}
          className="border rounded px-2 py-1 text-sm"
          disabled={isDead}
          defaultValue=""
        >
          <option value="">Save…</option>
          <option value="doom">Doom</option>
          <option value="ray">Ray</option>
          <option value="hold">Hold</option>
          <option value="blast">Blast</option>
          <option value="spell">Spell</option>
        </select>

        {/* Special Checks Toggle */}
        <button
          onClick={() => setShowSpecialChecks(!showSpecialChecks)}
          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm"
          disabled={isDead}
        >
          {showSpecialChecks ? 'Hide' : 'Show'} Checks
        </button>
      </div>

      {/* Special Checks Section */}
      {showSpecialChecks && !isDead && (
        <SpecialChecks combatant={combatant} />
      )}
    </div>
  )
}