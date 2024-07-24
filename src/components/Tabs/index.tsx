import { ConfigProvider, Tabs } from 'antd';

export default function AppTabs({ items, onChange, activeKey }: any) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            colorText: '#8F90A6',
            itemSelectedColor: '#FF005A',
            cardBg: '#FAFAFC',
            inkBarColor: '#FF005A',
            itemActiveColor: '#FF005A',
            itemHoverColor: '#FF005A',
            colorBgContainer: 'rgb(0, 0, 0)',
            colorPrimaryBorder: 'rgb(0, 0, 0)',
            colorBorder: '#FAFAFC',
            colorBorderSecondary: '#FAFAFC',
            titleFontSize: 12,
            fontWeightStrong: 400,
          },
        },
      }}
    >
      <Tabs activeKey={activeKey} items={items} centered onChange={onChange} />
    </ConfigProvider>
  );
}
