import { LuRectangleHorizontal } from "react-icons/lu";

export function DoublePage() {
  return (
    <div>
      <LuRectangleHorizontal
        viewBox="0 3 24 24"
        size={32}
        transform="rotate(90)"
      />
      <LuRectangleHorizontal
        viewBox="0 -3 24 24"
        size={32}
        transform="rotate(90)"
      />
    </div>
  );
}
