import { Image, Spin, Upload, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ProfileImage, EditImageIcon } from 'src/assets/icons';
import { ToastMessage } from 'src/components/Toast';
import { C1082, C1083, C1084, MSG } from 'src/constants/errorCode';
import { onLogError } from 'src/helpers';
import { useUploadFileMutation } from 'src/store/slices/app/api';
import { useUpdateUserInfoMutation } from 'src/store/slices/profile/api';
interface IAvatarUpload extends UploadProps {
  className?: string;
  url?: string;
  kycStatus?: string;
}

export const AvatarUpload = ({ url, ...props }: IAvatarUpload) => {
  const { t } = useTranslation();
  const [uploadFile] = useUploadFileMutation();
  const [updateAvatar] = useUpdateUserInfoMutation();

  const [isLoading, setIsLoading] = useState(false);

  const validateFile = (file: any) => {
    if (Number(file.size) > 5000000 && file.type.includes('image')) {
      throw new Error(t(MSG[C1082]));
    } else if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      throw new Error(t(MSG[C1083]));
    }
  };
  const handleRequest = async (options: UploadRequestOption) => {
    try {
      setIsLoading(true);
      validateFile(options.file);
      const formData = new FormData();
      formData.append('file', options.file);
      const res = await uploadFile(formData).unwrap();
      await updateAvatar({ avatar: res?.data?.Location }).unwrap();
      ToastMessage.success(t(MSG[C1084]));
    } catch (err: any) {
      console.error(err);
      ToastMessage.error(err?.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <ImgCrop
        aspect={176 / 176}
        quality={0.8}
        modalTitle={t('common.cropImage')}
        cropShape="round"
      >
        <Upload
          accept=".png,.jpg"
          name="file"
          disabled={isLoading}
          multiple={false}
          customRequest={(options) => handleRequest(options)}
          showUploadList={false}
          className=""
          {...props}
        >
          <Image
            src={url}
            alt="avatar"
            fallback={ProfileImage}
            className="!w-full !h-full border border-white bg-white border-solid rounded-full relative shadow-lg shadow-rgba(0, 0, 0, 0.25)"
            rootClassName="w-[198px] h-[198px]"
            preview={false}
          ></Image>
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
              <Spin />
            </div>
          )}
          <EditImageIcon className="absolute cursor-pointer top-0 right-0" />
        </Upload>
      </ImgCrop>
      {/* <>
        {status === EUserKycStatus.VERIFIED || kycStatus === EUserKycStatus.VERIFIED ? (
          <div className="flex flex-row absolute bottom-0 right-0 items-center">
            <VerifyIcon />
          </div>
        ) : (
          <>
            {status === EUserKycStatus.PENDING_VERIFIED ||
            kycStatus === EUserKycStatus.PENDING_VERIFIED ? (
              <div className="flex flex-row  relative md:absolute md:bottom-[4px] md:right-[-97px] items-center !cursor-default">
                <p className="mt-2 md:mt-0 md:pl-[20px] text-[16px] font-[500] text-green ">
                  {t('profile.pending')}
                </p>
              </div>
            ) : (
              <div
                className={`flex flex-row relative md:absolute md:bottom-[-35px] items-center w-full`}
              >
                <p
                  onClick={onVerifyKYC}
                  className="mt-2 md:mt-0 md:pl-[8px] text-[16px] font-[500] text-primary underline"
                >
                  {t('profile.verifyAccount')}{' '}
                  {isLoadingKyc && <LoadingOutlined className="ml-[10px]" />}
                </p>
              </div>
            )}
          </>
        )}
      </> */}
    </>
  );
};
