import { useContext, useMemo } from "react";
import { SearchBar, SortSelect, GenreFilter, PodcastGrid, Pagination, Loading, Error } from "../components";
import { RecommendedCarousel } from "../components/Carousel";
import styles from "./Home.module.css";
import { genres } from "../data";
import { PodcastContext } from "../context/PodcastContext";

function pickRecommended(podcasts, count = 10) {
  if (podcasts.length <= count) return podcasts;
  const shuffled = [...podcasts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Home() {
  const { allPodcasts, loading, error } = useContext(PodcastContext);
  const recommended = useMemo(() => pickRecommended(allPodcasts), [allPodcasts]);

  return (
    <main className={styles.main}>
      {!loading && !error && <RecommendedCarousel shows={recommended} />}

      <section className={styles.controls}>
        <SearchBar />
        <GenreFilter genres={genres} />
        <SortSelect />
      </section>

      {loading && <Loading message="Loading podcasts..." />}
      {error && <Error message={`Error occurred while fetching podcasts: ${error}`} />}

      {!loading && !error && (
        <>
          <PodcastGrid />
          <Pagination />
        </>
      )}
    </main>
  );
}
