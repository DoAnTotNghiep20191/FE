import { CollapseProps } from 'antd';
import { Flex } from 'antd/lib';
import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomCollapse from 'src/components/Collapse';
import CustomSearch from 'src/components/Search';

const QuickGuide = () => {
  const [search, setSearch] = useState('');
  const [, setValueDebounce] = useState('');
  const { t } = useTranslation();

  const handleSearch = async (value: string) => {
    setValueDebounce(value);
  };

  const debounceHandler = useCallback(debounce(handleSearch, 500), []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debounceHandler(e.target.value);
  };

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: t('quickStart.analyseEvents'),
      children: <p></p>,
    },
    {
      key: '2',
      label: t('quickStart.setUpYourAccount'),
      children: <p></p>,
    },
    {
      key: '3',
      label: t('quickStart.createEvents'),
      children: <p></p>,
    },
    {
      key: '4',
      label: t('quickStart.createTickets'),
      children: <p></p>,
    },
    {
      key: '5',
      label: t('quickStart.addPromoCodes'),
      children: <p></p>,
    },
  ];

  return (
    <div className="mt-12 w-full md:w-[310px] m-auto max-md:p-[20px]">
      <p className="text-2xl text-center font-loos">{t('quickStart.quickStartGuide')}</p>
      <Flex justify="center" className="w-full">
        <CustomSearch
          type="type2"
          onChange={handleSearchChange}
          value={search}
          placeholder={t('quickStart.searchForKeyWords')}
          className="w-[275px] mb-12 mt-8 md:w-full h-[40px] md:h-[59px]"
        />
      </Flex>
      <div className="w-full">
        <CustomCollapse items={items} />
      </div>
    </div>
  );
};

export default QuickGuide;
