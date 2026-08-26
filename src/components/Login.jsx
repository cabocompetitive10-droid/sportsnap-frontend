import { useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '../firebase'

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
    } catch (err) {
      setError(friendlyError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="split-screen">
      <div className="split-side">
        <div className="split-side-mark">
          Sport<span>Snap</span>
        </div>
        <p className="split-side-line">
          One account.
          <br />
          A space for every sport you're into.
          <br />
          Nothing else in your feed.
        </p>
        <div className="split-side-tiles">
          <div className="split-tile">🏀</div>
          <div className="split-tile">⚽</div>
          <div className="split-tile">🏒</div>
          <div className="split-tile">🎮</div>
        </div>
      </div>

      <div className="split-form-side">
        <div className="split-form-card">
          <h1 className="auth-wordmark mobile-only">
            Sport<span>Snap</span>
          </h1>
          <h2 className="split-form-title">
            {mode === 'login' ? 'Log in' : 'Create your account'}
          </h2>

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

          <div className="split-divider">
            <span />
            <span>or</span>
            <span />
          </div>

          <button
            className="btn btn-ghost btn-block"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Create new account' : "I already have an account"}
          </button>
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
