export default function SpaceSwitcher({ spaces, activeSpaceId, onSwitch, onAddNew }) {
  return (
    <div className="jersey-rail">
      {spaces.map((space) => (
        <button
          key={space.spaceId}
          className={`jersey-tab ${space.spaceId === activeSpaceId ? 'active' : ''}`}
          onClick={() => onSwitch(space)}
          title={space.name}
        >
          <div className="jersey-number">{space.name.charAt(0).toUpperCase()}</div>
          <div className="jersey-label">{space.name}</div>
        </button>
      ))}
      <button className="jersey-tab add" onClick={onAddNew} title="New space">
        <div className="jersey-number">+</div>
        <div className="jersey-label">New</div>
      </button>
    </div>
  )
}
