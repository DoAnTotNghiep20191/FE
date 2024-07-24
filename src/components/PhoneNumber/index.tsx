import './styles.scss';
import { Form, Input, InputProps, Select } from 'antd';
import { DropDownIcon } from 'src/assets/icons';
import { useMemo } from 'react';
import { countryCode } from 'src/constants/countryCode';
import { Space } from 'antd/lib';
import { useCountry } from 'src/hooks/useCounty';

export interface InputFieldProps extends InputProps {
  className?: string;
  label?: string;
  codeValue?: string;
}

const PhoneNumberInput = ({ className, label, codeValue, ...restProps }: InputFieldProps) => {
  const { getDialCode } = useCountry();

  const options = useMemo(
    () =>
      countryCode?.map((item) => ({
        value: item?.code,
        label: (
          <img
            style={{ width: '24px', height: '16px', paddingTop: '2px', display: 'block' }}
            src={`https://flagcdn.com/w320/${item?.code.toLowerCase()}.png`}
            alt={item?.code}
          />
        ),
        name: item?.name,
      })),
    [],
  );

  const prefixSelector = (
    <Form.Item name="phoneCode" noStyle>
      <Select
        style={{ width: 70 }}
        suffixIcon={<DropDownIcon />}
        options={options}
        popupMatchSelectWidth={false}
        popupClassName="custom-select-popup"
        optionRender={(option) => {
          return (
            <Space key={option.data?.value} className="flex">
              <img
                style={{ width: '24px', height: '16px' }}
                src={`https://flagcdn.com/w320/${option?.data?.value.toLowerCase()}.png`}
                alt={option.data.value}
              />
              <span className="text-wrap">{option?.data?.name}</span>
            </Space>
          );
        }}
      />
    </Form.Item>
  );
  return (
    <div className={`input-container ` + className}>
      {label && <p className="input-label">{label}</p>}
      <Input
        prefix={`(${codeValue ? getDialCode(codeValue) : '+__'})`}
        addonBefore={prefixSelector}
        style={{ width: '100%' }}
        pattern="^\d*(\d{0,2})?$"
        onInput={(e) => {
          if (!e.currentTarget.validity.valid) {
            e.currentTarget.value = '';
          }
        }}
        {...restProps}
      />
    </div>
  );
};

export default PhoneNumberInput;
