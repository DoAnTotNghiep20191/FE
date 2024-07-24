import { Spin, Upload, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useEffect, useState } from 'react';
import { ImageIcon } from 'src/assets/icons';
import { useUploadFileMutation } from 'src/store/slices/app/api';
import { ToastMessage } from '../Toast';
import './styles.scss';
import { FormInstance } from 'antd/lib';
import { useTranslation } from 'react-i18next';
import { C1030, C1089, MSG } from 'src/constants/errorCode';

const { Dragger } = Upload;

export interface IUploadImage extends UploadProps {
  className?: string;
  defaultValue?: string;
  error?: string[];
  width: number;
  height: number;
  optional?: boolean;
  onImageSelect: (image: string) => void;
  form?: FormInstance<any>;
  withOutDefaultImage?: boolean;
}

const UploadImage = ({
  className,
  onImageSelect,
  width,
  height,
  defaultValue = '',
  optional = false,
  form,
  ...props
}: IUploadImage) => {
  const { t } = useTranslation();
  const [uploadFile, { isLoading }] = useUploadFileMutation();

  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    if (defaultValue) {
      setCurrentImage(defaultValue);
    }
  }, [defaultValue]);

  const validateFile = (file: any) => {
    if (Number(file.size) > 10000000 && file.type.includes('image')) {
      onImageSelect('');
      throw new Error(t(MSG[C1030]));
    } else if (!['image/svg+xml', 'image/png', 'image/jpeg'].includes(file.type)) {
      onImageSelect('');
      throw new Error(t(MSG[C1089]));
    }
  };

  const handleRequest = async (options: UploadRequestOption) => {
    try {
      validateFile(options.file);
      const formData = new FormData();
      formData.append('file', options.file);
      const res = await uploadFile(formData).unwrap();
      setCurrentImage(res?.data?.Location);
      onImageSelect && onImageSelect(res?.data?.Location);
    } catch (err: any) {
      console.error(err);
      onImageSelect(defaultValue || '');
      form?.setFieldValue('image', defaultValue || '');
      ToastMessage.error(err?.message);
    }
  };

  return (
    <>
      {optional && <p className="optional text-gray3 text-xs text-right">{t('common.optional')}</p>}
      <ImgCrop aspect={width / height} modalTitle={t('common.cropImage')}>
        <Dragger
          disabled={isLoading}
          name="file"
          className={`upload-image-container ${className}`}
          multiple={false}
          customRequest={(options) => handleRequest(options)}
          showUploadList={false}
          accept=".png,.svg,.jpg,.jpeg"
          {...props}
        >
          {currentImage && !isLoading ? (
            <img className="upload-image-current" src={currentImage} alt="upload-img" />
          ) : (
            <>
              {!props.withOutDefaultImage && (
                <div className="upload-image-icon">
                  <ImageIcon />
                </div>
              )}
              {isLoading ? (
                <Spin />
              ) : (
                <p className="upload-image-placeholder">{t('createEvent.UploadEventImage')}</p>
              )}
            </>
          )}
        </Dragger>
      </ImgCrop>
    </>
  );
};

export default UploadImage;
