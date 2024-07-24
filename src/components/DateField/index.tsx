import { DatePicker } from 'antd';
import { CalenderIcon } from 'src/assets/icons';

import './styles.scss';
import { useMobile } from 'src/hooks/useMobile';
import { DatePickerProps } from 'antd/lib';

export interface DateFieldProps extends DatePickerProps {
  className?: string;
  widthFull?: boolean;
  label?: string;
  format?: string;
  placeholder?: string;
  showTime?: boolean;
}

const DateField = ({
  widthFull,
  label,
  format,
  placeholder,
  disabledDate,
  showTime,
  ...restProps
}: DateFieldProps) => {
  const isMobile = useMobile();
  const handleFocus = (e: any) => {
    if (isMobile && e?.target) {
      (e.target as HTMLInputElement).readOnly = true;
    }
  };

  return (
    <div className="date-container">
      {label && <p className="input-label">{label}</p>}
      <DatePicker
        onFocus={handleFocus}
        className={`date-field ${widthFull ? 'w-full' : ''}`}
        suffixIcon={<CalenderIcon fill="#8FBFFA" />}
        format={format}
        placeholder={placeholder}
        disabledDate={disabledDate}
        showTime={showTime}
        {...restProps}
      />
    </div>
  );
};

export default DateField;
