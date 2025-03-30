'use client';

export const Skeleton = () => {
  return (
    <div className="h-full w-full relative px-6 py-6 rounded-lg flex flex-col bg-primary-40 gap-10 animate-pulse">
      <div className="flex w-full justify-between items-center animate-pulse">
        <div className="h-6 w-36 bg-light-300 rounded-md"></div>
        <div className="h-6 w-6 bg-light-300 rounded-full"></div>
      </div>

      <div className="w-full flex gap-8 items-start animate-pulse">
        <div className="w-[180px] h-[180px] bg-light-300 rounded-md"></div>

        <div className="flex flex-col gap-3 w-full">
          <div className="h-5 w-48 bg-light-300 rounded-md"></div>

          <div className="h-4 w-full bg-light-300 rounded-md"></div>

          <div className="h-4 w-3/4 bg-light-300 rounded-md"></div>

          <div className="h-5 w-24 bg-light-300 rounded-md"></div>

          <div className="h-4 w-32 bg-light-300 rounded-md"></div>

          <div className="h-4 w-36 bg-light-300 rounded-md"></div>
        </div>
      </div>

      <div className="w-full flex gap-8 items-start animate-pulse">
        <div className="w-full h-[300px] bg-light-300 rounded-md"></div>
      </div>
    </div>
  );
};
