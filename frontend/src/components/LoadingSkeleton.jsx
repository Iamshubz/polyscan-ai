import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] animate-pulse space-y-4">
    <div className="h-4 bg-[#EAF6E9] rounded-md w-1/3" />
    <div className="h-8 bg-[#F5F7F3] rounded-lg w-2/3" />
    <div className="h-20 bg-[#F5F7F3] rounded-xl w-full" />
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] animate-pulse space-y-4">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="flex items-center justify-between py-3 border-b border-[#F5F7F3]">
        <div className="w-12 h-12 bg-[#EAF6E9] rounded-xl" />
        <div className="flex-1 px-4 space-y-2">
          <div className="h-4 bg-[#F5F7F3] rounded-md w-1/2" />
          <div className="h-3 bg-[#F5F7F3] rounded-md w-1/4" />
        </div>
        <div className="h-8 w-20 bg-[#EAF6E9] rounded-lg" />
      </div>
    ))}
  </div>
);

export default CardSkeleton;
