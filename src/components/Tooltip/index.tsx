import { Grid, Tooltip, TooltipProps } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import './styles.scss';
import { InfoCircleOutlined } from '@ant-design/icons';

type ITicketTooltip = {
  overlayClassName?: string;
} & TooltipProps;

const TicketTooltip: React.FC<ITicketTooltip> = ({ overlayClassName, ...props }) => {
  const { useBreakpoint } = Grid;
  const breakpoint = useBreakpoint();
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement | any>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (breakpoint.xs)
    return (
      <div ref={ref} onClick={() => setOpen(true)}>
        <Tooltip
          open={open}
          overlayClassName={`Ticket-tooltip ${overlayClassName || ''}`}
          {...props}
        >
          {props.children || <InfoCircleOutlined />}
        </Tooltip>
      </div>
    );
  return (
    <Tooltip overlayClassName={`Ticket-tooltip ${overlayClassName || ''}`} {...props}>
      {props.children || <InfoCircleOutlined />}
    </Tooltip>
  );
};

export default TicketTooltip;
