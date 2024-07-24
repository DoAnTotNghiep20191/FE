import { Skeleton } from 'antd';

const SkeletonDetail = () => {
  return (
    <div className="w-[100%] md:w-[677px] px-[20px] md:px-[100px] py-[50px] bg-black5B/20 flex flex-col gap-[20px]">
      <Skeleton.Image className="rounded-[10px] !w-[100%] !h-[232px]" active />
      <Skeleton.Button className="rounded-[10px]  !w-[100%] !h-[25px]" active />
      <Skeleton.Button className="rounded-[10px] !w-[100%] !h-[25px]" active />
      <Skeleton.Button className="rounded-[10px] !w-[100%] !h-[25px]" active />
      <Skeleton.Button className="rounded-[10px] !w-[100%] !h-[25px]" active />
      <Skeleton.Button className="rounded-[10px] !w-[100%] !h-[25px]" active />
      <Skeleton.Button className="rounded-[10px] !w-[100%] !h-[25px]" active />
      <Skeleton.Button className="rounded-[10px] !w-[100%] !h-[25px]" active />
      <Skeleton.Button className="rounded-[10px] !w-[100%] !h-[25px]" active />
      <Skeleton.Button className="rounded-[10px] !w-[100%] !h-[25px]" active />
    </div>
  );
};

export default SkeletonDetail;
