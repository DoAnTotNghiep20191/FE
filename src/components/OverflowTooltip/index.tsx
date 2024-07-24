import { useState, MouseEvent, ReactNode, memo } from 'react';
import { TooltipProps } from 'antd';
import TicketTooltip from '../Tooltip';

type Props = {
  children: ReactNode;
} & TooltipProps;

const OverflowTooltip = ({ className, children, ...props }: Props) => {
  const [tooltipEnabled, setTooltipEnabled] = useState(false);
  const handleShouldShow = ({ currentTarget }: MouseEvent<Element>) => {
    const children = currentTarget.childNodes[0];

    if (children) {
      const childLength = (currentTarget.childNodes[0] as any).scrollWidth;
      if (childLength > currentTarget.scrollWidth) {
        setTooltipEnabled(true);
      }
    }
  };
  const hideTooltip = () => setTooltipEnabled(false);
  return (
    <div className={className} onMouseEnter={handleShouldShow} onMouseLeave={hideTooltip}>
      {tooltipEnabled ? (
        <TicketTooltip open={tooltipEnabled} {...props}>
          {children}
        </TicketTooltip>
      ) : (
        children
      )}
    </div>
  );
};

export default memo(OverflowTooltip);
