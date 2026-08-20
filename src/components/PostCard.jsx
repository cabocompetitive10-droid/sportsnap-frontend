import { useState } from 'react'

export default function PostCard({ post, onLike }) {
  const [likes, setLikes] = useState(post.likeCount || 0)
  const [liked, setLiked] = useState(false)

  const handleLike = async () => {
    if (liked) return
    setLiked(true)
    setLikes((n) => n + 1)
    try {
      await onLike(post.postId)
    } catch {
      setLiked(false)
      setLikes((n) => n - 1)
    }
  }

  return (
    <article className="post-card">
      {post.mediaUrl && <img className="post-media" src={post.mediaUrl} alt="" />}
      {post.caption && <p className="post-caption">{post.caption}</p>}
      <div className="post-meta">
        <button className="like-btn" onClick={handleLike}>
          {liked ? '♥' : '♡'} {likes}
        </button>
        <span>{post.category}</span>
      </div>
    </article>
  )
}
