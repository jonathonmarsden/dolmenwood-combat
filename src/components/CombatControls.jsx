import useCombatStore from '../store/combatStore'
import { rollInitiative } from '../utils/diceRolls'
import { declaredActions } from '../data/declaredActions'

export function CombatControls() {
  const {
    round,
    combatants,
    activeIndex,
    combatPhase,
    surpriseRound,
    updateCombatant,
    nextTurn,
    previousTurn,
    rollInitiativeForAll,
    setCombatPhase
  } = useCombatStore()

  const activeCombatant = combatants[activeIndex]

  const handleRollInitiative = () => {
    rollInitiativeForAll()
    setCombatPhase('active')
  }

  const handleStartSurpriseRound = () => {
    setCombatPhase('active')
    useCombatStore.setState({ 
      surpriseRound: true,
      activeIndex: 0
    })
  }

  const getPhaseDescription = () => {
    if (combatPhase === 'setup') return 'Setup Phase - Add combatants'
    if (combatPhase === 'declaring') return 'Declaration Phase - Choose actions before rolling initiative'
    if (combatPhase === 'active' && surpriseRound) return 'Surprise Round!'
    if (combatPhase === 'active') return `Round ${round} - Active Combat`
    return ''
  }

  // Check if all combatants have declared actions
  const allDeclared = combatants.every(c => c.declaredAction && c.declaredAction !== '')

  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{getPhaseDescription()}</h2>
        {activeCombatant && combatPhase === 'active' && (
          <div className="text-lg">
            Current: <span className="font-bold">{activeCombatant.name}</span>
          </div>
        )}
      </div>

      {/* Phase Controls */}
      <div className="flex flex-wrap gap-2">
        {combatPhase === 'setup' && combatants.length > 0 && (
          <>
            <button
              onClick={() => setCombatPhase('declaring')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
            >
              Start Combat (Declare Actions)
            </button>
            <button
              onClick={handleStartSurpriseRound}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
            >
              Start Surprise Round
            </button>
          </>
        )}

        {combatPhase === 'declaring' && (
          <>
            <button
              onClick={handleRollInitiative}
              disabled={!allDeclared}
              className={`px-4 py-2 rounded text-white ${
                allDeclared 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Roll Initiative
            </button>
            {!allDeclared && (
              <span className="text-sm text-red-600 self-center">
                All combatants must declare actions first
              </span>
            )}
          </>
        )}

        {combatPhase === 'active' && (
          <>
            <button
              onClick={previousTurn}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              disabled={activeIndex === 0}
            >
              ← Previous
            </button>
            <button
              onClick={nextTurn}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Next →
            </button>
            {!surpriseRound && (
              <button
                onClick={() => setCombatPhase('declaring')}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded"
              >
                New Round (Declare)
              </button>
            )}
          </>
        )}

        <button
          onClick={() => {
            if (window.confirm('End combat and reset?')) {
              useCombatStore.setState({ 
                combatPhase: 'setup',
                round: 1,
                activeIndex: 0,
                surpriseRound: false
              })
            }
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
        >
          End Combat
        </button>
      </div>

      {/* Initiative Order (when in active combat) */}
      {combatPhase === 'active' && combatants.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Initiative Order:</h3>
          <div className="flex flex-wrap gap-2">
            {[...combatants]
              .sort((a, b) => (b.initiative || 0) - (a.initiative || 0))
              .map((c, i) => (
                <div
                  key={c.id}
                  className={`px-3 py-1 rounded text-sm ${
                    c.id === activeCombatant?.id
                      ? 'bg-blue-600 text-white'
                      : c.hp <= 0
                      ? 'bg-gray-300 text-gray-600'
                      : 'bg-gray-200'
                  }`}
                >
                  {c.name} ({c.initiative})
                  {c.declaredAction && c.declaredAction !== 'none' && (
                    <span className="ml-1">{declaredActions[c.declaredAction]?.icon}</span>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}