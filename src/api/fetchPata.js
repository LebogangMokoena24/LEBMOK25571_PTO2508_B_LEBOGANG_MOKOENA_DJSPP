export async function fetchPodcasts(setPodcasts, setError, setLoading) {
  try {
    const res = await fetch("https://podcast-api.netlify.app");
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    setPodcasts(data);
  } catch (err) {
    console.error("Failed to fetch podcasts:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

export async function fetchSinglePodcast(id, setPodcast, setError, setLoading) {
  try {
    const res = await fetch(`https://podcast-api.netlify.app/id/${id}`);
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    setPodcast(data);
  } catch (err) {
    console.error("Failed to fetch podcasts:", err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
