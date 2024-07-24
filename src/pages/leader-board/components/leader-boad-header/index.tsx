import { useMemo, useRef, useState } from 'react';
import { DropDownIcon } from 'src/assets/icons';
import useDidClickOutside from 'src/hooks/useDidClickOutside';
import { CampaignItemRes } from 'src/store/slices/campaign/types';
import './styles.scss';

interface ILeaderBoardHeader {
  listCampaign: CampaignItemRes[] | undefined;
  setCampaignId: any;
  refresh: any;
  campaignNameSelect: string;
}
const LeaderBoardHeader: React.FC<ILeaderBoardHeader> = (props) => {
  const { listCampaign, setCampaignId, refresh, campaignNameSelect } = props;
  const [showDropCampaign, setShowDropCampaign] = useState(false);
  const dropdownRef = useRef(null);
  const optionCampaignList = useMemo(
    () =>
      listCampaign?.map((item: any) => ({
        label: item.name,
        value: item.id,
      })),
    [listCampaign],
  );

  const selectCampaign = (id: number) => {
    setCampaignId(id);
    setShowDropCampaign(false);
    refresh();
  };

  useDidClickOutside(dropdownRef, () => setShowDropCampaign(false));
  return (
    <div className="leader-board-header">
      <p className="title">Leader board</p>

      <div
        className="dropdown-campaigns"
        ref={dropdownRef}
        onClick={() => setShowDropCampaign(!showDropCampaign)}
      >
        <p>{campaignNameSelect}</p>

        <DropDownIcon
          style={{
            cursor: 'pointer',
            transform: showDropCampaign ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
          className="drop-down-campaign"
        />

        {showDropCampaign && (
          <div className="dropdown-list">
            {optionCampaignList?.map((item: any) => (
              <div
                className="dropdown-list__item text-center break-all"
                key={item.value}
                onClick={() => selectCampaign(item.value)}
              >
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderBoardHeader;
