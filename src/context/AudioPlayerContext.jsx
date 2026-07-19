import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ListeningProgressContext } from "./ListeningProgressContext";

export const AudioPlayerContext = createContext();

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const { saveProgress, getProgress } = useContext(ListeningProgressContext);

  const [episode, setEpisode] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (episode) {
        saveProgress(episode.id, audio.currentTime, audio.duration || 0);
      }
    };
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      if (episode) saveProgress(episode.id, audio.duration, audio.duration);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episode]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  const playEpisode = (nextEpisode, episodeQueue = [nextEpisode]) => {
    const audio = audioRef.current;
    setQueue(episodeQueue);

    if (episode && episode.id === nextEpisode.id) {
      audio.play();
      return;
    }

    setEpisode(nextEpisode);
    audio.src = nextEpisode.audioUrl;

    const saved = getProgress(nextEpisode.id);
    const resumeFrom = saved && !saved.finished ? saved.position : 0;

    audio.currentTime = resumeFrom || 0;
    setCurrentTime(resumeFrom || 0);
    audio.play();
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!episode) return;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const seek = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const playNext = () => {
    if (!episode || queue.length < 2) return;
    const index = queue.findIndex((e) => e.id === episode.id);
    if (index === -1 || index === queue.length - 1) return;
    playEpisode(queue[index + 1], queue);
  };

  const playPrevious = () => {
    if (!episode || queue.length < 2) return;
    const index = queue.findIndex((e) => e.id === episode.id);
    if (index <= 0) return;
    playEpisode(queue[index - 1], queue);
  };

  const setVolume = (value) => {
    setVolumeState(value);
    if (value > 0) setMuted(false);
  };

  const toggleMute = () => setMuted((prev) => !prev);

  return (
    <AudioPlayerContext.Provider
      value={{
        episode,
        queue,
        isPlaying,
        currentTime,
        duration,
        volume,
        muted,
        playEpisode,
        togglePlay,
        seek,
        playNext,
        playPrevious,
        setVolume,
        toggleMute,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}
