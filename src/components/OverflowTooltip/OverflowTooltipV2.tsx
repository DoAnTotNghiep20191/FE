import { useState, ReactNode, memo, useRef, useEffect } from 'react';
import { Tooltip, TooltipProps } from 'antd';
import './styles.scss';

type Props = {
  children: ReactNode;
} & TooltipProps;

const OverflowTooltipV2 = ({ className, children, ...props }: Props) => {
  const [tooltipEnabled, setTooltipEnabled] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if ((ref.current?.offsetWidth || 0) < (ref.current?.scrollWidth || 0)) {
      setTooltipEnabled(true);
    }
  }, []);

  return (
    <>
      {tooltipEnabled ? (
        <Tooltip overlayClassName={`Ticket-tooltip `} className={className} {...props}>
          {children}
        </Tooltip>
      ) : (
        <div ref={ref} className={className}>
          {children}
        </div>
      )}
    </>
  );
};

export default memo(OverflowTooltipV2);
