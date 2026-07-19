import { createContext, useEffect, useState } from "react";

const PROGRESS_STORAGE_KEY = "podcast-app-listening-progress";

export const ListeningProgressContext = createContext();

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function ListeningProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const saveProgress = (episodeId, position, duration) => {
    if (!episodeId || !duration) return;
    const finished = position / duration >= 0.98;
    setProgress((prev) => ({
      ...prev,
      [episodeId]: {
        position: finished ? 0 : position,
        duration,
        finished: finished || Boolean(prev[episodeId]?.finished),
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const getProgress = (episodeId) => progress[episodeId];

  const resetProgress = () => setProgress({});

  return (
    <ListeningProgressContext.Provider
      value={{ progress, saveProgress, getProgress, resetProgress }}
    >
      {children}
    </ListeningProgressContext.Provider>
  );
}
