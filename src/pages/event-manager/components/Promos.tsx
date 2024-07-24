import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EditIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from 'src/components/Modals';
import { WIDTH_FORM_MODAL } from 'src/constants';
import { useGetListPromoCodeQuery, useGetListTicketOptionQuery } from 'src/store/slices/app/api';
import { PromoCodeResponse } from 'src/store/slices/app/types';
import CreatePromo from './CreatePromo';

import BackMobileIcon from 'src/assets/icons/common/arrow-left.svg?react';
import { Grid } from 'antd';
import { ETeamRole } from 'src/store/slices/user/types';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { nFormatter } from 'src/helpers/formatNumber';
import OverflowTooltip from 'src/components/OverflowTooltip';
import { useTranslation } from 'react-i18next';
const { useBreakpoint } = Grid;

interface RouteParams {
  id: string;
}

const Promos = ({ isPastEvent }: { isPastEvent: boolean }) => {
  const { id } = useParams<RouteParams>();

  const [dataEditPromoCode, setDataEditPromoCode] = useState<PromoCodeResponse | null>(null);
  const [isAddPromoCode, setIsAddPromoCode] = useState(false);
  const breakpoint = useBreakpoint();
  const userInfo = useAppSelector(getUserInfo);

  const { data: dataPromo } = useGetListPromoCodeQuery(
    { id: +id, sortBy: 'createdAt', direction: 'DESC' },
    { skip: !id },
  );
  const { data } = useGetListTicketOptionQuery(
    { id: +id, sortBy: 'createdAt', direction: 'DESC' },
    { skip: !id },
  );

  const { t } = useTranslation();

  const handleEditPromoCode = (item: PromoCodeResponse) => {
    setIsAddPromoCode(true);
    setDataEditPromoCode(item);
  };

  const handleCloseCreatePromo = () => {
    setDataEditPromoCode(null);
    setIsAddPromoCode(false);
  };

  return (
    <div
      className="min-h-[calc(100vh-400px)] md:min-h-auto bg-gray2 rounded-[3px] py-[20px] px-[24px] mb-[74px] min-h-fit md:min-h-[727px] shadow-lg shadow-rgba(0, 0, 0, 0.25)
    border-l-[2px] border-red1 border-solid flex flex-col"
    >
      {/* <p className="text-[20px] font-[800] mb-[10px] text-[white]">
        {t('eventManagement.promotionCodes')}
      </p> */}

      {Array(dataPromo?.data) && dataPromo?.data?.length! > 0 && (
        <>
          <div className="mb-[50px]">
            {breakpoint.md ? (
              <>
                <div className="table-header flex flex-row pl-[20px] pr-[52px] gap-[20px] ">
                  <p className="w-[15%] text-black1 text-[12px] font-[400]">
                    {t('eventManagement.codeName')}
                  </p>
                  <p className="flex-1 text-black1 text-[12px] font-[400]">
                    {t('eventManagement.ticketType')}
                  </p>
                  <p className="w-[20%] text-black1 text-[12px] font-[400]">
                    {t('eventManagement.discount')}
                  </p>
                  <p className="w-[20%] text-black1 text-[12px] font-[400]">
                    {t('eventManagement.capacity')}
                  </p>
                  {!isPastEvent && userInfo?.roleOfTeam !== ETeamRole.OPERATIONS && (
                    <p className="w-[5%] bg-back3F" />
                  )}
                </div>
                {dataPromo?.data?.map((item, index) => (
                  <div
                    key={index}
                    className="ticket-item mb-[10px] h-[56px] items-center bg-black1F rounded-[3px] pl-[20px] pr-[52px] flex flex-row  text-black1 gap-[20px]"
                  >
                    <OverflowTooltip title={item?.name} className="w-[15%]">
                      <p className="w-full text-black1 text-[16px] max-md:text-[14p font-[400] truncate">
                        {item?.name}
                      </p>
                    </OverflowTooltip>
                    <p className="flex-1 text-black1 text-[16px] font-[400]">
                      {item?.applyStatus === 'off' ? '' : item?.applyTo}
                    </p>
                    <p className="w-[20%] text-black1 text-[16px] font-[400]">
                      {nFormatter(String(item?.discountAmount))}%
                    </p>
                    <p className="w-[20%] text-[16px] font-[400]">
                      {nFormatter(String(item?.capacity))}
                    </p>
                    {!isPastEvent && userInfo?.roleOfTeam !== ETeamRole.OPERATIONS && (
                      <button
                        className="!h-[39px] w-[5%] flex justify-end items-center"
                        onClick={() => handleEditPromoCode(item)}
                      >
                        <EditIcon />
                      </button>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <>
                <div className="table-header flex justify-between pl-2 pr-0  gap-[20px]">
                  <p className=" text-[black] text-[12px] font-[500] text-nowrap">
                    {t('eventManagement.nameTicketType')}
                  </p>
                  <p className="w-[20%] text-[black] text-[12px] font-[500]">
                    {t('eventManagement.discount')}
                  </p>
                  <p className="w-[20%] text-[black] text-[12px] font-[500]">
                    {t('eventManagement.capacity')}
                  </p>
                  {!isPastEvent && userInfo?.roleOfTeam !== ETeamRole.OPERATIONS && (
                    <p className="w-[5%] bg-back3F" />
                  )}
                </div>
                {dataPromo?.data?.map((item, index) => (
                  <div
                    key={index}
                    className="ticket-item mb-[10px] items-start justify-between bg-[#FAFAFC] rounded-lg pl-2 py-2 flex flex-row  text-[white] gap-[22px]"
                  >
                    <section className="w-[100px] text-left">
                      <p
                        className=" text-[black] text-[14px] font-[400] truncate"
                        title={item?.name}
                      >
                        {item?.name}
                      </p>
                      <p className=" text-[#8F90A6] text-[12px] font-[400]">
                        {t('eventManagement.appliedTo')}
                      </p>
                      <p className="flex-1 text-[#FF005A] text-[12px] font-[400]">
                        {item?.applyTo}
                      </p>
                    </section>
                    <p className="w-[20%] text-[black] text-[14px] font-[400]">
                      {nFormatter(String(item?.discountAmount))}%
                    </p>
                    <p className="w-[20%] text-[black] text-[14px] font-[400]">
                      {nFormatter(String(item?.capacity))}
                    </p>
                    {!isPastEvent && userInfo?.roleOfTeam !== ETeamRole.OPERATIONS && (
                      <button
                        className="!h-[39px] w-[5%] md:w-[5%] flex justify-end pr-1 items-start"
                        onClick={() => handleEditPromoCode(item)}
                      >
                        <EditIcon />
                      </button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </>
      )}
      {data?.data?.length! > 0 ? (
        !isPastEvent &&
        userInfo?.roleOfTeam !== ETeamRole.OPERATIONS && (
          <div className="flex justify-center mt-auto">
            <ButtonContained
              className="w-[163px]"
              buttonType="type1"
              mode="medium"
              onClick={() => setIsAddPromoCode(true)}
            >
              {t('eventManagement.addPromoCode')}
            </ButtonContained>
          </div>
        )
      ) : (
        <div className="w-full flex items-center px-[24px] py-[20px]  flex-col ">
          <p className="text-black1 text-[14px] spacing uppercase tracking-[2px]">
            {t('eventManagement.youCanOnlyCreatePromo')}
          </p>
        </div>
      )}
      <ModalComponent
        open={isAddPromoCode}
        width={WIDTH_FORM_MODAL}
        destroyOnClose={true}
        centered
        onCancel={handleCloseCreatePromo}
      >
        {!breakpoint?.md && (
          <BackMobileIcon
            className="absolute top-7 left-5"
            onClick={() => handleCloseCreatePromo()}
          />
        )}
        <CreatePromo
          dataEdit={dataEditPromoCode}
          id={+id}
          onClose={handleCloseCreatePromo}
          options={data?.data}
        />
      </ModalComponent>
    </div>
  );
};

export default Promos;
