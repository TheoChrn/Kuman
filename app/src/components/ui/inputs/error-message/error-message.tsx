import styles from "./styles.module.scss";

export function ErrorMessage(props: { children: React.ReactNode }) {
  return <span className={styles["error"]} {...props} />;
}
