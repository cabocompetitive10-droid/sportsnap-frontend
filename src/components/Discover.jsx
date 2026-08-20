import { useEffect, useState } from 'react'
import { api } from '../api'

export default function Discover({ space }) {
  const [results, setResults] = useState([])
  const [following, setFollowing] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([api.discoverSpaces(space.category), api.listFollowing(space.spaceId)])
      .then(([discovered, followingList]) => {
        if (cancelled) return
        setResults(discovered)
        setFollowing(new Set(followingList.map((f) => f.spaceId)))
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [space.spaceId, space.category])

  const toggleFollow = async (targetId) => {
    const isFollowing = following.has(targetId)
    setFollowing((prev) => {
      const next = new Set(prev)
      isFollowing ? next.delete(targetId) : next.add(targetId)
      return next
    })
    try {
      if (isFollowing) {
        await api.unfollowSpace(space.spaceId, targetId)
      } else {
        await api.followSpace(space.spaceId, targetId)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="feed">
      <div className="feed-header">
        <h2>Discover · {space.category}</h2>
      </div>

      {error && <div className="auth-error" style={{ marginBottom: 14 }}>{error}</div>}
      {loading && <p style={{ color: 'var(--chalk-dim)' }}>Loading...</p>}

      {!loading && results.length === 0 && (
        <div className="feed-empty">
          <h3>Nobody here yet</h3>
          <p>No other spaces in "{space.category}" so far. Be the first to post.</p>
        </div>
      )}

      <div className="discover-list">
        {results.map((r) => (
          <div key={r.spaceId} className="discover-row">
            <div>
              <div className="discover-row-name">{r.name}</div>
              <div className="discover-row-category">{r.category}</div>
            </div>
            <button
              className={following.has(r.spaceId) ? 'btn btn-ghost' : 'btn btn-primary'}
              onClick={() => toggleFollow(r.spaceId)}
            >
              {following.has(r.spaceId) ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
