import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import TopNav from '../components/TopNav';
import DisclaimerBanner from '../components/DisclaimerModal';
import { CardSkeleton } from '../components/LoadingSkeleton';
import { scanService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  CheckCircle2,
  Plus,
  Recycle,
  Package,
  Leaf,
  Eye,
  Lightbulb,
  Trash2,
  Share2,
  ArrowRight,
  ShieldCheck,
AlertCircle,
Factory
} from 'lucide-react';

const Result = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [scan, setScan] = useState(null);
  const [polymerInfo, setPolymerInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [scanId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await scanService.getScanById(scanId);
      if (res.success) {
        setScan(res.scan);
        setPolymerInfo(res.polymerInfo);
      } else {
        showToast('Scan result not found.', 'error');
        navigate('/history');
      }
    } catch (err) {
      console.error('[Fetch Result Error]:', err);
      showToast('Error loading scan result.', 'error');
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `PolyScan AI - ${scan?.polymer} Result`,
          text: `Check out this plastic polymer analysis: ${scan?.polymer} (${scan?.objectType})`,
          url: url,
        });
        showToast('Result shared successfully!', 'success');
      } catch (err) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(url);
      showToast('Result link copied to clipboard.', 'success');
    }
  };

  if (loading) {
    return (
      <div>
        <TopNav title="Analysis Result" subtitle="AI analysis complete" />
        <div className="px-6 lg:px-8 mt-6 max-w-4xl mx-auto">
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (!scan) return null;

  return (
    <div>
      <TopNav title="Analysis Result" subtitle="AI analysis complete" />

      <div className="px-6 lg:px-8 mt-6 space-y-6">
        {/* Top Bar with New Scan Button */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#66736B]">Scan ID: {scan._id}</span>
          </div>
          <Link
            to="/scan"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16803A] text-white font-semibold text-sm rounded-xl hover:bg-[#14532D] transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Scan</span>
          </Link>
        </div>

        {/* Main Card (Matching Panel 3 Reference Image) */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 border border-[#DCE5DD] shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column: Image */}
          <div className="w-full h-64 md:h-80 rounded-2xl bg-[#F5F7F3] border border-[#DCE5DD] overflow-hidden flex items-center justify-center p-4">
            <img
              src={scan.imageUrl}
              alt={scan.objectType}
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          {/* Right Column: Detected Object & Polymer Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#66736B] uppercase tracking-wider">
                  Detected Object
                </span>
                <CheckCircle2 className="w-5 h-5 text-[#16803A]" />
              </div>
              <h2 className="text-2xl font-bold text-[#17231C] mt-1">{scan.objectType}</h2>
            </div>

            <div>
              <span className="text-xs font-medium text-[#66736B] uppercase tracking-wider">
                Estimated Polymer
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-[#16803A] tracking-tight">
                  {scan.polymer}
                </span>
                <span className="text-sm font-semibold text-[#17231C]">
                  {scan.polymerFullName}
                </span>
              </div>
            </div>
{/* Manufacturing Process */}
<div>
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs font-medium text-[#66736B] uppercase tracking-wider">
      Manufacturing Process
    </span>
    <Factory className="w-5 h-5 text-[#16803A]" />
  </div>

  <div className="flex items-center gap-3">
    <div className="flex-1">
      <div className="text-xl font-extrabold text-[#16803A]">
        {scan.manufacturingProcess &&
        scan.manufacturingProcess !== 'UNKNOWN'
          ? scan.manufacturingProcess
          : 'Not Determined'}
      </div>

      {scan.manufacturingProcess &&
        scan.manufacturingProcess !== 'UNKNOWN' && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs font-semibold text-[#66736B]">
              AI Confidence
            </span>

            <span className="text-xs font-bold text-[#16803A]">
              {scan.manufacturingConfidence || 0}%
            </span>
          </div>
        )}
    </div>
  </div>

  {scan.manufacturingProcess &&
    scan.manufacturingProcess !== 'UNKNOWN' && (
      <div className="mt-2 w-full h-2 bg-[#EAF6E9] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#16803A] rounded-full transition-all duration-1000"
          style={{
            width: `${scan.manufacturingConfidence || 0}%`,
          }}
        />
      </div>
    )}

  {scan.manufacturingReasoning && (
    <div className="mt-3 p-3 bg-[#F5F7F3] rounded-xl border border-[#DCE5DD]/70 text-xs text-[#66736B] leading-relaxed">
      <span className="font-bold text-[#17231C] block mb-0.5">
        Why this process?
      </span>

      {scan.manufacturingReasoning}
    </div>
  )}
</div>
            {/* AI Confidence Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#17231C]">AI Confidence</span>
                <span className="font-bold text-[#16803A]">{scan.confidence}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#EAF6E9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#16803A] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${scan.confidence}%` }}
                />
              </div>
              {scan.confidence < 60 && (
                <p className="text-xs text-[#D38B2F] font-medium flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Low-confidence visual estimate. Consider uploading a clearer image.
                </p>
              )}
            </div>

            {/* Visual Reasoning text */}
            {scan.visualReasoning && (
              <div className="p-3.5 bg-[#F5F7F3] rounded-xl border border-[#DCE5DD]/70 text-xs text-[#66736B] leading-relaxed">
                <span className="font-bold text-[#17231C] block mb-0.5">Visual Reasoning:</span>
                {scan.visualReasoning}
              </div>
            )}
          </div>
        </div>

        {scan.objects?.length > 1 && (
          <section className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#17231C]">Objects detected in this image</h3>
              <p className="text-sm text-[#66736B]">Each visible plastic object has been analyzed separately.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scan.objects.map((object, index) => (
                <article key={`${object.objectType}-${index}`} className="bg-white rounded-2xl p-5 border border-[#DCE5DD] shadow-xs">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-[#66736B]">Object {index + 1}</span>
                      <h4 className="text-lg font-bold text-[#17231C]">{object.objectType}</h4>
                    </div>
                    <span className="text-xl font-extrabold text-[#16803A]">{object.polymer}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-[#F5F7F3] p-3">
                      <span className="block text-xs text-[#66736B]">Polymer confidence</span>
                      <span className="font-bold text-[#17231C]">{object.confidence}%</span>
                    </div>
                    <div className="rounded-xl bg-[#F5F7F3] p-3">
                      <span className="block text-xs text-[#66736B]">Manufacturing</span>
                      <span className="font-bold text-[#17231C]">{object.manufacturingProcess === 'UNKNOWN' ? 'Not determined' : object.manufacturingProcess}</span>
                    </div>
                  </div>
                  {object.manufacturingProcess !== 'UNKNOWN' && (
                    <p className="mt-3 text-xs text-[#66736B]">Process confidence: {object.manufacturingConfidence}%</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Three Information Cards (Matching Panel 3 Reference Image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Recyclability */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-[#17231C]">Recyclability</h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    scan.recyclability?.level === 'High'
                      ? 'bg-[#EAF6E9] text-[#16803A]'
                      : scan.recyclability?.level === 'Moderate'
                      ? 'bg-amber-50 text-[#D38B2F]'
                      : 'bg-red-50 text-[#B94A48]'
                  }`}
                >
                  {scan.recyclability?.level || 'Moderate'}
                </span>
              </div>
              <p className="text-xs text-[#66736B] leading-relaxed">
                {scan.recyclability?.description ||
                  'Recyclable through local recycling infrastructure.'}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Recycle className="w-8 h-8 text-[#16803A]/30" />
            </div>
          </div>

          {/* Card 2: Common Uses */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-[#17231C] mb-3">Common Uses</h3>
              <p className="text-xs text-[#66736B] leading-relaxed">
                {polymerInfo?.commonUses?.join(', ') ||
                  'Beverage bottles, food containers, packaging, textile fibers.'}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Package className="w-8 h-8 text-[#16803A]/30" />
            </div>
          </div>

          {/* Card 3: Environmental Impact */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-[#17231C]">Environmental Impact</h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-[#D38B2F]">
                  {scan.environmentalImpact?.level || 'Moderate'}
                </span>
              </div>
              <p className="text-xs text-[#66736B] leading-relaxed">
                {scan.environmentalImpact?.description ||
                  'Recyclable plastic but can contribute to microplastics if littered.'}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Leaf className="w-8 h-8 text-[#16803A]/30" />
            </div>
          </div>
        </div>

        {/* Quick Actions Bar (Matching Panel 3 Reference Image) */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs">
          <h3 className="font-bold text-base text-[#17231C] mb-4">Quick Actions</h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              to={`/materials/${scan.polymer}`}
              className="flex items-center justify-center gap-2 p-3 bg-[#F5F7F3] rounded-xl border border-[#DCE5DD] text-xs font-semibold text-[#17231C] hover:bg-[#EAF6E9] hover:text-[#16803A] hover:border-[#16803A] transition-all"
            >
              <Eye className="w-4 h-4 text-[#16803A]" />
              <span>View Details</span>
            </Link>

            <Link
              to={`/materials/${scan.polymer}#reuse`}
              className="flex items-center justify-center gap-2 p-3 bg-[#F5F7F3] rounded-xl border border-[#DCE5DD] text-xs font-semibold text-[#17231C] hover:bg-[#EAF6E9] hover:text-[#16803A] hover:border-[#16803A] transition-all"
            >
              <Lightbulb className="w-4 h-4 text-[#16803A]" />
              <span>Reuse Ideas</span>
            </Link>

            <Link
              to={`/materials/${scan.polymer}#disposal`}
              className="flex items-center justify-center gap-2 p-3 bg-[#F5F7F3] rounded-xl border border-[#DCE5DD] text-xs font-semibold text-[#17231C] hover:bg-[#EAF6E9] hover:text-[#16803A] hover:border-[#16803A] transition-all"
            >
              <Trash2 className="w-4 h-4 text-[#16803A]" />
              <span>Disposal Guide</span>
            </Link>

            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 p-3 bg-[#F5F7F3] rounded-xl border border-[#DCE5DD] text-xs font-semibold text-[#17231C] hover:bg-[#EAF6E9] hover:text-[#16803A] hover:border-[#16803A] transition-all"
            >
              <Share2 className="w-4 h-4 text-[#16803A]" />
              <span>Share Result</span>
            </button>
          </div>
        </div>

        {/* Academic Disclaimer */}
        <DisclaimerBanner />
      </div>
    </div>
  );
};

export default Result;
