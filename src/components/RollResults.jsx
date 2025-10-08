import useCombatStore from '../store/combatStore'

export function RollResults() {
  const { lastRoll, setLastRoll } = useCombatStore()
  
  if (!lastRoll) return null

  return (
    <div className={`mb-6 p-4 rounded-lg border-2 ${
      lastRoll.type === 'attack' 
        ? (lastRoll.hit ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
        : lastRoll.passed 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-yellow-500 bg-yellow-50'
    }`}>
      <div className="flex justify-between items-start">
        <div>
          {lastRoll.type === 'attack' && (
            <div>
              <h4 className="font-bold text-lg">
                {lastRoll.hit ? 'HIT!' : 'MISS!'} — {lastRoll.combatant} → {lastRoll.target}
              </h4>
              <p className="text-sm mt-1">
                Roll: {lastRoll.roll} + {lastRoll.total - lastRoll.roll} = {lastRoll.total} vs AC {lastRoll.targetAC}
                {lastRoll.hit && ` | Damage: ${lastRoll.damage}`}
                {lastRoll.critical && ' | CRITICAL HIT!'}
                {lastRoll.fumble && ' | FUMBLE!'}
              </p>
            </div>
          )}
          
          {lastRoll.type === 'morale' && (
            <div>
              <h4 className="font-bold text-lg">
                {lastRoll.passed ? 'MORALE PASSED' : 'MORALE FAILED'} — {lastRoll.combatant}
              </h4>
              <p className="text-sm mt-1">
                Roll: {lastRoll.roll} vs Morale {lastRoll.finalMorale}
                {lastRoll.modifier !== 0 && ` (Base ${lastRoll.morale} ${lastRoll.modifier >= 0 ? '+' : ''}${lastRoll.modifier})`}
              </p>
            </div>
          )}
          
          {lastRoll.type === 'save' && (
            <div>
              <h4 className="font-bold text-lg">
                {lastRoll.passed ? 'SAVE PASSED' : 'SAVE FAILED'} — {lastRoll.combatant}
              </h4>
              <p className="text-sm mt-1">
                {lastRoll.saveType.toUpperCase()} Save: {lastRoll.roll} vs {lastRoll.target}
                {lastRoll.critical && ' | NATURAL 20!'}
                {lastRoll.fumble && ' | NATURAL 1!'}
              </p>
            </div>
          )}
          
          {lastRoll.type === 'skill' && (
            <div>
              <h4 className="font-bold text-lg">
                {lastRoll.passed ? 'Success!' : 'Failed!'} — {lastRoll.combatant}
              </h4>
              <p className="text-sm mt-1">
                {lastRoll.skillName}: {lastRoll.roll} + {lastRoll.modifier} = {lastRoll.total} vs {lastRoll.target}
                {lastRoll.critical && ' | Natural 6!'}
                {lastRoll.fumble && ' | Natural 1!'}
              </p>
            </div>
          )}
          
          {lastRoll.type === 'ability' && (
            <div>
              <h4 className="font-bold text-lg">
                {lastRoll.passed ? 'Success!' : 'Failed!'} — {lastRoll.combatant}
              </h4>
              <p className="text-sm mt-1">
                {lastRoll.abilityName} Check: {lastRoll.roll} + {lastRoll.modifier} = {lastRoll.total} vs {lastRoll.target}
              </p>
            </div>
          )}
          
          {lastRoll.type === 'concentration' && (
            <div>
              <h4 className="font-bold text-lg">
                {lastRoll.passed ? 'Concentration Maintained!' : 'Concentration Broken!'} — {lastRoll.combatant}
              </h4>
              <p className="text-sm mt-1">
                Roll: {lastRoll.roll} vs DC {lastRoll.dc} (damage: {lastRoll.damageTaken})
              </p>
            </div>
          )}
          
          {lastRoll.type === 'turnUndead' && (
            <div>
              <h4 className="font-bold text-lg">
                Turn Undead: {lastRoll.result} — {lastRoll.combatant}
              </h4>
              <p className="text-sm mt-1">
                Roll: {lastRoll.dice[0]} + {lastRoll.dice[1]} = {lastRoll.roll} (Cleric Level {lastRoll.clericLevel})
              </p>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => setLastRoll(null)} 
          className="text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  )
}