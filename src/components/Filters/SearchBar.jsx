import { useState, useEffect, useContext } from "react";
import { PodcastContext } from "../../context/PodcastContext";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
  const { search, setSearch } = useContext(PodcastContext);
  const [value, setValue] = useState(search);

  useEffect(() => {
    const id = setTimeout(() => setSearch(value), 300);
    return () => clearTimeout(id);
  }, [value]);

  return (
    <input
      type="search"
      placeholder="Search podcasts…"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={styles.searchInput}
    />
  );
}
