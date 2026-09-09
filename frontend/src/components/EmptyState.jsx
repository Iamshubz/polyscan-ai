import React from 'react';
import { PackageOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No Data Found',
  description = 'There are no records available at the moment.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-[#DCE5DD] text-center max-w-md mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-[#17231C] mb-1">{title}</h3>
      <p className="text-sm text-[#66736B] font-normal max-w-xs mb-6">{description}</p>
      
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16803A] text-white font-semibold text-sm rounded-xl hover:bg-[#14532D] transition-all shadow-xs"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16803A] text-white font-semibold text-sm rounded-xl hover:bg-[#14532D] transition-all shadow-xs"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;
