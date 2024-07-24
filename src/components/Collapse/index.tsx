import { Collapse, CollapseProps } from 'antd';
import React from 'react';
import './collapse-styles.scss';

interface ICollapse extends CollapseProps {
  defaultCollapsible?: boolean;
}

const CustomCollapse: React.FC<ICollapse> = ({
  className,
  items,
  defaultCollapsible = false,
  expandIcon: _,
  ...props
}) => {
  return (
    <Collapse
      className={`custom-collapse ${className ? className : ''}`}
      defaultActiveKey={[defaultCollapsible ? '2' : '1']}
      items={items}
      expandIconPosition="end"
      {...props}
    />
  );
};

export default CustomCollapse;
