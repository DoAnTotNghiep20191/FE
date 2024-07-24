import { Button, ButtonProps } from 'antd';
import React from 'react';
import './styles/index.scss';

interface IButtonContainedProps extends ButtonProps {
  buttonType?: 'type1' | 'type2' | 'type3' | 'type4' | 'type5' | 'type6' | 'type7';
  mode?: 'large' | 'medium' | 'small';
  fullWidth?: boolean;
  shape?: 'default' | 'circle' | 'round';
}

const ButtonContained: React.FC<IButtonContainedProps> = ({
  className,
  children,
  buttonType = 'type1',
  mode = 'large',
  fullWidth,
  shape = 'round',
  ...props
}) => {
  return (
    <Button
      shape={shape}
      className={`${className || ''} contained-default--${buttonType}  btn-${mode} ${
        fullWidth ? 'w-full' : ''
      }`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonContained;
