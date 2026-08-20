import { useEffect, useState, useCallback } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import { api } from './api'

import Login from './components/Login'
import UsernameSetup from './components/UsernameSetup'
import SpacePicker from './components/SpacePicker'
import SpaceSwitcher from './components/SpaceSwitcher'
import Feed from './components/Feed'
import Discover from './components/Discover'
import Compose from './components/Compose'

export default function App() {
  const [user, setUser] = useState(undefined) // undefined = loading, null = signed out
  const [profile, setProfile] = useState(null)
  const [needsUsername, setNeedsUsername] = useState(false)

  const [spaces, setSpaces] = useState([])
  const [activeSpace, setActiveSpace] = useState(null)
  const [view, setView] = useState('feed') // 'feed' | 'discover'
  const [composing, setComposing] = useState(false)

  const [posts, setPosts] = useState([])
  const [postsLoading, setPostsLoading] = useState(false)

  // --- Auth listener ---
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (!u) {
        setProfile(null)
        setSpaces([])
        setActiveSpace(null)
        return
      }
      try {
        const me = await api.syncUser()
        setProfile(me)
        setNeedsUsername(false)
      } catch {
        setNeedsUsername(true)
      }
    })
  }, [])

  // --- Load spaces once we have a profile ---
  const loadSpaces = useCallback(async () => {
    const list = await api.listSpaces()
    setSpaces(list)
    return list
  }, [])

  useEffect(() => {
    if (profile) loadSpaces()
  }, [profile, loadSpaces])

  // --- Load feed whenever the active space changes ---
  const loadFeed = useCallback(async (space) => {
    setPostsLoading(true)
    try {
      const feed = await api.getFeed(space.spaceId)
      setPosts(feed)
    } finally {
      setPostsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeSpace) {
      setView('feed')
      loadFeed(activeSpace)
    }
  }, [activeSpace, loadFeed])

  const handleUsernameSubmit = async (username) => {
    const me = await api.syncUser(username)
    setProfile(me)
    setNeedsUsername(false)
  }

  const handleCreateSpace = async (name, category) => {
    const space = await api.createSpace(name, category)
    const updated = await loadSpaces()
    const created = updated.find((s) => s.spaceId === space.spaceId) || space
    setActiveSpace(created)
  }

  const handleLike = (postId) => api.likePost(postId)

  const handlePosted = () => {
    setComposing(false)
    if (activeSpace) loadFeed(activeSpace)
  }

  // --- Render states ---
  if (user === undefined) return <CenteredNote text="Loading..." />
  if (!user) return <Login />
  if (needsUsername) return <UsernameSetup onSubmit={handleUsernameSubmit} />
  if (!profile) return <CenteredNote text="Loading your profile..." />

  if (!activeSpace) {
    return (
      <SpacePicker
        spaces={spaces}
        onEnter={setActiveSpace}
        onCreate={handleCreateSpace}
      />
    )
  }

  return (
    <div className="app-shell">
      <div className="top-bar">
        <div className="top-bar-brand">
          Sport<span>Snap</span>
        </div>
        <div className="top-bar-actions">
          <span className="eyebrow">@{profile.username}</span>
          <button className="icon-btn" onClick={() => setActiveSpace(null)} title="Switch spaces (picker)">
            ⌂
          </button>
          <button className="icon-btn" onClick={() => signOut(auth)} title="Log out">
            ⏻
          </button>
        </div>
      </div>

      <SpaceSwitcher
        spaces={spaces}
        activeSpaceId={activeSpace.spaceId}
        onSwitch={setActiveSpace}
        onAddNew={() => setActiveSpace(null)}
      />

      {view === 'feed' ? (
        <Feed space={activeSpace} posts={posts} loading={postsLoading} onLike={handleLike} />
      ) : (
        <Discover space={activeSpace} />
      )}

      <button className="fab" onClick={() => setComposing(true)} aria-label="New post">
        +
      </button>

      <div className="bottom-nav">
        <button className={view === 'feed' ? 'active' : ''} onClick={() => setView('feed')}>
          Feed
        </button>
        <button className={view === 'discover' ? 'active' : ''} onClick={() => setView('discover')}>
          Discover
        </button>
      </div>

      {composing && (
        <Compose space={activeSpace} onClose={() => setComposing(false)} onPosted={handlePosted} />
      )}
    </div>
  )
}

function CenteredNote({ text }) {
  return (
    <div className="auth-screen">
      <p style={{ color: 'var(--chalk-dim)' }}>{text}</p>
    </div>
  )
}
