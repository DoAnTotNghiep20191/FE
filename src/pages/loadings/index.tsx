import { Spin } from 'antd';
import './index.scss';

export const initArrayByLength = (length: number) => {
  // eslint-disable-next-line prefer-spread
  return Array.apply(null, Array(length)).map(function (_, i) {
    return i;
  });
};

export const LoadingPage: React.FC = () => {
  return (
    <div className=" loading-page">
      <Spin />
    </div>
  );
};
