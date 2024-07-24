import React from 'react';
import './styles.scss';

interface IToastWrapper {
  headContent?: React.ReactNode;
  bodyContent?: React.ReactNode;
}

const ToastWrapper: React.FC<IToastWrapper> = ({ bodyContent, headContent }) => {
  return (
    <div className="toast-body">
      <div className="toast-body__top mr-3 text-wrap max-w-[320px] md:max-w-[500px]">
        {headContent}
      </div>
      <div className="toast-body__bottom">{bodyContent}</div>
    </div>
  );
};

export default ToastWrapper;
