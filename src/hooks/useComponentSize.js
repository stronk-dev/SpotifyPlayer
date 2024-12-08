import { useState, useEffect } from "react";

const useComponentSize = (ref) => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  const updateSize = () => {
    if (ref.current) {
      setSize({
        width: ref.current.offsetWidth,
        height: ref.current.offsetHeight,
      });
    }
  };

  useEffect(() => {
    if (ref.current) {
      updateSize();
    }

    const observer = new MutationObserver(updateSize);
    if (ref.current) {
      observer.observe(ref.current, { attributes: true, childList: true, subtree: true });
    }

    window.addEventListener("resize", updateSize);
    return () => {
      window.removeEventListener("resize", updateSize);
      if (ref.current) {
        observer.disconnect();
      }
    };
  }, [ref]);

  return size;
};

export default useComponentSize;
