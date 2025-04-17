'use client';

export const Skeleton = () => {
  return (
    <div className="h-screen w-screen relative px-6 py-6 rounded-lg flex flex-col md:flex-row bg-transparent gap-1 animate-pulse">
      <div className="w-full flex gap-8 h-full items-start animate-pulse pt-[60px]">
        <div className="w-full h-full bg-light-300 rounded-md"></div>
      </div>
    </div>
  );
};
