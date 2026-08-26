import { useMemo, useState } from 'react'

const PRESET_CATEGORIES = [
  { name: 'Basketball', emoji: '🏀' },
  { name: 'Soccer', emoji: '⚽' },
  { name: 'Football', emoji: '🏈' },
  { name: 'Hockey', emoji: '🏒' },
  { name: 'Baseball', emoji: '⚾' },
  { name: 'Tennis', emoji: '🎾' },
  { name: 'Running', emoji: '🏃' },
  { name: 'Gym', emoji: '🏋️' },
  { name: 'Golf', emoji: '⛳' },
  { name: 'Boxing', emoji: '🥊' },
  { name: 'Gaming', emoji: '🎮' },
  { name: 'Chess', emoji: '♟️' },
]

export default function CategoryPicker({ spaces, onEnter, onCreate }) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null) // { name, isExisting, space? }
  const [busy, setBusy] = useState(false)

  const mySpaceNames = useMemo(
    () => new Set(spaces.map((s) => s.name.toLowerCase())),
    [spaces]
  )

  const filteredPresets = PRESET_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  const showCustomOption =
    query.trim().length > 0 &&
    !filteredPresets.some((c) => c.name.toLowerCase() === query.trim().toLowerCase())

  const pickPreset = (name) => {
    const existing = spaces.find((s) => s.name.toLowerCase() === name.toLowerCase())
    setSelected({ name, isExisting: !!existing, space: existing })
  }

  const pickExistingSpace = (space) => {
    setSelected({ name: space.name, isExisting: true, space })
  }

  const handleContinue = async () => {
    if (!selected) return
    setBusy(true)
    try {
      if (selected.isExisting && selected.space) {
        onEnter(selected.space)
      } else {
        await onCreate(selected.name, selected.name)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="picker-screen">
      <h1 className="picker-title">Who's watching?</h1>
      <p className="picker-sub">Search a sport, tap it to join or create it.</p>

      <div className="search-bar">
        <span className="search-icon">⌕</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search sports, games, activities..."
          autoFocus
        />
      </div>

      {spaces.length > 0 && (
        <>
          <div className="picker-section-label">Your spaces</div>
          <div className="chip-row">
            {spaces.map((space) => (
              <button
                key={space.spaceId}
                className={`chip ${selected?.space?.spaceId === space.spaceId ? 'chip-selected' : ''}`}
                onClick={() => pickExistingSpace(space)}
              >
                {space.name}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="picker-section-label">Browse categories</div>
      <div className="category-grid">
        {filteredPresets.map((c) => {
          const already = mySpaceNames.has(c.name.toLowerCase())
          const isSelected = selected?.name === c.name && !selected.isExisting
          return (
            <button
              key={c.name}
              className={`category-tile ${isSelected ? 'category-tile-selected' : ''}`}
              onClick={() => pickPreset(c.name)}
            >
              <span className="category-tile-emoji">{c.emoji}</span>
              <span className="category-tile-name">{c.name}</span>
              {already && <span className="category-tile-badge">Joined</span>}
            </button>
          )
        })}

        {showCustomOption && (
          <button
            className={`category-tile category-tile-custom ${
              selected?.name === query.trim() ? 'category-tile-selected' : ''
            }`}
            onClick={() => pickPreset(query.trim())}
          >
            <span className="category-tile-emoji">+</span>
            <span className="category-tile-name">Create "{query.trim()}"</span>
          </button>
        )}
      </div>

      <div className="picker-continue-bar">
        <button
          className="btn btn-primary btn-block"
          disabled={!selected || busy}
          onClick={handleContinue}
        >
          {busy ? 'Loading...' : selected ? `Continue to ${selected.name}` : 'Pick a category'}
        </button>
      </div>
    </div>
  )
}
