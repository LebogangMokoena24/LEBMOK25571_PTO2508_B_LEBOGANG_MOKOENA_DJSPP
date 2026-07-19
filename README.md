# LEBMOK25571_PTO2508_B_LEBOGANG_MOKOENA_DJSPP
# 🎧 Podcast App - DJSPP Portfolio Piece

A podcast discovery and listening app built in React. It extends the
searchable/sortable/filterable browser from DJS05 with a persistent global
audio player, favouriting, a recommended shows carousel, light/dark
theming, and optional listening-progress tracking.

The app is organised around **one focused React Context per concern**
(theme, favourites, listening progress, audio playback) instead of one big
app-state object. Each context owns its own slice of state, persists itself
to `localStorage` independently, and exposes a small API (`toggleFavorite`,
`playEpisode`, `toggleMute`, etc.). They're composed in `App.jsx` in an
order that reflects real dependencies , `AudioPlayerProvider` reads from
`ListeningProgressContext` to resume playback, so the progress provider
sits above it in the tree.

## Live Demo

`https://your-deployment-url.vercel.app` *(replace after deploying — see
Deployment below)*

## Technologies Used

- **React 19** (function components + hooks) for the UI.
- **react-router-dom v7** for client-side routing between `/`, `/show/:id`,
  and `/favourites` , no full page reloads, which is what lets audio keep
  playing across navigation.
- **Vite** for the dev server and production build.
- **CSS Modules** for component-scoped styling, plus **CSS custom
  properties** in `src/index.css` to drive the light/dark theme from one
  `data-theme` attribute.
- **`localStorage`** to persist favourites, theme, and listening progress ,
  no backend needed.
- A single native **`<audio>` element** (via `useRef`), controlled directly
  in `AudioPlayerContext`, instead of an audio library.
- **ESLint** (flat config, with `eslint-plugin-react-hooks`) for linting.
- **Podcast API** (`https://podcast-api.netlify.app`) for show/season/
  episode data.

## Project Structure

src/

├── api/            fetchPata.js — podcast API calls

├── utils/          formatDate.js, episode.js (ID helper + placeholder audio)

├── context/         PodcastContext, ThemeContext, FavoritesContext,
│                     ListeningProgressContext, AudioPlayerContext

├── components/
│   ├── UI/          Header, ThemeToggle, Loading, Error, Pagination, GenreTags
│   ├── Filters/      SearchBar, SortSelect, GenreFilter
│   ├── Podcasts/     PodcastGrid, PodcastCard, PodcastDetail
│   ├── Player/       GlobalAudioPlayer
│   ├── Favorites/    FavoriteButton
│   └── Carousel/     RecommendedCarousel
└── pages/            Home, ShowDetail, Favourites

## Setup

Requires Node 18+.

```bash
npm install
npm run dev       # dev server, http://localhost:5173
npm run lint      # optional, checks for hook/unused-var issues
npm run build     # production build to /dist
npm run preview   # preview the production build locally
```

No `.env` file or API key needed , the app calls the public Podcast API
directly.

**Troubleshooting:** `vite: not found` means `npm install` didn't run in the
project root. `/show/1` 404ing in production but not in dev means
`vercel.json` wasn't deployed , it holds the SPA rewrite rule.

## Usage

- **Browse:** scroll the "Recommended for you" carousel and click a card,
  or use search/genre/sort to filter the grid below it.
- **Listen:** open a show, pick a season, hit ▶ on an episode — it plays in
  the bar fixed to the bottom and keeps playing as you navigate elsewhere.
  ⏮/⏭ skip within the season, the seek bar jumps to a point, 🔊 mutes.
  Reloading or closing the tab mid-playback prompts for confirmation.
- **Favourite:** click the heart icon on any episode; view them all,
  grouped by show, on the Favourites page, with sort (A–Z/Z–A, newest/
  oldest) and a show filter.
- **Theme:** click the sun/moon icon in the header — persists across
  reloads.
- **Progress:** partially listen to an episode and it resumes from that
  point next time; fully finish one and it's marked "✓ Finished"; "Reset
  listening history" on the Favourites page clears all of it.

## Deployment

1. Push to GitHub.
2. Import into Vercel , default Vite settings work (`npm run build`,
   output `dist`).
3. `vercel.json` is already committed with the rewrite rule so deep links
   like `/show/1` don't 404 on refresh.
4. Update the live demo URL above (and `og:url` in `index.html`) once
   deployed.

## Known Limitations

- The Podcast API doesn't serve real per-episode audio, so every episode
  plays a placeholder track (`PLACEHOLDER_AUDIO_URL` in `src/utils/
  episode.js`).
- The recommended carousel samples shows randomly rather than
  personalising, since the API doesn't expose listening history to base
  recommendations on.
