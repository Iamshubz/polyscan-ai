import React from 'react';
import { Info } from 'lucide-react';

const DisclaimerBanner = () => {
  return (
    <div className="p-3.5 bg-[#EAF6E9] border border-[#7BA77B]/40 rounded-2xl flex items-start gap-3 my-4">
      <Info className="w-5 h-5 text-[#16803A] shrink-0 mt-0.5" />
      <p className="text-xs text-[#14532D] leading-relaxed">
        <span className="font-bold">Scientific Positioning Disclaimer:</span> Polymer identification is an AI-based visual estimate. Similar plastics can look alike visually, so results should not be treated as laboratory chemical analysis.
      </p>
    </div>
  );
};

export default DisclaimerBanner;
