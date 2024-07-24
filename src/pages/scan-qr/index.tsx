import { Scanner } from '@yudiel/react-qr-scanner';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ModalComponent from 'src/components/Modals';
import { WIDTH_FORM_MODAL_2 } from 'src/constants';
import { PATHS } from 'src/constants/paths';
import { CameraIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import { useTranslation } from 'react-i18next';
export default function ScanQR() {
  const history = useHistory();
  const { t } = useTranslation();
  const [dataQR, setDataQR] = useState('');
  const [isNotAllow, setIsNotAllow] = useState(false);

  useEffect(() => {
    if (dataQR) {
      const uri = dataQR?.split(import.meta.env.VITE_SITE_URI!)?.[1];
      history.replace(uri);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataQR]);

  return (
    <div className="relative min-h-[50vh] h-[100vh] flex  !justify-center">
      <div className="flex flex-col mt-[40px] [&>video]:!rounded-xl">
        <b className="text-center font-loos font-normal text-[24px]">
          {t('checkInYour.scanORCode')}
        </b>
        <b className="text-center text-[14px] font-[400] mt-[10px] mb-[32px]">
          {t('checkInYour.placeORCode')}
        </b>
        <Scanner
          onResult={(text) => {
            return setDataQR(text);
          }}
          onError={(error) => {
            if (error.toString().includes('NotAllowedError')) {
              return setIsNotAllow(true);
            }
          }}
        />
      </div>
      <ModalComponent
        className="top-0 md:top-[100px] publish-event-modal"
        open={isNotAllow}
        width={WIDTH_FORM_MODAL_2}
        onCancel={() => history.push(PATHS.dashboard)}
        destroyOnClose
      >
        {/* {isMobile && (
          <BackIcon
            className="absolute top-11 left-8 z-10"
            onClick={() => history.push(PATHS.dashboard)}
          />
        )} */}
        <div className="relative flex flex-col items-center justify-center pt-[20px] px-[10px] h-[calc(100vh-140px)] md:h-auto">
          <p className="text-[24px]">{t('checkInYour.allowAccessToCamera')}</p>
          <p className="text-[14px] font-normal text-center w-[90%] md:w-[402px]">
            {t('checkInYour.v3rifiedRequiresAccessToYour')}
          </p>
          <div className="pt-[40px] pb-[120px]">
            <CameraIcon />
          </div>
          <ButtonContained
            onClick={() => history.push(PATHS.dashboard)}
            className="mt-auto md:mt-0 w-[272px] md:w-[212px]"
            buttonType="type2"
          >
            {t('checkInYour.buttonClose')}
          </ButtonContained>
        </div>
      </ModalComponent>
    </div>
  );
}
