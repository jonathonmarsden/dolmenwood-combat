import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCombatStore = create(
  persist(
    (set, get) => ({
      // State
      combatants: [],
      round: 1,
      activeIndex: 0,
      actionHistory: [],
      lastRoll: null,
      targetingMode: null,
      combatPhase: 'setup', // setup, declaring, initiative, combat
      surpriseRound: false,
      
      // Actions
      addCombatant: (combatant) => set((state) => ({
        combatants: [...state.combatants, { 
          ...combatant, 
          id: crypto.randomUUID(),
          statuses: [],
          notes: '',
          declaredAction: 'none',
          concentratingOn: '',
          isSurprised: false,
          attackType: 'melee'
        }]
      })),
      
      removeCombatant: (id) => set((state) => ({
        combatants: state.combatants.filter(c => c.id !== id)
      })),
      
      updateCombatant: (id, updates) => set((state) => ({
        combatants: state.combatants.map(c => {
          if (c.id !== id) return c
          return { ...c, ...updates }
        })
      })),
      
      applyDamage: (id, damage) => {
        const combatant = get().combatants.find(c => c.id === id)
        if (!combatant) return
        
        const actualDamage = Math.min(damage, combatant.hp)
        
        // Check if this disrupts a spell
        const wasConcentrating = combatant.declaredAction === 'spell' || combatant.concentratingOn
        
        set((state) => ({
          combatants: state.combatants.map(c => {
            if (c.id === id) {
              const newCombatant = { ...c, hp: Math.max(0, c.hp - actualDamage) }
              // Disrupt spell if damaged
              if (wasConcentrating && actualDamage > 0) {
                newCombatant.declaredAction = 'none'
                newCombatant.concentratingOn = ''
                newCombatant.statuses = c.statuses.filter(s => s.id !== 'concentrating')
              }
              return newCombatant
            }
            return c
          }),
          actionHistory: [...state.actionHistory.slice(-19), {
            type: 'damage',
            targetId: id,
            targetName: combatant.name,
            amount: actualDamage,
            spellDisrupted: wasConcentrating && actualDamage > 0,
            timestamp: Date.now()
          }]
        }))
        
        if (wasConcentrating && actualDamage > 0) {
          set((state) => ({
            lastRoll: {
              type: 'spell_disrupted',
              combatant: combatant.name,
              spell: combatant.concentratingOn || 'Spell'
            }
          }))
        }
      },
      
      applyHealing: (id, healing) => {
        const combatant = get().combatants.find(c => c.id === id)
        if (!combatant) return
        
        const actualHealing = Math.min(healing, combatant.maxHp - combatant.hp)
        
        set((state) => ({
          combatants: state.combatants.map(c =>
            c.id === id ? { ...c, hp: Math.min(c.maxHp, c.hp + actualHealing) } : c
          ),
          actionHistory: [...state.actionHistory.slice(-19), {
            type: 'heal',
            targetId: id,
            targetName: combatant.name,
            amount: actualHealing,
            timestamp: Date.now()
          }]
        }))
      },
      
      addStatus: (combatantId, status) => set((state) => ({
        combatants: state.combatants.map(c => 
          c.id === combatantId ? {
            ...c,
            statuses: [...c.statuses.filter(s => s.id !== status.id), {
              ...status,
              rounds: status.duration
            }]
          } : c
        )
      })),
      
      removeStatus: (combatantId, statusId) => set((state) => ({
        combatants: state.combatants.map(c =>
          c.id === combatantId ? {
            ...c,
            statuses: c.statuses.filter(s => s.id !== statusId)
          } : c
        )
      })),
      
      setCombatPhase: (phase) => set({ combatPhase: phase }),
      
      setSurpriseRound: (surprised) => set({ surpriseRound: surprised }),
      
      toggleSurprise: (id) => set((state) => ({
        combatants: state.combatants.map(c =>
          c.id === id ? { ...c, isSurprised: !c.isSurprised } : c
        )
      })),
      
      startActionDeclaration: () => {
        set({ combatPhase: 'declaring' })
      },
      
      rollInitiative: () => {
        const state = get()
        if (state.combatPhase === 'declaring' || state.combatPhase === 'initiative') {
          set((state) => ({
            combatants: state.combatants.map(c => ({
              ...c,
              initiative: Math.floor(Math.random() * 6) + 1 + (c.dexMod || 0)
            })),
            combatPhase: 'combat'
          }))
        }
      },
      
      nextTurn: () => {
        const state = get()
        const sortedCombatants = [...state.combatants].sort((a, b) => (b.initiative || 0) - (a.initiative || 0))
        const alive = sortedCombatants.filter(c => c.hp > 0 && (!c.isSurprised || !state.surpriseRound))
        
        if (alive.length === 0) {
          set({ activeIndex: 0 })
          return
        }
        
        const currentActiveIndex = Math.max(0, Math.min(state.activeIndex, alive.length - 1))
        
        if (currentActiveIndex >= alive.length - 1) {
          // End of round
          if (state.surpriseRound) {
            // End surprise round, start normal combat
            set((state) => ({
              activeIndex: 0,
              surpriseRound: false,
              combatants: state.combatants.map(c => ({ ...c, isSurprised: false }))
            }))
          } else {
            // Normal round end
            set((state) => ({
              activeIndex: 0,
              round: Math.min(state.round + 1, 999),
              combatPhase: 'declaring',
              combatants: state.combatants.map(c => ({
                ...c,
                statuses: c.statuses
                  .map(s => ({ ...s, rounds: Math.max(0, (s.rounds || 0) - 1) }))
                  .filter(s => s.rounds > 0 || s.duration === 0),
                declaredAction: 'none',
                initiative: 0
              }))
            }))
          }
        } else {
          set({ activeIndex: currentActiveIndex + 1 })
        }
      },
      
      setTargetingMode: (mode) => set({ targetingMode: mode }),
      
      setLastRoll: (roll) => set({ lastRoll: roll }),
      
      clearAll: () => set({
        combatants: [],
        round: 1,
        activeIndex: 0,
        actionHistory: [],
        lastRoll: null,
        targetingMode: null,
        combatPhase: 'setup',
        surpriseRound: false
      })
    }),
    {
      name: 'dolmenwood-combat-storage',
      version: 2,
    }
  )
)

export default useCombatStore
