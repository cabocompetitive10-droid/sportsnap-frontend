import { useState } from 'react'
import { api } from '../api'

export default function Compose({ space, onClose, onPosted }) {
  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState([])
  const [aiNote, setAiNote] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState('')

  const pickFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  const runAiAssist = async () => {
    if (!aiNote.trim()) return
    setAiLoading(true)
    setError('')
    try {
      const result = await api.aiCaption(aiNote.trim(), space.category)
      setCaption(result.caption || '')
      setHashtags(result.hashtags || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setAiLoading(false)
    }
  }

  const submit = async () => {
    if (!caption.trim() && !file) {
      setError('Add a caption or a photo first.')
      return
    }
    setPosting(true)
    setError('')
    try {
      let mediaUrl = ''
      if (file) {
        const uploaded = await api.uploadFile(file)
        mediaUrl = uploaded.mediaUrl
      }
      const fullCaption = hashtags.length
        ? `${caption} ${hashtags.join(' ')}`.trim()
        : caption.trim()
      await api.createPost(space.spaceId, fullCaption, mediaUrl)
      onPosted()
    } catch (err) {
      setError(err.message)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="compose-overlay" onClick={onClose}>
      <div className="compose-panel" onClick={(e) => e.stopPropagation()}>
        <div className="compose-header">
          <h3>New post in {space.name}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {error && <div className="auth-error" style={{ marginBottom: 14 }}>{error}</div>}

        <div className="compose-field">
          <label htmlFor="photo">Photo (optional)</label>
          <input id="photo" type="file" accept="image/*,video/*" onChange={pickFile} />
        </div>

        {previewUrl && <img className="preview-thumb" src={previewUrl} alt="Preview" />}

        <div className="compose-field">
          <label htmlFor="ai-note">AI caption assist</label>
          <div className="ai-assist-row">
            <input
              id="ai-note"
              value={aiNote}
              onChange={(e) => setAiNote(e.target.value)}
              placeholder="Rough note, e.g. 'hit a buzzer beater at the park'"
            />
            <button className="btn btn-ghost" onClick={runAiAssist} disabled={aiLoading} type="button">
              {aiLoading ? '...' : 'Generate'}
            </button>
          </div>
        </div>

        {hashtags.length > 0 && (
          <div className="hashtag-pills">
            {hashtags.map((tag) => (
              <span key={tag} className="hashtag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="compose-field">
          <label htmlFor="caption">Caption</label>
          <textarea
            id="caption"
            rows={4}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write your own, or generate one above"
          />
        </div>

        <div className="compose-actions">
          <button className="btn btn-primary" onClick={submit} disabled={posting}>
            {posting ? 'Posting...' : 'Post'}
          </button>
          <button className="btn btn-ghost" onClick={onClose} type="button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
