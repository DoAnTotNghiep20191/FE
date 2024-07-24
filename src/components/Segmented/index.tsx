import { ConfigProvider, Segmented } from 'antd';

export default function AppSegmented({ items, ...rest }: any) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Segmented: {
            itemSelectedBg: '#008AD8',
            colorText: '#fff',
            itemColor: '#008AD8',
            itemHoverBg: '#fff',
            trackBg: '#fff',
            controlHeight: 37,
            borderRadiusSM: 10,
            fontSize: 12,
            itemHoverColor: '#008AD8',
          },
        },
      }}
    >
      <section className="w-full flex justify-center ">
        <Segmented
          options={items}
          {...rest}
          className="w-[176px] md:w-full border-solid border-[#008AD8] border rounded-[10px]"
        />
      </section>
    </ConfigProvider>
  );
}
