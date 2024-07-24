import { useTranslation } from 'react-i18next';
import { getCurrency } from 'src/helpers';
import { formatCurrency } from 'src/helpers/formatNumber';
import { ITicketType } from '../../types';
import './styles.scss';

const TicketPurchase = (props: ITicketType) => {
  const { name, price, currency } = props;
  const { t } = useTranslation();

  return (
    <div className="text-primary flex gap-[10px] items-end">
      <div className="flex-1">
        <p className="text-[12px] font-medium word-break-all">{name}</p>
        <p className="text-[16px] text-primary p-[15px] rounded-[10px] mt-[4px] border border-solid border-primary">
          {getCurrency(currency)}
          {formatCurrency(price)}
        </p>
      </div>
      <div className="min-w-[40px]">
        <p className="text-[12px] font-medium">{t('purchaseTicket.quantity')}</p>
        <p className="text-[16px] text-primary p-[15px] rounded-[10px] mt-[4px] border border-solid border-primary">
          1
        </p>
      </div>
    </div>
  );
};

export default TicketPurchase;
