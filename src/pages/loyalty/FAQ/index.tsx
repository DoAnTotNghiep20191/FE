import { CollapseProps } from 'antd';
import { Flex } from 'antd/lib';
import { debounce } from 'lodash';
import { ChangeEvent, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomCollapse from 'src/components/Collapse';
import CustomSearch from 'src/components/Search';

const FAQ = () => {
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
      label: t('faq.doesItCostAnything'),
      children: <p></p>,
    },
    {
      key: '2',
      label: t('faq.doINeedACrypto'),
      children: <p></p>,
    },
    {
      key: '3',
      label: t('faq.canIGetARefund'),
      children: <p></p>,
    },
    {
      key: '4',
      label: t('faq.doesMyTicket'),
      children: <p></p>,
    },
  ];

  return (
    <div className="text-black mt-12 w-full md:w-[675px] m-auto">
      <p className="text-2xl text-center font-bold">{t('faq.frequentlyAsked')}</p>
      <Flex justify="center" className="w-full">
        <CustomSearch
          onChange={handleSearchChange}
          value={search}
          placeholder={t('faq.searchForAQuestion')}
          className="flex flex-row-reverse !border-0 !rounded-none !border-b-2 !border-[#8F90A6] w-[275px] mb-12 mt-8 md:w-full h-[40px] md:h-[59px] max-w-[312px]"
        />
      </Flex>
      <CustomCollapse items={items} />
    </div>
  );
};

export default FAQ;
