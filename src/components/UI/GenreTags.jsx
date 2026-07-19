import { genres as genreMap } from "../../data";
import styles from "./GenreTags.module.css";

export default function GenreTags({ genres }) {
  const genreSpans = genres.map((id) => {
    const match = genreMap.find((genre) => genre.id === id);
    return (
      <span key={id} className={styles.tag}>
        {match ? match.title : `Unknown (${id})`}
      </span>
    );
  });
  return <div className={styles.tags}>{genreSpans}</div>;
}
