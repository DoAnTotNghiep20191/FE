import { useEffect, useRef, useState } from 'react';
import './styles.scss';

const CandleLoading = () => {
  const [_, setCandle] = useState(1);
  const ref = useRef(1);
  const handleCandleAnimation = () => {
    const interval = setInterval(() => {
      if (ref.current > 2) {
        ref.current = 1;
      } else if (ref.current < 1) {
        ref.current = 3;
      } else {
        ref.current = ref.current + 1;
      }
      setCandle(ref.current);
    }, 500);
    return interval;
  };

  useEffect(() => {
    const interval = handleCandleAnimation();
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center candle-loading">
      <div className="flex gap-[3px]">
        <div className={`candle1 ${ref.current === 1 ? 'scale' : ''}`}></div>
        <div className={`candle2 ${ref.current === 2 ? 'scale' : ''}`}></div>
        <div className={`candle3 ${ref.current === 3 ? 'scale' : ''}`}></div>
      </div>
    </div>
  );
};

export default CandleLoading;
