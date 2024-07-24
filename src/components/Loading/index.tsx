import { Spin, SpinProps } from 'antd';
import './styles.scss';

interface Props extends SpinProps {
  height?: string;
}

export const Loading = ({ size, height, ...props }: Props) => {
  return (
    <div className="loading-wrapper" style={{ height: height || 'unset' }}>
      <Spin size={size} {...props} />
    </div>
  );
};
