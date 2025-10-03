import { CgSpinnerAlt } from "react-icons/cg";

export function LoadingSpinner(props: { className?: string }) {
  return (
    <div
      className={
        props.className
          ? `loading-spinner ${props.className}`
          : "loading-spinner"
      }
    >
      <CgSpinnerAlt size={32} />
    </div>
  );
}
