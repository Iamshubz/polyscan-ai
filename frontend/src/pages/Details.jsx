import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { polymerService } from '../services/api';
import CardSkeleton from '../components/LoadingSkeleton';
import { Recycle, Factory, Trash2, CheckCircle2, Lightbulb, ArrowLeft, Shield } from 'lucide-react';

const Details = () => {
  const { polymer } = useParams();
  const [polymerData, setPolymerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolymerDetails();
  }, [polymer]);

  const fetchPolymerDetails = async () => {
    try {
      setLoading(true);
      const res = await polymerService.getPolymer(polymer);
      if (res.success) {
        setPolymerData(res.polymer);
      }
    } catch (err) {
      console.error('[Fetch Polymer Details Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <TopNav title="Polymer Details" subtitle="Material knowledge base" />
        <div className="px-6 lg:px-8 mt-6 max-w-4xl mx-auto">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!polymerData) return null;

  const score = polymerData.sustainabilityScore || 8.2;
  const scorePercent = (score / 10) * 100;

  return (
    <div>
      <TopNav title="Polymer Details" subtitle="Material knowledge base & environmental specifications" />

      <div className="px-6 lg:px-8 mt-6 space-y-6">
        {/* Back link */}
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#16803A] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Materials</span>
        </Link>

        {/* Top Header Grid (Matching Panel 4 Reference Image) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Polymer Identity Card (Left - 2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[#DCE5DD] shadow-xs flex flex-col justify-between">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center shrink-0">
                <Recycle className="w-12 h-12 stroke-[1.8]" />
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-extrabold text-[#17231C] tracking-tight">
                    {polymerData.code}
                  </h1>
                  <span className="px-3 py-1 bg-[#EAF6E9] text-[#16803A] text-xs font-bold rounded-full">
                    Resin Code #{polymerData.resinCode || 1}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#14532D] mt-1">
                  {polymerData.name}
                </h2>
                <p className="text-sm text-[#66736B] leading-relaxed mt-3">
                  {polymerData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Sustainability Score Gauge Card (Right Column - Matching Panel 4 Reference Image) */}
          <div className="bg-white rounded-3xl p-8 border border-[#DCE5DD] shadow-xs flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-sm text-[#17231C] uppercase tracking-wider mb-4">
              Sustainability Score
            </h3>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#EAF6E9"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="#16803A"
                  strokeWidth="10"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * scorePercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-[#17231C]">{score}</span>
                <span className="text-xs font-medium text-[#66736B]">/10</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#EAF6E9] text-[#16803A]">
                Good Rating
              </span>
              <p className="text-xs text-[#66736B] leading-relaxed max-w-xs mt-1">
                High recyclability and lower environmental impact compared to other plastics.
              </p>
            </div>
          </div>
        </div>

        {/* Three Information Cards (Matching Panel 4 Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Manufacturing Process */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <Factory className="w-5 h-5 text-[#16803A]" />
              <h3 className="font-bold text-base text-[#17231C]">Manufacturing Process</h3>
            </div>
            <ul className="space-y-2.5">
              {polymerData.manufacturingProcesses?.map((proc, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-xs font-medium text-[#17231C]">
                  <span className="w-2 h-2 rounded-full bg-[#16803A]" />
                  <span>{proc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Recyclability */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-[#17231C]">Recyclability</h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EAF6E9] text-[#16803A]">
                  {polymerData.recyclability?.level || 'High'}
                </span>
              </div>
              <p className="text-xs text-[#66736B] leading-relaxed">
                {polymerData.recyclability?.description}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Recycle className="w-8 h-8 text-[#16803A]/30" />
            </div>
          </div>

          {/* Card 3: Disposal Recommendation */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex flex-col justify-between" id="disposal">
            <div>
              <h3 className="font-bold text-base text-[#17231C] mb-3">Disposal Recommendation</h3>
              <p className="text-xs text-[#66736B] leading-relaxed">
                {polymerData.disposalRecommendation}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Trash2 className="w-8 h-8 text-[#16803A]/30" />
            </div>
          </div>
        </div>

        {/* Reuse Ideas Section (Matching Panel 4 Reference Image) */}
        <section className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs" id="reuse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#16803A]" />
              <h3 className="font-bold text-base text-[#17231C]">Reuse Ideas</h3>
            </div>
            <span className="text-xs text-[#66736B]">Creative Upcycling</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {polymerData.reuseIdeas?.map((idea, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-[#EAF6E9] text-[#14532D] font-semibold text-xs rounded-xl border border-[#7BA77B]/30 flex items-center gap-2 hover:bg-[#16803A] hover:text-white transition-all cursor-default"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{idea}</span>
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Details;
