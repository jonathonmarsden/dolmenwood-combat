import { useState } from 'react'
import useCombatStore from '../store/combatStore'

export function CombatFlowGuide() {
  const {
    combatPhase,
    setCombatPhase,
    round,
    combatants,
    rollInitiativeForAll,
    nextTurn,
    activeIndex
  } = useCombatStore()

  const [currentStep, setCurrentStep] = useState('start')
  const [sideInitiative, setSideInitiative] = useState({})
  const [useSideInitiative, setUseSideInitiative] = useState(true)

  const getStepDescription = () => {
    switch (currentStep) {
      case 'start':
        return {
          title: '⚔️ Start Combat',
          description: 'A combat encounter is beginning. Determine if any combatants are surprised.',
          actions: [
            { label: 'Normal Combat', action: () => setCurrentStep('declarations') },
            { label: 'Surprise Round', action: () => { setCombatPhase('active'); useCombatStore.setState({ surpriseRound: true }); setCurrentStep('surprise'); } }
          ]
        }
      
      case 'surprise':
        return {
          title: '😱 Surprise Round',
          description: 'Only non-surprised combatants may act. No declarations needed.',
          actions: [
            { label: 'Resolve Surprise Actions', action: () => { useCombatStore.setState({ surpriseRound: false }); setCurrentStep('declarations'); } }
          ]
        }
      
      case 'declarations':
        return {
          title: '📢 Declaration Phase',
          description: 'Combatants must declare if they will: Cast a spell/use a rune OR Flee from melee. All other actions need not be declared.',
          checklist: [
            'Ask spellcasters if they will cast',
            'Ask combatants in melee if they will flee',
            'Mark these declarations'
          ],
          actions: [
            { label: 'Declarations Complete', action: () => setCurrentStep('initiative') }
          ]
        }
      
      case 'initiative':
        return {
          title: '🎲 Roll Initiative',
          description: useSideInitiative ? 
            'Each SIDE rolls 1d6. Highest goes first.' : 
            'Each combatant rolls 1d6 + DEX modifier.',
          actions: [
            { 
              label: useSideInitiative ? 'Roll Side Initiative' : 'Roll Individual Initiative', 
              action: () => {
                if (useSideInitiative) {
                  // Simple prompt for side initiative
                  const pcRoll = parseInt(prompt('PC side initiative (1d6):') || '0')
                  const npcRoll = parseInt(prompt('NPC side initiative (1d6):') || '0')
                  setSideInitiative({ pc: pcRoll, npc: npcRoll })
                } else {
                  rollInitiativeForAll()
                }
                setCombatPhase('active')
                setCurrentStep('actions')
              }
            },
            {
              label: `Switch to ${useSideInitiative ? 'Individual' : 'Side'} Initiative`,
              action: () => setUseSideInitiative(!useSideInitiative)
            }
          ]
        }
      
      case 'actions':
        return {
          title: '⚡ Resolve Actions',
          description: 'Process actions in order: 1) Movement, 2) Missile attacks, 3) Magic, 4) Melee attacks',
          sequence: [
            '🏃 Movement (spellcasters cannot move)',
            '🏹 Missile/Ranged attacks',
            '✨ Magic (spells, runes, items, turn undead)',
            '⚔️ Melee attacks & other actions'
          ],
          notes: [
            'Declared spells are disrupted if caster was damaged before their turn',
            'Fleeing combatants take +2 to be hit, no shield bonus'
          ],
          actions: [
            { label: 'Next Combatant', action: () => nextTurn() },
            { label: 'End Round → Morale', action: () => setCurrentStep('morale') }
          ]
        }
      
      case 'morale':
        return {
          title: '😰 Morale Checks',
          description: 'Check morale for NPCs/monsters if applicable.',
          triggers: [
            'First death on their side',
            '50% casualties on their side',
            'Single creature: when first damaged',
            'Single creature: when reduced to 25% HP'
          ],
          actions: [
            { label: 'Morale Complete → New Round', action: () => { setCombatPhase('declaring'); setCurrentStep('declarations'); } },
            { label: 'Combat Ends', action: () => setCurrentStep('end') }
          ]
        }
      
      case 'end':
        return {
          title: '🏁 Combat Ended',
          description: 'The combat encounter has concluded.',
          actions: [
            { label: 'Reset Combat Tracker', action: () => { useCombatStore.getState().clearAll(); setCurrentStep('start'); } }
          ]
        }
      
      default:
        return { title: 'Unknown', description: '', actions: [] }
    }
  }

  const step = getStepDescription()

  return (
    <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-blue-900">{step.title}</h2>
        <span className="text-sm text-blue-700">Round {round}</span>
      </div>
      
      <p className="text-blue-800 mb-3">{step.description}</p>
      
      {step.checklist && (
        <div className="mb-3 bg-white rounded p-3">
          <h3 className="font-semibold text-sm mb-2">Checklist:</h3>
          <ul className="text-sm space-y-1">
            {step.checklist.map((item, i) => (
              <li key={i} className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {step.sequence && (
        <div className="mb-3 bg-white rounded p-3">
          <h3 className="font-semibold text-sm mb-2">Action Sequence:</h3>
          <ol className="text-sm space-y-1">
            {step.sequence.map((item, i) => (
              <li key={i}>{i + 1}. {item}</li>
            ))}
          </ol>
        </div>
      )}
      
      {step.triggers && (
        <div className="mb-3 bg-white rounded p-3">
          <h3 className="font-semibold text-sm mb-2">Check morale when:</h3>
          <ul className="text-sm space-y-1">
            {step.triggers.map((item, i) => (
              <li key={i}>• {item}</li>
            ))}
          </ul>
        </div>
      )}
      
      {step.notes && (
        <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded p-3">
          <h3 className="font-semibold text-sm mb-1 text-yellow-900">Important:</h3>
          <ul className="text-sm space-y-1 text-yellow-800">
            {step.notes.map((note, i) => (
              <li key={i}>⚠️ {note}</li>
            ))}
          </ul>
        </div>
      )}
      
      {step.actions && (
        <div className="flex flex-wrap gap-2">
          {step.actions.map((action, i) => (
            <button
              key={i}
              onClick={action.action}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
      
      {currentStep === 'initiative' && sideInitiative.pc && useSideInitiative && (
        <div className="mt-3 p-3 bg-white rounded">
          <p className="text-sm">
            <strong>Initiative Results:</strong> PCs: {sideInitiative.pc}, NPCs: {sideInitiative.npc}
            {sideInitiative.pc > sideInitiative.npc ? ' → PCs act first!' : ' → NPCs act first!'}
          </p>
        </div>
      )}
    </div>
  )
}