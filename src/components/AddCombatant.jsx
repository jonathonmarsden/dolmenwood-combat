import { useState } from 'react'
import useCombatStore from '../store/combatStore'

export function AddCombatant() {
  const { addCombatant } = useCombatStore()
  
  const [formData, setFormData] = useState({
    name: '',
    hp: 10,
    maxHp: 10,
    ac: 10,
    attack: 0,
    damage: '1d6',
    morale: 8,
    isPlayer: false,
    isSpellcaster: false,
    isCleric: false,
    strMod: 0,
    dexMod: 0,
    saves: {
      doom: 14,
      ray: 14,
      hold: 14,
      blast: 14,
      spell: 14
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    addCombatant({
      ...formData,
      type: formData.isPlayer ? 'pc' : 'npc',
      statuses: [],
      initiative: 0,
      declaredAction: 'none'
    })

    // Reset form
    setFormData({
      ...formData,
      name: ''
    })
  }

  const updateSave = (saveType, value) => {
    setFormData({
      ...formData,
      saves: {
        ...formData.saves,
        [saveType]: parseInt(value) || 14
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold mb-3">Add Custom Combatant</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Basic Info */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border rounded px-2 py-1"
            placeholder="Combatant name..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">HP / Max HP</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.hp}
              onChange={(e) => setFormData({ 
                ...formData, 
                hp: parseInt(e.target.value) || 0 
              })}
              className="w-1/2 border rounded px-2 py-1"
              min="0"
            />
            <input
              type="number"
              value={formData.maxHp}
              onChange={(e) => setFormData({ 
                ...formData, 
                maxHp: parseInt(e.target.value) || 1,
                hp: Math.min(formData.hp, parseInt(e.target.value) || 1)
              })}
              className="w-1/2 border rounded px-2 py-1"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">AC</label>
          <input
            type="number"
            value={formData.ac}
            onChange={(e) => setFormData({ ...formData, ac: parseInt(e.target.value) || 10 })}
            className="w-full border rounded px-2 py-1"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Attack Bonus</label>
          <input
            type="number"
            value={formData.attack}
            onChange={(e) => setFormData({ ...formData, attack: parseInt(e.target.value) || 0 })}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Damage</label>
          <input
            type="text"
            value={formData.damage}
            onChange={(e) => setFormData({ ...formData, damage: e.target.value })}
            className="w-full border rounded px-2 py-1"
            placeholder="1d6+1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Morale</label>
          <input
            type="number"
            value={formData.morale}
            onChange={(e) => setFormData({ ...formData, morale: parseInt(e.target.value) || 8 })}
            className="w-full border rounded px-2 py-1"
            min="2"
            max="12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">STR Modifier</label>
          <input
            type="number"
            value={formData.strMod}
            onChange={(e) => setFormData({ ...formData, strMod: parseInt(e.target.value) || 0 })}
            className="w-full border rounded px-2 py-1"
            min="-3"
            max="3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">DEX Modifier</label>
          <input
            type="number"
            value={formData.dexMod}
            onChange={(e) => setFormData({ ...formData, dexMod: parseInt(e.target.value) || 0 })}
            className="w-full border rounded px-2 py-1"
            min="-3"
            max="3"
          />
        </div>
      </div>

      {/* Saving Throws */}
      <div className="mt-3">
        <label className="block text-sm font-medium mb-1">Saving Throws</label>
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(formData.saves).map(([save, value]) => (
            <div key={save}>
              <label className="text-xs capitalize">{save}</label>
              <input
                type="number"
                value={value}
                onChange={(e) => updateSave(save, e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
                min="2"
                max="20"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-4 mt-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isPlayer}
            onChange={(e) => setFormData({ ...formData, isPlayer: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Player Character</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isSpellcaster}
            onChange={(e) => setFormData({ ...formData, isSpellcaster: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Spellcaster</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isCleric}
            onChange={(e) => setFormData({ ...formData, isCleric: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm">Cleric (Turn Undead)</span>
        </label>
      </div>

      <button
        type="submit"
        className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        Add Combatant
      </button>
    </form>
  )
}