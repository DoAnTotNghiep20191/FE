import { ITicketType } from '../../types';
import { getCurrency } from 'src/helpers';
import { formatCurrency } from 'src/helpers/formatNumber';

interface TicketTypeProps extends ITicketType {
  onSelectTicketType: () => void;
  checked?: boolean;
  soldOut?: boolean;
}

const TicketType = (props: TicketTypeProps) => {
  const { name, description, price, currency, onSelectTicketType, checked, soldOut } = props;

  return (
    <div onClick={soldOut ? () => {} : onSelectTicketType}>
      <p className={`text-[12px] ${soldOut ? 'text-error' : 'text-primary'}`}>{name}</p>
      <div
        className={`flex items-center justify-between mt-[4px] mb-[8px] px-[15px] h-[52px] rounded-[10px]
          border ${
            soldOut
              ? 'bg-white border-error'
              : checked
                ? 'bg-blueLighter border-blueDarker'
                : 'bg-white border-primary'
          } border-solid
        `}
      >
        <span
          className={`text-[16px] ${
            soldOut ? 'text-error' : checked ? 'text-blueDarker' : 'text-primary'
          } `}
        >
          {getCurrency(currency)}
          {formatCurrency(price)}
        </span>
        {soldOut ? <span className="text-error">Sold out</span> : null}
      </div>
      <p className="text-[12px] font-normal whitespace-pre-wrap">{description}</p>
    </div>
  );
};

export default TicketType;
