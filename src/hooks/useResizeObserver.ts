import { useEffect, useState } from 'react';

export const useResizeObserver = (callback?: (value: ResizeObserverEntry[]) => void) => {
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const [elemRef, setElemRef] = useState<HTMLElement | SVGSVGElement | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setHeight(entries[0].contentRect.height);
      setWidth(entries[0].contentRect.width);
      !!callback && callback(entries);
    });
    if (elemRef) {
      observer.observe(elemRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [elemRef, callback]);

  return {
    setElemRef,
    width,
    height,
  };
};
