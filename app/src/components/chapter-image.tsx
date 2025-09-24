import { ComponentPropsWithRef } from "react";

interface ChapterImageProps extends ComponentPropsWithRef<"div"> {
  src: string;
  alt: string;
  chapterNumber: number;
  index: number;
}
export function ChapterImage({ src, alt, ref }: ChapterImageProps) {
  return (
    <div ref={ref} className="chapter-image">
      <div className="img-container">
        <img src={src} alt={alt} />
      </div>
    </div>
  );
}
