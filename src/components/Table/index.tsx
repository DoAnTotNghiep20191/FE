import { Table } from 'antd';
import CustomSearch from '../Search';
import { ExportIcon } from 'src/assets/icons';
import './styles.scss';

import EmptyData from 'src/assets/icons/common/empty_data.svg?react';
import { useTranslation } from 'react-i18next';

interface CustomTableProps {
  columns: any;
  data: any;
  searchVal?: string;
  placeholder?: string;
  handleChangeSearch?: (val: any) => void;
  activeHeader?: boolean;
  className?: string;
  emptyText?: string;
}

const CustomTable = (props: CustomTableProps) => {
  const {
    columns,
    data,
    searchVal,
    placeholder,
    handleChangeSearch,
    activeHeader = true,
    className,
    emptyText = '',
  } = props;
  const { t } = useTranslation();
  return (
    <div className={`custom-table ${className}`}>
      {activeHeader && (
        <div className="custom-table-action">
          <CustomSearch onChange={handleChangeSearch} value={searchVal} placeholder={placeholder} />
          <p>
            <ExportIcon /> <p>{t('eventManagement.exportToCSV')}</p>
          </p>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        locale={{
          emptyText: emptyText || (
            <div className="flex flex-col gap-2 items-center justify-center py-5">
              <EmptyData />
              <p>{t('common.noResults')}</p>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default CustomTable;
