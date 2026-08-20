import { auth } from './firebase'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

async function authHeader() {
  const user = auth.currentUser
  if (!user) throw new Error('Not signed in')
  const token = await user.getIdToken()
  return { Authorization: `Bearer ${token}` }
}

async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = await authHeader()
  if (!isForm) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export const api = {
  syncUser: (username) => request('/api/users/sync', { method: 'POST', body: { username } }),
  getMe: () => request('/api/users/me'),

  listSpaces: () => request('/api/spaces'),
  createSpace: (name, category) =>
    request('/api/spaces', { method: 'POST', body: { name, category } }),
  discoverSpaces: (category) =>
    request(`/api/spaces/discover?category=${encodeURIComponent(category)}`),
  followSpace: (spaceId, targetSpaceId) =>
    request(`/api/spaces/${spaceId}/follow/${targetSpaceId}`, { method: 'POST' }),
  unfollowSpace: (spaceId, targetSpaceId) =>
    request(`/api/spaces/${spaceId}/follow/${targetSpaceId}`, { method: 'DELETE' }),
  listFollowing: (spaceId) => request(`/api/spaces/${spaceId}/following`),

  createPost: (spaceId, caption, mediaUrl) =>
    request(`/api/spaces/${spaceId}/posts`, { method: 'POST', body: { caption, mediaUrl } }),
  listSpacePosts: (spaceId) => request(`/api/spaces/${spaceId}/posts`),
  getFeed: (spaceId) => request(`/api/spaces/${spaceId}/feed`),
  likePost: (postId) => request(`/api/posts/${postId}/like`, { method: 'POST' }),

  aiCaption: (description, category) =>
    request('/api/ai/caption', { method: 'POST', body: { description, category } }),

  uploadFile: (file) => {
    const form = new FormData()
    form.append('file', file)
    return request('/api/uploads', { method: 'POST', body: form, isForm: true })
  },
}
