import React from 'react';
import { CheckIcon } from 'src/assets/icons';
import './checkbox-styles.scss';

interface ICheckBoxField {
  className?: string;
  onClick: () => void;
  children?: React.ReactNode;
  checked: boolean;
}

const CheckBoxField = ({ className, onClick, children, checked }: ICheckBoxField) => {
  return (
    <div className={`check-box-wrapper ${className || ''}`}>
      <>
        <div className="check-box" onClick={onClick}>
          {checked ? <CheckIcon width={23} height={22} /> : <div className="check" />}
        </div>
        {children}
      </>
    </div>
  );
};

export default CheckBoxField;
