import { Select, Tooltip } from 'antd';
import { DefaultOptionType, SelectProps } from 'antd/es/select';
import { DropDownIcon, InfoCircleIcon } from 'src/assets/icons';

import './styles.scss';

interface Props extends SelectProps {
  value?: string;
  options?: DefaultOptionType[];
  onChange?: (value: string) => void;
  widthFull?: boolean;
  className?: string;
  label?: string;
  optional?: boolean;
  info?: string;
  overlayClassName?: string;
}

const SelectField = ({
  value,
  onChange,
  widthFull,
  className,
  label,
  optional,
  info,
  overlayClassName,
  ...props
}: Props) => {
  return (
    <div className={`select-container ` + className}>
      <div className="flex items-center justify-between">
        {label && (
          <div className="flex gap-1 items-center">
            <p className="input-label">{label}</p>
            {info && (
              <Tooltip
                overlayClassName={overlayClassName}
                placement="top"
                title={info}
                arrow={{ pointAtCenter: true }}
              >
                <InfoCircleIcon />
              </Tooltip>
            )}
          </div>
        )}
        {optional && <p className="text-[12px] text-gray3">Optional</p>}
      </div>
      <Select
        className={widthFull ? 'w-full' : undefined}
        popupClassName="custom-select-popup"
        suffixIcon={<DropDownIcon style={{ width: '20px', height: '20px' }} />}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default SelectField;
