import { Button, ButtonProps } from 'antd';
import React from 'react';
import './styles/index.scss';
interface IButtonOutLinedProps extends ButtonProps {
  buttonType?: 'type1' | 'type2';
  mode?: 'large' | 'medium' | 'small';
  fullWidth?: boolean;
}

const ButtonOutLined: React.FC<IButtonOutLinedProps> = ({
  className,
  children,
  buttonType = 'type1',
  mode = 'large',
  fullWidth,
  ...props
}) => {
  return (
    <Button
      className={`outlined-default--${buttonType}  ${className || ''} btn-${mode} ${
        fullWidth ? 'w-full' : ''
      }`}
      {...props}
    >
      {children}
    </Button>
  );
};

export default ButtonOutLined;
