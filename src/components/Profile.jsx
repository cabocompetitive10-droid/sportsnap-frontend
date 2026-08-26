export default function Profile({ profile, space }) {
  return (
    <div className="placeholder-screen">
      <div className="profile-avatar">{profile.username?.charAt(0).toUpperCase()}</div>
      <h2>@{profile.username}</h2>
      <p>{space.name} profile · posts, bio, and stats will live here.</p>
    </div>
  )
}
