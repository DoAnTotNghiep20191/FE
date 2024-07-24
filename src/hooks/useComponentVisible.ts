import { useEffect, useState, useRef } from 'react';

const useComponentVisible = (
  initialIsVisible: any,
  isEditBSCBtn: boolean,
  setIsShowGroupInterval: (e: boolean) => void,
  setIsShowChartType: (e: boolean) => void,
) => {
  const [isCptVisible, setIsCptVisible] = useState(initialIsVisible);
  const ref = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsCptVisible(false);
      if (isEditBSCBtn) {
        setIsShowGroupInterval(false);
      }
      setIsShowChartType(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref, isCptVisible, setIsCptVisible };
};

export default useComponentVisible;
