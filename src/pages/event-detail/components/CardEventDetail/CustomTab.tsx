import './styles.scss';
interface ButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  width?: string;
}

const TabButton = ({ children, isActive, onClick, width }: ButtonProps) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: width ? width : '50%',
      }}
      className={`bg-white z-1 flex items-center justify-center uppercase cursor-pointer ${isActive ? 'active-tab text-primary' : ''}`}
    >
      {children}
    </div>
  );
};

interface Props {
  activeKey: number;
  onChange: (key: number) => void;
  showCampaign: boolean;
}

const CustomTab = ({ activeKey, onChange, showCampaign }: Props) => {
  return (
    <div className="flex w-[100%] h-[50px] text-[14px] mt-[10px] gap-[5px]">
      <TabButton
        width={!showCampaign ? '100%' : '50%'}
        onClick={() => {
          onChange(1);
        }}
        isActive={activeKey === 1}
      >
        Details
      </TabButton>
      {showCampaign && (
        <TabButton
          onClick={() => {
            onChange(2);
          }}
          isActive={activeKey === 2}
        >
          Campaign
        </TabButton>
      )}
    </div>
  );
};

export default CustomTab;
