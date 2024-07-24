import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { EditIcon, WarningIcon } from 'src/assets/icons';
import ButtonContained from 'src/components/Buttons/ButtonContained';
import ModalComponent from 'src/components/Modals';
import { WIDTH_FORM_MODAL, WIDTH_FORM_MODAL_2 } from 'src/constants';
import { getCurrency } from 'src/helpers';
import { nFormatter } from 'src/helpers/formatNumber';
import { useGetListTicketOptionQuery } from 'src/store/slices/app/api';
import { EEventStatus, TicketOptionResponse } from 'src/store/slices/app/types';
import CreateTicket from './CreateTicket';

import { Grid } from 'antd';
import { useTranslation } from 'react-i18next';
import BackMobileIcon from 'src/assets/icons/common/arrow-left.svg?react';
import { useAppSelector } from 'src/store';
import { getUserInfo } from 'src/store/selectors/user';
import { ETeamRole } from 'src/store/slices/user/types';

const { useBreakpoint } = Grid;

interface RouteParams {
  id: string;
}

export default function Tickets({
  statusEvent,
  isPastEvent,
}: {
  statusEvent: EEventStatus;
  isPastEvent: boolean;
}) {
  const [isAddTicket, setIsAddTicket] = useState(false);
  const [dataEditTicket, setDataEditTicket] = useState<TicketOptionResponse | null>(null);
  const [isUnDelete, setIsUnDelete] = useState(false);

  const userInfo = useAppSelector(getUserInfo);

  const { id } = useParams<RouteParams>();
  const breakpoint = useBreakpoint();
  const { t } = useTranslation();

  const { data } = useGetListTicketOptionQuery(
    {
      id: +id,
      sortBy: 'createdAt',
      direction: 'DESC',
    },
    {
      skip: !id || !statusEvent,
      //  ||
      // statusEvent === EEventStatus.UPDATED ||
      // statusEvent === EEventStatus.REQUEST_UPDATE
    },
  );

  const handleEditTicket = (item: TicketOptionResponse) => {
    setIsAddTicket(true);
    setDataEditTicket(item);
  };

  const handleCloseCreateTicket = () => {
    setDataEditTicket(null);
    setIsAddTicket(false);
  };

  const handleUnDelete = () => {
    handleCloseCreateTicket();
    setIsUnDelete(true);
  };

  return (
    <>
      <div
        className="min-h-[calc(100vh-400px)] bg-gray2 rounded-[3px] py-[24px] px-[10px] md:px-[24px] mb-[74px] min-h-auto md:min-h-[727px] shadow-lg shadow-rgba(0, 0, 0, 0.25)
      border-l-[2px] border-red1 border-solid flex flex-col"
      >
        {Array(data?.data) && data?.data?.length! > 0 ? (
          <>
            <div className="flex flex-row items-center justify-start gap-[10px] md:gap-[24px] px-[8px]">
              <p className="text-[12px] font-[400] text-black1 md:flex-1 max-md:w-[70%]">
                {breakpoint.md
                  ? t('eventManagement.tickets')
                  : `${t('eventManagement.tickets')}/${t('eventManagement.price')}`}
              </p>
              {breakpoint.md && (
                <p className="text-[12px] font-[400] text-black1 max-md:w-[60%] md:w-[20%]">
                  {t('eventManagement.price')}
                </p>
              )}
              <p className="text-[12px] font-[400] text-black1 max-md:w-[20%] md:w-[20%]">
                {t('eventManagement.capacity')}
              </p>
              <p className="max-md:w-[10%] md:w-[10%] h-[18px]"></p>
            </div>
            {data?.data?.map((item) => (
              <div
                key={item?.id}
                className="ticket-item mb-[10px] py-[16px] bg-black1F rounded-[3px] px-[8px] shadow-lg shadow-rgba(0, 0, 0, 0.25)"
              >
                <div className="md:hidden flex-1">
                  <p
                    className="mb-[5px] font-[400] text-[16px] max-md:text-[14px] text-black1 truncate max-w-[250px]"
                    title={item?.name}
                  >
                    {item?.name}
                  </p>
                </div>
                <div className="flex items-start justify-between gap-[10px] md:gap-[24px]">
                  <div className="hidden md:block flex-1">
                    <p
                      className="mb-[5px] text-[16px] text-black1 break-all max-w-[200px] xl:max-w-[500px]"
                      title={item?.name}
                    >
                      {item?.name}
                    </p>
                    <p
                      className="text-black1 text-[12px] break-all"
                      dangerouslySetInnerHTML={{
                        // eslint-disable-next-line no-unsafe-optional-chaining
                        __html: (item?.description).replace(/\n/g, '<br>'),
                      }}
                    />
                  </div>
                  <div className="max-md:w-[70%] md:w-[20%]">
                    {/* <div className="h-[50px] md:w-[176px] flex items-center"> */}
                    <p className="text-[#8F90A6] md:text-black font-[400] text-[16px] max-md:text-[14px] truncate">
                      <span className="mr-2">{item?.currency}</span>{' '}
                      <span>{getCurrency(item?.currency)}</span>
                      {nFormatter(item?.price)}
                    </p>
                    {/* </div> */}
                  </div>
                  <div className="max-md:w-[20%] md:w-[20%]">
                    {/* <div className="h-[50px] md:w-fit items-center"> */}
                    <p className="font-[400] text-[16px] max-md:text-[14px] text-black truncate">
                      {nFormatter(String(item?.purchased))}/
                      {nFormatter(String(item?.maxCapacityAmount))}
                    </p>
                    {/* </div> */}
                  </div>
                  <div className="max-md:w-[10%] md:w-[10%]">
                    {/* <p className="mb-[3px] h-[14px]"></p> */}
                    {!isPastEvent && userInfo?.roleOfTeam !== ETeamRole.OPERATIONS && (
                      <button onClick={() => handleEditTicket(item)}>
                        <EditIcon />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="w-full flex items-center px-[24px] py-[20px]  flex-col ">
            <p className="text-black1 text-[14px] spacing uppercase tracking-[2px]">
              {t('eventManagement.thereAreNoTicketsCreated')}
            </p>
            <p className="text-black1 text-[14px] uppercase tracking-[2px]">
              {t('eventManagement.youCanHaveMultiple')}
            </p>
          </div>
        )}
        {!isPastEvent && userInfo?.roleOfTeam !== ETeamRole.OPERATIONS && (
          <div className="flex justify-center mt-auto">
            <ButtonContained
              className="w-[163px] mb-auto"
              buttonType="type1"
              onClick={() => setIsAddTicket(true)}
              mode="medium"
            >
              {t('eventManagement.addTicketOption')}
            </ButtonContained>
          </div>
        )}
      </div>

      <ModalComponent
        open={isAddTicket}
        width={WIDTH_FORM_MODAL}
        destroyOnClose={true}
        centered
        onCancel={handleCloseCreateTicket}
      >
        {!breakpoint?.md && (
          <BackMobileIcon
            className="absolute top-7 left-5"
            onClick={() => handleCloseCreateTicket()}
          />
        )}
        <CreateTicket
          dataEdit={dataEditTicket}
          id={+id}
          onClose={handleCloseCreateTicket}
          onUnDelete={handleUnDelete}
        />
      </ModalComponent>

      <ModalComponent
        open={isUnDelete}
        width={WIDTH_FORM_MODAL_2}
        destroyOnClose={true}
        centered
        onCancel={() => setIsUnDelete(false)}
      >
        <div className="flex flex-col items-center justify-center pt-[20px] px-[10px] h-[calc(100vh-140px)] md:h-auto">
          <p className="text-[24px] text-[#121313] font-extrabold text-center">
            {t('ticket.UnableToDeleteTicket')}
          </p>
          <p className="text-[16px] text-[#121313] font-normal text-center w-[90%] md:w-[402px]">
            {t('ticket.UnableToDeleteTicketDescription')}
          </p>
          <div className="py-[40px]">
            <WarningIcon />
          </div>
          <ButtonContained
            className="mt-auto md:mt-0 w-[272px] md:w-[375px]"
            buttonType="type2"
            onClick={() => setIsUnDelete(false)}
          >
            {t('ticket.buttonClose')}
          </ButtonContained>
        </div>
      </ModalComponent>
    </>
  );
}
