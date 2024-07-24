import { Input } from 'antd';
import { SearchIcon } from 'src/assets/icons';
import './styles.scss';

interface CustomSearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  className?: string;
  type?: 'type1' | 'type2';
}

const CustomSearch = (props: CustomSearchProps) => {
  const { className, type, ...rest } = props;
  if (type === 'type2') {
    return (
      <div className={`custom-search-type2 w-[275px] h-[39px] ${className}`}>
        <SearchIcon />
        <Input className="input-globe" {...rest} />
      </div>
    );
  }
  return (
    <div className={`custom-search w-[275px] h-[39px] ${className}`}>
      <Input className="input-globe" {...rest} />
      <SearchIcon />
    </div>
  );
};

export default CustomSearch;
