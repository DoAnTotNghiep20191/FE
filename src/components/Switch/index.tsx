import { Switch } from 'antd';
import './styles.scss';

interface ISwitchField {
  className?: string;
  onChange: (e: boolean) => void;
  children?: React.ReactNode;
  checked?: boolean;
  checkedChildren?: any;
  unCheckedChildren?: any;
}

const SwitchField = ({
  className,
  onChange,
  children,
  checked,
  checkedChildren,
  unCheckedChildren,
}: ISwitchField) => {
  return (
    <div className="switch-container">
      <Switch
        checked={checked}
        onChange={(e) => onChange(e)}
        className={`switch-customs ${className}`}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
      />
      <div>{children}</div>
    </div>
  );
};

export default SwitchField;
