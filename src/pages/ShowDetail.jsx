import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchSinglePodcast } from "../api/fetchPata";
import { Loading, Error, PodcastDetail } from "../components";

export default function ShowDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { genres } = location.state || {};

  const [podcast, setPodcast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSinglePodcast(id, setPodcast, setError, setLoading);
  }, []);

  return (
    <>
      {loading && <Loading message="Loading podcast..." />}
      {error && <Error message={`Error occurred while fetching podcast: ${error}`} />}
      {!loading && !error && <PodcastDetail podcast={podcast} genres={genres} />}
    </>
  );
}
