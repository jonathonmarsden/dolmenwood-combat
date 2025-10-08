import { useState } from 'react'
import useCombatStore from './store/combatStore'
import { monsterTemplates } from './data/monsterTemplates'
import { CombatantCard } from './components/CombatantCard'
import { CombatControls } from './components/CombatControls'
import { AddCombatant } from './components/AddCombatant'
import { RollResults } from './components/RollResults'
import { CombatFlowGuide } from './components/CombatFlowGuide'

function App() {
  const { 
    combatants, 
    round,
    activeIndex,
    combatPhase,
    addCombatant, 
    clearAll 
  } = useCombatStore()
  
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showAddCustom, setShowAddCustom] = useState(false)
  const [showFlowGuide, setShowFlowGuide] = useState(true)

  const handleQuickAdd = (category, key) => {
    const monster = monsterTemplates[category][key]
    addCombatant({
      ...monster,
      type: 'npc',
      isPlayer: false,
      statuses: [],
      initiative: 0,
      declaredAction: 'none'
    })
  }

  // Sort combatants by initiative for display (only in active phase)
  const displayCombatants = combatPhase === 'active' 
    ? [...combatants].sort((a, b) => (b.initiative || 0) - (a.initiative || 0))
    : combatants

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-red-800">
              ⚔️ Dolmenwood Combat Calculator
            </h1>
            <div className="text-sm text-gray-600">
              <div>Phase: {combatPhase}</div>
              {combatPhase === 'active' && <div>Round: {round}</div>}
            </div>
          </div>

          {/* Combat Flow Guide */}
          <div className="mb-4">
            <button
              onClick={() => setShowFlowGuide(!showFlowGuide)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {showFlowGuide ? 'Hide' : 'Show'} Combat Flow Guide
            </button>
          </div>
          {showFlowGuide && <CombatFlowGuide />}

          {/* Roll Results */}
          <RollResults />

          {/* Combat Controls */}
          <CombatControls />

          {/* Add Combatants Section */}
          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowQuickAdd(!showQuickAdd)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
              >
                {showQuickAdd ? 'Hide' : 'Show'} Quick Add Monsters
              </button>
              <button
                onClick={() => setShowAddCustom(!showAddCustom)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
              >
                {showAddCustom ? 'Hide' : 'Show'} Add Custom
              </button>
            </div>

            {/* Quick Add Monsters */}
            {showQuickAdd && (
              <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                <h3 className="text-lg font-semibold mb-3">Quick Add Monsters</h3>
                {Object.entries(monsterTemplates).map(([category, monsters]) => (
                  <div key={category} className="mb-3">
                    <h4 className="text-sm font-semibold mb-2 capitalize text-gray-700">
                      {category.toUpperCase()}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(monsters).map(([key, monster]) => (
                        <button
                          key={key}
                          onClick={() => handleQuickAdd(category, key)}
                          className={`px-3 py-2 rounded text-white text-sm hover:opacity-80
                            ${category === 'weak' ? 'bg-green-600' : 
                              category === 'medium' ? 'bg-yellow-600' : 
                              category === 'strong' ? 'bg-red-600' : 'bg-purple-600'}`}
                          title={`HP: ${monster.hp}, AC: ${monster.ac}, Attack: +${monster.attack}`}
                        >
                          {monster.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add Custom Combatant */}
            {showAddCustom && <AddCombatant />}
          </div>

          {/* Combatants List */}
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Combatants ({combatants.length})
              </h2>
              {combatants.length > 0 && (
                <button
                  onClick={() => {
                    if (window.confirm('Clear all combatants?')) {
                      clearAll()
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
                >
                  Clear All
                </button>
              )}
            </div>

            {combatants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No combatants added yet.</p>
                <p className="text-sm mt-2">Use Quick Add or Add Custom above to get started!</p>
              </div>
            ) : (
              displayCombatants.map((combatant, index) => (
                <CombatantCard
                  key={combatant.id}
                  combatant={combatant}
                  index={index}
                  isActive={combatPhase === 'active' && index === activeIndex}
                />
              ))
            )}
          </div>

          {/* Quick Reference */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Quick Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold">Saving Throws (d20 ≥ target)</h4>
                <ul className="text-gray-600">
                  <li>• Doom: Death, poison, disease</li>
                  <li>• Ray: Rays, wands</li>
                  <li>• Hold: Paralysis, petrification</li>
                  <li>• Blast: Breath weapons</li>
                  <li>• Spell: Other spells</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Combat Sequence</h4>
                <ul className="text-gray-600">
                  <li>1. Declare: Spells & fleeing only</li>
                  <li>2. Initiative: 1d6 per side</li>
                  <li>3. Movement (no move if casting)</li>
                  <li>4. Missile attacks</li>
                  <li>5. Magic (spells, items, etc.)</li>
                  <li>6. Melee attacks</li>
                  <li>7. Morale checks</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold">Checks</h4>
                <ul className="text-gray-600">
                  <li>• Skill: d6 ≥ target (usually 6)</li>
                  <li>• Ability: d6 + mod ≥ 4</li>
                  <li>• Morale: 2d6 ≤ morale score</li>
                  <li>• Concentration: d20 ≥ DC</li>
                  <li>• Initiative: 1d6 + DEX</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App