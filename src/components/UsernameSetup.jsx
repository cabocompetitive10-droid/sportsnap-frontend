import { useState } from 'react'

export default function UsernameSetup({ onSubmit }) {
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (username.trim().length < 3) {
      setError('Username needs to be at least 3 characters.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await onSubmit(username.trim())
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="auth-wordmark">
          One <span>thing</span>
        </h1>
        <p className="auth-tagline">
          Pick a username. It stays the same across every space you create.
        </p>
        <form className="auth-form" onSubmit={submit}>
          {error && <div className="auth-error">{error}</div>}
          <div className="compose-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. courtside_will"
              autoFocus
            />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? 'Setting up...' : "Let's go"}
          </button>
        </form>
      </div>
    </div>
  )
}
