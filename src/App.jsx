import { Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import Favourites from "./pages/Favourites";
import { PodcastProvider } from "./context/PodcastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ListeningProgressProvider } from "./context/ListeningProgressContext";
import { AudioPlayerProvider } from "./context/AudioPlayerContext";
import { GlobalAudioPlayer } from "./components/Player";

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <ListeningProgressProvider>
          <AudioPlayerProvider>
            <Header />
            <PodcastProvider>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path={`/show/:id`} element={<ShowDetail />} />
                <Route path="/favourites" element={<Favourites />} />
              </Routes>
            </PodcastProvider>
            <GlobalAudioPlayer />
          </AudioPlayerProvider>
        </ListeningProgressProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
