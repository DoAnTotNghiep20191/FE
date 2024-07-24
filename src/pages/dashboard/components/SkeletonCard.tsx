import { Skeleton } from 'antd';

const SkeletonCard = () => {
  return (
    <div className="flex flex-col md:flex-row gap-[24px] mb-[50px]">
      <Skeleton.Image className="rounded-[10px] !w-full md:!w-[277px] !h-[136px]" active />
      <div className="flex-1 gap-2 flex flex-col">
        <Skeleton.Button className="rounded-[10px] !w-[150px] !h-[25px]" active />
        <Skeleton.Button className="rounded-[10px] w-full !h-[25px]" active />
        <Skeleton.Button className="rounded-[10px] w-full !h-[25px]" active />
        <Skeleton.Button className="rounded-[10px] w-full !h-[25px]" active />
      </div>
    </div>
  );
};

export default SkeletonCard;
