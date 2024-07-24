interface Props {
  number: number;
  label: string;
}

const StatisticsItem = ({ number, label }: Props) => {
  return (
    <div className="border-[1px] border-primary border-solid w-[80px] px-[10px] py-[6px] text-[10px] flex flex-col items-center rounded-[20px]">
      <span className="text-primary">{number}</span>
      <span className="text-center text-primary">{label}</span>
    </div>
  );
};

export default StatisticsItem;
