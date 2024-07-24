import _ from 'lodash';
import { toast } from 'react-toastify';
import ToastWrapper from './ToastContainer';

enum TOAST_TYPE {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export const ToastMessage = (() => {
  const toastClone = _.cloneDeep(toast);

  const toastRender = (type: TOAST_TYPE) => {
    return (headContent?: React.ReactNode, bodyContent?: React.ReactNode) =>
      toast[type](<ToastWrapper headContent={headContent} bodyContent={bodyContent} />);
  };

  return {
    ...toastClone,
    [TOAST_TYPE.INFO]: toastRender(TOAST_TYPE.INFO),
    [TOAST_TYPE.ERROR]: toastRender(TOAST_TYPE.ERROR),
    [TOAST_TYPE.WARNING]: toastRender(TOAST_TYPE.WARNING),
    [TOAST_TYPE.SUCCESS]: toastRender(TOAST_TYPE.SUCCESS),
  };
})();
