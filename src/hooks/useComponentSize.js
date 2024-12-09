// Simple hook to export a given components dimensions
import { useState, useEffect } from "react";

// TODO: add more comments, IE for props
const useComponentSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Init a new handler any time the component changes.
  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        setSize({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    if (ref.current) {
      updateSize();
    }

    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, [ref]);

  return size;
};

export default useComponentSize;
