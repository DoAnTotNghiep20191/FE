import { Space, TableColumnsType } from 'antd';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import CustomTable from 'src/components/Table';
import './styles.scss';
import { useHistory } from 'react-router-dom';
import { debounce } from 'lodash';
import { formatDate } from 'src/helpers/formatValue';
import { DATE_FORMAT } from 'src/constants';
import { BackIcon, ExportIcon } from 'src/assets/icons';
import dayjs from 'dayjs';
import { useGetFanPurchasesHistoriesQuery } from 'src/store/slices/app/api';
import CustomSearch from 'src/components/Search';
import { ToastMessage } from 'src/components/Toast';
import { C1001, MSG } from 'src/constants/errorCode';
import { useAppSelector } from 'src/store';
import { getAccessToken, getUserInfo } from 'src/store/selectors/user';
import { getCurrency } from 'src/helpers';
// import { Grid } from 'antd/lib';
import { nFormatter } from 'src/helpers/formatNumber';
import { useTranslation } from 'react-i18next';
import { PATHS } from 'src/constants/paths';
import { useRudderStack } from 'src/rudderstack';
import { ERudderStackEvents } from 'src/rudderstack/types';
// const { useBreakpoint } = Grid;

// interface DataType {
//   key: React.Key;
//   eventName: string;
//   name: string;
//   ticketType: string;
//   purchaseDate: string;
//   price: number;
//   priceWithCurrency: number;
//   executeTime: string;
//   createdAt: string;
// }

interface MobileDataType {
  nameTicketType: {
    name: string;
    ticketType: string;
  };
  priceWithCurrency: string;
  createdAt: string;
}

const PurchaseHistory = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [valueDebounce, setValueDebounce] = useState('');
  const accessToken = useAppSelector(getAccessToken);
  const { rudderAnalytics } = useRudderStack();
  const userInfo = useAppSelector(getUserInfo);

  const { data: histories } = useGetFanPurchasesHistoriesQuery({
    search: valueDebounce.trim() || undefined,
    sortBy: 'createdAt',
    direction: 'DESC',
  });

  const data = useMemo(
    () =>
      (histories?.data || []).map((dt: any) => ({
        nameTicketType: {
          name: dt?.collection?.name,
          ticketType: dt?.ticketOption?.name,
        },
        priceWithCurrency: `${getCurrency(dt?.collection?.currency)} ${nFormatter(
          String(dt.price),
        )}`,
        ...dt,
      })),
    [histories],
  );

  const handleExportCSV = async () => {
    if (data.length === 0) return;
    try {
      let url = '';
      if (import.meta.env.VITE_BASE_URL![import.meta.env.VITE_BASE_URL!.length - 1] === '/') {
        url = `${import.meta.env.VITE_BASE_URL}user/fan/purchases/histories/export-excel`;
      } else {
        url = `${import.meta.env.VITE_BASE_URL}/user/fan/purchases/histories/export-excel`;
      }
      const headers = new Headers({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      });

      const options = {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ search: valueDebounce }),
      };

      const response = await fetch(url, options);
      const blob = await response.blob();
      const link = document.createElement('a');
      const fileURL = window.URL.createObjectURL(blob);
      const currentDate = formatDate(dayjs(), DATE_FORMAT);
      link.href = fileURL;
      link.download = `Purchaser_history_${currentDate}.xlsx`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      rudderAnalytics?.track(ERudderStackEvents.FanPurchaseHistoryExported, {
        eventType: ERudderStackEvents.FanPurchaseHistoryExported,
        data: {
          ...(valueDebounce && { searchString: valueDebounce }),
          userId: userInfo?.id,
        },
      });
    } catch (error: any) {
      console.error(error);
      ToastMessage.error(MSG[error?.data?.validator_errors || C1001]);
    }
  };

  const mobileColumns: TableColumnsType<MobileDataType> = [
    {
      title: t('purchaseHistory.eventDetails'),
      render: (_, record) => {
        return (
          <div className="my-1 flex flex-col">
            <span className="text-sm block max-w-[140px] md:max-w-none truncate mr-1">
              {record.nameTicketType.name}
            </span>
            <span className="text-xs text-gray7">{record.nameTicketType.ticketType}</span>
            <span className="text-xs text-gray7">{record.priceWithCurrency}</span>
          </div>
        );
      },
      width: 250,
    },
    {
      title: <p className="text-nowrap">{t('purchaseHistory.purchaseDate')}</p>,
      render: (_, record) => {
        return <span className="text-sm">{formatDate(record?.createdAt, DATE_FORMAT)}</span>;
      },
      width: 150,
    },
  ];

  const handleSearch = async (value: string) => {
    setValueDebounce(value);
  };

  const debounceHandler = useCallback(debounce(handleSearch, 500), []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debounceHandler(value);
  };

  return (
    <div className="purchase-history">
      <div className="flex justify-between items-center mb-[20px] md:mb-[32px]">
        <Space size={32}>
          <BackIcon
            className="arrow-left cursor-pointer"
            onClick={() => history.push(PATHS.myEvents)}
          />
          <p className="text-[20px] font-loos font-normal">{t('purchaseHistory.header')}</p>
        </Space>
        <p
          className={`flex items-center gap-[4px] ${
            data.length === 0 ? 'cursor-not-allowed' : 'cursor-pointer'
          }`}
          onClick={handleExportCSV}
        >
          <span className="whitespace-nowrap text-[12px] text-primary">
            {t('purchaseHistory.exportToCSV')}
          </span>
          <ExportIcon />{' '}
        </p>
      </div>
      <div className="p-3 md:p-6">
        <div className="flex justify-center">
          <CustomSearch
            type="type2"
            onChange={handleSearchChange}
            value={search}
            placeholder={t('purchaseHistory.searchByEventName')}
            className="w-full md:w-[310px]"
          />
        </div>
        <CustomTable
          columns={mobileColumns}
          data={data}
          activeHeader={false}
          className="mt-8"
          emptyText={!search ? t('common.noData') : t('common.noResults')}
        />
      </div>
    </div>
  );
};

export default PurchaseHistory;
