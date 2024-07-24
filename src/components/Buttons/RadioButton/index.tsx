import { Radio } from 'antd';
import './styles.scss';
interface Props {
  children: React.ReactNode;
  value: string | number;
  size?: 'large' | 'medium' | 'small';
}

const RadioButton = ({ children, value, size = 'large' }: Props) => {
  return (
    <Radio className={`radio-btn radio-btn--${size}`} value={value}>
      <div className="children">{children}</div>
    </Radio>
  );
};

export default RadioButton;
