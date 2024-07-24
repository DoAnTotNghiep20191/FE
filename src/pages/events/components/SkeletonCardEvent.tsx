import { Skeleton } from 'antd';

const SkeletonCardEvent = () => {
  return (
    <div className="flex flex-col gap-2 mb-[30px]">
      <Skeleton.Image className="rounded-[10px] !w-[100%] !h-[183px]" active />
      <div className="flex gap-2 ">
        <Skeleton.Button className="rounded-[10px] !h-[50px]" active />
        <div className="flex-1 gap-2 flex flex-col">
          <Skeleton.Button className="rounded-[10px]  !w-[100%] !h-[20px]" active />
          <Skeleton.Button className="rounded-[10px]  !w-[100%] !h-[20px]" active />
        </div>
      </div>

      <div className="flex gap-3">
        <Skeleton.Button className="rounded-[10px]  !w-[100%] !h-[15px]" active />
        <Skeleton.Button className="rounded-[10px]  !w-[100%] !h-[15px]" active />
      </div>
      <div className="flex gap-3">
        <Skeleton.Button className="rounded-[10px]  !w-[100%] !h-[15px]" active />
        <Skeleton.Button className="rounded-[10px]  !w-[100%] !h-[15px]" active />
      </div>
    </div>
  );
};
export default SkeletonCardEvent;
