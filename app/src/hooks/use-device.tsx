import { useEffect, useState } from "react";

const devices = ["mobile", "tablet", "desktop"] as const;
type Devices = typeof devices;
type Device = Devices[number];

export function useDevice() {
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    const onResize = () => {
      setDevice(
        window.innerWidth < 768
          ? "mobile"
          : window.innerWidth < 1024
          ? "tablet"
          : "desktop"
      );
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { device };
}
