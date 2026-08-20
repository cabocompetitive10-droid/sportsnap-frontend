import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../firebase'

const TICKER_ITEMS = [
  'HOCKEY', 'BASKETBALL', 'SOCCER', 'FOOTBALL', 'BASEBALL', 'TENNIS', 'MMA', 'GAMING',
]

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
      }
      // onAuthStateChanged in App.jsx picks up the new session from here.
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-panel-brand">
        <div className="auth-eyebrow">SPORTSNAP</div>
        <h1 className="auth-hero-heading">
          Every game.
          <br />
          Every fan.
          <br />
          <span>One feed.</span>
        </h1>
        <p className="auth-hero-sub">
          Join spaces for the teams and sports you actually care about.
        </p>
        <div className="auth-ticker-wrap">
          <div className="auth-ticker">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-panel-form">
        <div className="auth-card">
          <h1 className="auth-wordmark auth-wordmark-mobile">
            Sport<span>Snap</span>
          </h1>

          <div className="auth-mode-tabs">
            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => setMode('login')}
            >
              Log in
            </button>
            <button
              type="button"
              className={mode === 'signup' ? 'active' : ''}
              onClick={() => setMode('signup')}
            >
              Sign up
            </button>
          </div>

          <p className="auth-tagline">
            {mode === 'login' ? 'Welcome back to the locker room.' : 'Pick a username later, get in first.'}
          </p>

          <form className="auth-form" onSubmit={submit}>
            {error && <div className="auth-error">{error}</div>}

            <div className="compose-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="compose-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? 'Working...' : mode === 'login' ? 'Log in' : 'Sign up'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>
                New here?{' '}
                <button onClick={() => setMode('signup')}>Create an account</button>
              </>
            ) : (
              <>
                Already have one?{' '}
                <button onClick={() => setMode('login')}>Log in</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function friendlyError(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks off.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.'
    case 'auth/email-already-in-use':
      return 'An account already exists with that email.'
    case 'auth/weak-password':
      return 'Password needs to be at least 6 characters.'
    default:
      return 'Something went wrong. Try again.'
  }
}
