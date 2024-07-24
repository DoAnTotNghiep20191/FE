import { memo, useEffect } from 'react';
import { useCountdown } from 'src/hooks/useCountdown';
interface IProps {
  targetDate: number;
  handleExpired?: () => void;
}
const CountdownTimer = ({ targetDate, handleExpired }: IProps) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  useEffect(() => {
    if (seconds <= 0) {
      handleExpired?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  if (days + hours + minutes + seconds <= 0) {
    return <p>00</p>;
  }
  return <p>{seconds < 10 ? `0${seconds}` : seconds} s</p>;
};

export default memo(CountdownTimer);
