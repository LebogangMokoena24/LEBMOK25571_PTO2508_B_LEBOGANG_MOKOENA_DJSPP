import styles from "./Loading.module.css";

export default function Loading({ message }) {
  return (
    <div className={styles.messageContainer}>
      <div className={styles.spinner}></div>
      <p>{message}</p>
    </div>
  );
}
