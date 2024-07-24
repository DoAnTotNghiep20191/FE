import ButtonContained from 'src/components/Buttons/ButtonContained';
import TicketType from './TicketType';
import { Spin } from 'antd';
import { useState } from 'react';
import { ToastMessage } from 'src/components/Toast';
import { useGetListTicketOptionQuery } from 'src/store/slices/app/api';
import { ITicketType } from '../../types';
import { useTranslation } from 'react-i18next';
import { MSG, S40012 } from 'src/constants/errorCode';

interface SelectTicketTypeProps {
  onAddToPurchase: (selectedTicketType: ITicketType) => void;
  id: number;
}

const SelectTicketType = (props: SelectTicketTypeProps) => {
  const { onAddToPurchase, id } = props;
  const [selectedType, setSelectedType] = useState<ITicketType | null>(null);
  const { t } = useTranslation();

  const { data: options, isLoading } = useGetListTicketOptionQuery(
    { id: +id, sortBy: 'price', direction: 'ASC' },
    { skip: !id },
  );

  const handleSelectTicketType = (type: ITicketType) => {
    setSelectedType(type);
  };

  const onClickAdd = () => {
    if (!selectedType) {
      ToastMessage.error(t(MSG[S40012]));
    } else {
      onAddToPurchase(selectedType);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-[20px]">
      <div>
        <p className="text-[24px] font-loos text-center">{t('purchaseTicket.selectTicketType')}</p>
        <p className="text-[14px] font-normal md:w-[444px]  w-[346px] text-center">
          {t('purchaseTicket.selectATicketYouWishToPurchase')}
        </p>
      </div>
      <div className="py-[40px] w-[260px] gap-[30px] flex flex-col">
        {isLoading ? (
          <Spin />
        ) : (
          options &&
          options?.data.length > 0 &&
          options?.data.map((type: any) => {
            const soldOut = +type?.purchased >= +type.maxCapacityAmount;
            return (
              <TicketType
                key={type.id}
                {...type}
                soldOut={soldOut}
                checked={selectedType?.id === type.id}
                onSelectTicketType={() => handleSelectTicketType(type)}
              />
            );
          })
        )}
      </div>
      <ButtonContained className="w-[212px] md:mb-[40px]" buttonType="type1" onClick={onClickAdd}>
        {t('purchaseTicket.buttonAddToPurchase')}
      </ButtonContained>
    </div>
  );
};

export default SelectTicketType;
