import { ToastContainer } from 'react-toastify';
import { ToastCloseIcon } from 'src/assets/icons';

import './toast.scss';

const ToastContext = () => {
  return (
    <ToastContainer
      closeButton={() => (
        <img src={ToastCloseIcon} alt="Toast close" className="toast-close-icon" />
      )}
      bodyClassName="body-toast"
      toastClassName={(props) => {
        switch (props?.type) {
          case 'info':
            return 'wrapper-toast';
          case 'error':
            return 'wrapper-toast wrapper-error-toast';
          case 'success':
            return 'wrapper-toast wrapper-success-toast';
          case 'warning':
            return 'wrapper-toast wrapper-warning-toast';
          case 'default':
            return 'wrapper-toast';
          default:
            return 'wrapper-toast';
        }
      }}
      autoClose={3000}
      draggable={false}
      hideProgressBar
      pauseOnHover={false}
      position="top-right"
      limit={5}
    />
  );
};

export default ToastContext;
