import { ComponentPropsWithRef } from "react";
import styles from "~/components/chapter-image.module.scss";

interface ChapterImageProps extends ComponentPropsWithRef<"div"> {
  src: string;
  alt: string;
  chapterNumber: string;
  index: number;
}
export function ChapterImage({ src, alt, ref }: ChapterImageProps) {
  return (
    <div ref={ref} className={styles.page}>
      <div className={styles["img-container"]}>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}
