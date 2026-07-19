import styles from "./Error.module.css";

export default function Error({ message }) {
  return (
    <div className={styles.messageContainer}>
      <div className={styles.error}>{message}</div>
    </div>
  );
}
