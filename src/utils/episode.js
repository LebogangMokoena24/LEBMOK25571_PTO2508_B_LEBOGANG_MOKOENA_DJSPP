export const PLACEHOLDER_AUDIO_URL =
  "https://podcast-api.netlify.app/placeholder-audio.mp3";

export function getEpisodeId(showId, seasonIndex, episodeIndex) {
  return `${showId}-${seasonIndex}-${episodeIndex}`;
}
