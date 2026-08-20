import { useState, useMemo } from 'react'

const PRESET_CATEGORIES = [
  { name: 'Hockey', emoji: '🏒' },
  { name: 'Basketball', emoji: '🏀' },
  { name: 'Soccer', emoji: '⚽' },
  { name: 'Football', emoji: '🏈' },
  { name: 'Baseball', emoji: '⚾' },
  { name: 'Tennis', emoji: '🎾' },
  { name: 'MMA', emoji: '🥊' },
  { name: 'Gaming', emoji: '🎮' },
]

export default function SpacePicker({ spaces, onEnter, onCreate }) {
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [busy, setBusy] = useState(false)
  const [query, setQuery] = useState('')
  const [creatingChip, setCreatingChip] = useState(null)

  const filteredSpaces = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return spaces
    return spaces.filter(
      (s) => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    )
  }, [spaces, query])

  const ownedNames = useMemo(
    () => new Set(spaces.map((s) => s.name.toLowerCase())),
    [spaces]
  )

  const submitCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setBusy(true)
    try {
      await onCreate(name.trim(), (category || name).trim())
      setName('')
      setCategory('')
      setCreating(false)
    } finally {
      setBusy(false)
    }
  }

  const quickCreate = async (chip) => {
    setCreatingChip(chip.name)
    try {
      await onCreate(chip.name, chip.name.toLowerCase())
    } finally {
      setCreatingChip(null)
    }
  }

  return (
    <div className="picker-screen">
      <h1 className="picker-title">Who's watching?</h1>
      <p className="picker-sub">
        Jump into a space, or start a new one for something you're into.
      </p>

      <div className="picker-search">
        <svg className="picker-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your spaces..."
        />
      </div>

      {spaces.length > 0 && (
        <div className="picker-suggest-row">
          {PRESET_CATEGORIES.filter((c) => !ownedNames.has(c.name.toLowerCase())).map((chip) => (
            <button
              key={chip.name}
              className="picker-suggest-chip"
              onClick={() => quickCreate(chip)}
              disabled={creatingChip === chip.name}
            >
              <span>{chip.emoji}</span>
              <span>{creatingChip === chip.name ? 'Joining...' : chip.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="picker-grid">
        {filteredSpaces.map((space) => (
          <button key={space.spaceId} className="picker-tile" onClick={() => onEnter(space)}>
            <div className="picker-tile-number">{space.name.charAt(0).toUpperCase()}</div>
            <div className="picker-tile-name">{space.name}</div>
            <div className="picker-tile-category">{space.category}</div>
          </button>
        ))}

        {!creating && !query && (
          <button className="picker-tile new" onClick={() => setCreating(true)}>
            <div className="picker-tile-number">+</div>
            <div className="picker-tile-name">New space</div>
          </button>
        )}
      </div>

      {filteredSpaces.length === 0 && spaces.length > 0 && (
        <p className="picker-sub" style={{ marginTop: 20 }}>
          No spaces match "{query}". Try the create button below.
        </p>
      )}

      {creating && (
        <form className="auth-form" style={{ marginTop: 28, maxWidth: 320 }} onSubmit={submitCreate}>
          <div className="compose-field">
            <label htmlFor="space-name">Space name</label>
            <input
              id="space-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Basketball, Chess, Trail Running"
            />
          </div>
          <div className="compose-field">
            <label htmlFor="space-category">Category (optional, defaults to name)</label>
            <input
              id="space-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. basketball"
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? 'Creating...' : 'Create space'}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setCreating(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
