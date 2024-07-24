import { useState } from 'react';
import { SearchIcon } from 'src/assets/icons';
import './styles.scss';
import { InputProps } from 'antd';

interface Props extends InputProps {
  value: string;
  onClear: () => void;
}

const MobileSearchBtn = ({ placeholder, onChange, onClear, value }: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mobile-search-btn">
      <div
        className={`mobile-search-btn__container mobile-search-btn__container--${open ? 'open' : 'close'}`}
      >
        <input
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          style={{
            width: open ? '100%' : '0px',
            transition: 'all 0.3s',
            visibility: open ? 'visible' : 'hidden',
          }}
        />
        <div
          onClick={() => {
            setOpen(!open);
            onClear();
          }}
        >
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};

export default MobileSearchBtn;
