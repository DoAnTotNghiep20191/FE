import { Button, Dropdown, Form, Input, InputProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import usePlacesAutocomplete from 'use-places-autocomplete';
import '../Inputs/styles.scss';
import './styles.scss';
import ModalComponent from '../Modals';
import InputField from '../Inputs';
import ButtonContained from '../Buttons/ButtonContained';
import useDidClickOutside from 'src/hooks/useDidClickOutside';
import { useForm } from 'antd/es/form/Form';

interface FormData {
  location: string;
  latitude: string;
  longitude: string;
}

export interface InputPickLocationProps extends InputProps {
  className?: string;
  widthFull?: boolean;
  label?: string;
  inputType?: 'type1' | 'type2';
  optional?: boolean;
  defaultValue?: string;
  onSelectLocation: (address: string, lat?: string, long?: string) => void;
  locationSelected: string;
  allowToManualInput?: boolean;
  latitude: string;
  longitude: string;
  enableCustomAddress?: boolean;
}

const InputPickLocation = ({
  className,
  widthFull,
  label,
  inputType = 'type1',
  optional,
  defaultValue,
  locationSelected: _,
  onSelectLocation,
  allowToManualInput = true,
  latitude,
  longitude,
  enableCustomAddress,
  ...restProps
}: InputPickLocationProps) => {
  const dropdownRef = useRef(null);
  const {
    value,
    suggestions: { data, loading },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 500,
  });
  const { t } = useTranslation();
  const [hasCleard, setCleared] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [form] = useForm();

  useDidClickOutside(dropdownRef, () => {
    setOpenDropdown(false);
    if (value !== restProps.value) {
      setValue((restProps.value as string) || '');
    }
  });

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, []);

  useEffect(() => {
    let debounceTimeout: any;

    if ((value || hasCleard) && !loading) {
      setShowNoResults(false);
      debounceTimeout = setTimeout(() => {
        if ((!data || data.length === 0) && !hasCleard) {
          setShowNoResults(true);
        }
      }, 510);
    }

    return () => clearTimeout(debounceTimeout);
  }, [value, loading, data]);

  const handleInput = (e: any) => {
    setValue(e.target.value);
    setCleared(false);
    if (allowToManualInput) {
      onSelectLocation(e.target.value);
    }
  };

  const handleSelect = (item: any, lat?: string, long?: string) => {
    setValue(item?.description, false);
    clearSuggestions();
    onSelectLocation && onSelectLocation(item?.description, lat, long);
    setCleared(true);
    setShowNoResults(false);
  };

  const OptionsList = () => {
    return data?.length > 0 ? (
      <div className="option-list">
        {data?.map((item: any) => (
          <div key={item?.place_id} className="option" onClick={() => handleSelect(item)}>
            <p className="main-text">{item?.structured_formatting?.main_text}</p>
            <p className="secondary-text">{item?.structured_formatting?.secondary_text}</p>
          </div>
        ))}
      </div>
    ) : showNoResults ? (
      <div className="option-list">{t('common.noResults')}</div>
    ) : (
      <></>
    );
  };

  const handleSubmitCustomLocation = (values: FormData) => {
    setValue(values?.location, false);
    clearSuggestions();
    onSelectLocation && onSelectLocation(values?.location, values.latitude, values.longitude);
    setCleared(true);
    setShowNoResults(false);
    setOpenModal(false);
  };

  const validateLatitude = (_: any, value: any) => {
    const regex = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
    if (!value.trim()) {
      return Promise.reject(new Error('Latitude is required'));
    }
    if (!regex.test(value)) {
      return Promise.reject(new Error('Invalid Latitude'));
    }
    return Promise.resolve();
  };

  const validateLongitude = (_: any, value: any) => {
    const regex =
      /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;
    if (!value.trim()) {
      return Promise.reject(new Error('Longitude is required'));
    }
    if (!regex.test(value)) {
      return Promise.reject(new Error('Invalid Longitude'));
    }
    return Promise.resolve();
  };

  return (
    <div className={`input-box ` + className}>
      <div className="input-header">
        {label && <p className="input-label">{label}</p>}
        {optional && <p className="optional text-gray3">{t('common.optional')}</p>}
      </div>
      <div ref={dropdownRef}>
        <Dropdown
          open={openDropdown}
          overlayClassName="bing-map-dropdown"
          dropdownRender={() => <OptionsList />}
          getPopupContainer={(triggerNode: any) => {
            return triggerNode;
          }}
        >
          <div>
            <Input
              onClick={() => {
                setOpenDropdown(true);
              }}
              className={`input-default input-default-${inputType} ${widthFull ? 'w-full' : ''}`}
              {...restProps}
              value={value}
              onChange={handleInput}
            />
          </div>
        </Dropdown>
      </div>
      <div className="mt-[10px]">
        {enableCustomAddress && (
          <>
            <Button onClick={() => setOpenModal(true)}>{t('createEvent.addCustomLocation')}</Button>
            <ModalComponent onCancel={() => setOpenModal(false)} open={openModal}>
              <div className="py-[20px]">
                <div className="text-center text-[24px] text-[#121313] mb-[20px]">
                  <span>{t('createEvent.locationInfo')}</span>
                </div>
                <div className="flex justify-center">
                  <Form
                    form={form}
                    onFinish={handleSubmitCustomLocation}
                    initialValues={{
                      latitude,
                      longitude,
                      location: defaultValue,
                    }}
                    className="flex w-[100%] flex-col justify-between items-center h-[calc(100vh-150px)] md:h-[auto] gap-[40px]"
                  >
                    <div className="max-w-[300px] w-[100%] flex items-center flex-col justify-center ">
                      <Form.Item
                        key="location"
                        name="location"
                        className="w-[100%]"
                        rules={[{ required: true, message: 'Location is required' }]}
                      >
                        <InputField
                          inputType="type2"
                          widthFull
                          placeholder={t('createEvent.eventLocationPlaceholder')}
                          label={t('createEvent.eventLocation')}
                          maxLength={50}
                        />
                      </Form.Item>
                      <Form.Item
                        key="latitude"
                        name="latitude"
                        className="w-[100%]"
                        rules={[{ validator: validateLatitude }]}
                      >
                        <InputField
                          inputType="type2"
                          widthFull
                          placeholder={t('Eg. 55.604489')}
                          label={t('createEvent.latitude')}
                          maxLength={50}
                        />
                      </Form.Item>
                      <Form.Item
                        key="longitude"
                        name="longitude"
                        className="w-[100%]"
                        rules={[{ validator: validateLongitude }]}
                      >
                        <InputField
                          inputType="type2"
                          className="w-[100%]"
                          widthFull
                          placeholder={t('Eg. 12.997684')}
                          label={t('createEvent.longitude')}
                          maxLength={50}
                        />
                      </Form.Item>
                    </div>
                    <ButtonContained htmlType="submit" className="w-[200px]">
                      {t('signUp.submit')}
                    </ButtonContained>
                  </Form>
                </div>
              </div>
            </ModalComponent>
          </>
        )}
      </div>
    </div>
  );
};

export default InputPickLocation;
