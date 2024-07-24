const DividerLine = ({ className }: { className?: string }) => {
  return (
    <div className="flex w-full justify-center items-center">
      <div className={`w-[272px] h-[1px] bg-gray4/50 ${className}`} />
    </div>
  );
};

export default DividerLine;
