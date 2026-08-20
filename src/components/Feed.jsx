import PostCard from './PostCard'

export default function Feed({ space, posts, loading, onLike }) {
  return (
    <div className="feed">
      <div className="feed-header">
        <h2>{space.name} feed</h2>
        <span className="eyebrow">{posts.length} post{posts.length === 1 ? '' : 's'}</span>
      </div>

      {loading && <p style={{ color: 'var(--chalk-dim)' }}>Loading...</p>}

      {!loading && posts.length === 0 && (
        <div className="feed-empty">
          <h3>Nothing here yet</h3>
          <p>
            Follow a few people in Discover, or post something to get this space moving.
          </p>
        </div>
      )}

      {posts.map((post) => (
        <PostCard key={post.postId} post={post} onLike={onLike} />
      ))}
    </div>
  )
}
