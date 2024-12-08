import { useState, useEffect } from "react";

const useComponentSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const updateSize = () => {
    if (ref.current) {
      setSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    } else {
      setSize(size);
    }
  };

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [ref]);

  return size;
};

export default useComponentSize;