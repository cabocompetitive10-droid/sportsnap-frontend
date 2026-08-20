# SportSnap frontend

React + Vite frontend for SportSnap. Talks to the Flask backend for spaces,
posts, feeds, and AI captions, and talks to Firebase Auth directly for
login/signup.

## Design

Locker-room scoreboard aesthetic: near-black slate background, chalk-white
text, traffic-cone orange as the primary accent, turf green for
follow/hashtag states. Display type is Oswald (condensed, athletic);
body is Inter; timestamps/stats/labels use IBM Plex Mono, like a
scoreboard readout. The signature element is the **jersey-tag space
switcher** — each of your spaces renders as a numbered jersey tile you
tap to switch between, echoing how a locker room is organized by number.

## Setup

1. **Register a web app in Firebase** (if you haven't already):
   Firebase Console → Project Settings → General → scroll to "Your apps" →
   click the `</>` (web) icon → register an app (no hosting needed).
   Copy the config values it gives you.

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # then paste in your Firebase web config + backend URL
   ```

4. **Make sure the Flask backend is running** at the URL in
   `VITE_API_BASE_URL` (defaults to `http://localhost:5000`).

5. **Run it**
   ```bash
   npm run dev
   ```
   Opens on `http://localhost:3000`.

## How the pieces fit together

- `src/firebase.js` — Firebase Auth client, reads config from `.env`
- `src/api.js` — every call to the Flask backend, automatically attaches
  the current user's Firebase ID token as a Bearer header
- `src/App.jsx` — owns auth state, space list, active space, and view
  routing (feed vs discover vs the space picker)
- `src/components/Login.jsx` — email/password login and signup
- `src/components/UsernameSetup.jsx` — one-time step after first signup
- `src/components/SpacePicker.jsx` — Netflix-style "who's watching"
  screen shown right after login, and whenever you tap the home icon
- `src/components/SpaceSwitcher.jsx` — the jersey-tag rail for quickly
  hopping between spaces without leaving the app
- `src/components/Feed.jsx` / `PostCard.jsx` — the scoped feed for
  whichever space is active
- `src/components/Compose.jsx` — new post modal, including the AI
  caption/hashtag assist button (calls `/api/ai/caption` on the backend)
- `src/components/Discover.jsx` — browse other people's spaces in the
  same category and follow/unfollow them

## Notes

- Media uploads go to the Flask backend's local `/api/uploads` endpoint
  (see backend README) — there's no direct Firebase Storage upload here.
- Following is space-scoped: following someone from your Gaming space
  has zero effect on your Sports space's feed, matching the backend.
- No build step needed for development — `npm run dev` gives you hot
  reload. `npm run build` produces a static `dist/` folder if you want
  to deploy this later (Vercel, Netlify, Firebase Hosting all work).
