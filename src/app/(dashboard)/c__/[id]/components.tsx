'use client';

export const Skeleton = () => {
  return (
    <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-40 gap-10 animate-pulse">
      <div className="w-full flex gap-8 items-start animate-pulse">
        <div className="w-full h-[300px] bg-light-300 rounded-md"></div>
      </div>

      <div className="w-full flex gap-8 items-start animate-pulse">
        <div className="w-full h-[300px] bg-light-300 rounded-md"></div>
      </div>
    </div>
  );
};
