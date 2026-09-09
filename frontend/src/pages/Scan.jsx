import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import CameraModal from '../components/CameraModal';
import { scanService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Upload,
  Camera,
  CheckCircle,
  X,
  ArrowRight,
  Loader2,
  ScanLine
} from "lucide-react";

const Scan = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [recentScans, setRecentScans] = useState([]);

  const loadingMessages = [
    'Uploading plastic image...',
    'Understanding visual features with Gemini Vision...',
    'Matching polymer with sustainability knowledge base...',
    'Storing analysis results...',
  ];

  useEffect(() => {
    fetchRecentScans();
  }, []);

  const fetchRecentScans = async () => {
    try {
      const res = await scanService.getScans({ limit: 4 });
      if (res.success) {
        setRecentScans(res.scans.slice(0, 4));
      }
    } catch (err) {
      console.error('[Recent Scans Error]:', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      showToast('Please upload a valid image (JPG, PNG, WEBP).', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds 10MB limit.', 'error');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleCameraCapture = (file, url) => {
    setSelectedFile(file);
    setPreviewUrl(url);
    setActiveTab('upload');
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      showToast('Please select or capture a plastic image first.', 'error');
      return;
    }

    setAnalyzing(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await scanService.analyzeScan(selectedFile);
      clearInterval(interval);

      if (res.success && res.scan?._id) {
        showToast('Plastic analysis complete!', 'success');
        navigate(`/result/${res.scan._id}`);
      } else {
        showToast(res.message || 'Analysis failed. Please try again.', 'error');
        setAnalyzing(false);
      }
    } catch (err) {
      clearInterval(interval);
      setAnalyzing(false);
      console.error('[Analysis Error]:', err);
      showToast(err.response?.data?.message || 'Error analyzing plastic image.', 'error');
    }
  };

  return (
    <div>
      <TopNav title="Scan Plastic" subtitle="Upload or capture an image of plastic item" />

      <div className="px-6 lg:px-8 mt-6 space-y-8">
        {/* Top Tab Buttons (Matching Panel 2 Reference Image) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'upload'
                ? 'bg-[#16803A] text-white shadow-xs'
                : 'bg-white border border-[#DCE5DD] text-[#17231C] hover:bg-[#F5F7F3]'
            }`}
          >
            <Upload className="w-4 h-4" />
            Upload Image
          </button>
          <button
            onClick={() => {
              setActiveTab('camera');
              setCameraModalOpen(true);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              activeTab === 'camera'
                ? 'bg-[#16803A] text-white shadow-xs'
                : 'bg-white border border-[#DCE5DD] text-[#17231C] hover:bg-[#F5F7F3]'
            }`}
          >
            <Camera className="w-4 h-4" />
            Camera
          </button>
        </div>

        {/* Main Grid: Upload Area (Left) vs Tips Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Upload Card (Left - 2 Cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[#DCE5DD] shadow-xs flex flex-col justify-between">
            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#7BA77B]/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#16803A] hover:bg-[#EAF6E9]/30 transition-all min-h-[280px]"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />
                <div className="w-16 h-16 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-[#17231C] mb-1">
                  Drag & drop an image here
                </h3>
                <p className="text-sm font-medium text-[#16803A] mb-3">or click to browse</p>
                <p className="text-xs text-[#66736B]">Supports: JPG, PNG, JPEG (Max 10MB)</p>
              </div>
            ) : (
              /* Preview Area */
              <div className="space-y-6">
                <div className="relative rounded-2xl overflow-hidden bg-[#F5F7F3] border border-[#DCE5DD] max-h-80 flex items-center justify-center p-4">
                  <img
                    src={previewUrl}
                    alt="Selected plastic item preview"
                    className="max-h-72 object-contain rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    disabled={analyzing}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-xs text-[#17231C] hover:text-[#B94A48] rounded-full shadow-md transition-colors"
                    title="Remove Image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={analyzing}
                    className="text-xs font-semibold text-[#16803A] hover:underline"
                  >
                    Change Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Analyze CTA Button */}
            <div className="mt-8">
              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || analyzing}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-md ${
                  !selectedFile || analyzing
                    ? 'bg-[#DCE5DD] text-[#66736B] cursor-not-allowed'
                    : 'bg-[#16803A] text-white hover:bg-[#14532D] shadow-lg'
                }`}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{loadingMessages[loadingStep]}</span>
                  </>
                ) : (
                  <>
                    <ScanLine className="w-5 h-5" />
                    <span>Analyze Plastic</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tips Card (Right Column - Matching Panel 2 Reference Image) */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-[#17231C] mb-4">Tips for better results</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-[#17231C]">
                  <CheckCircle className="w-5 h-5 text-[#16803A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Use clear images</span>
                    <span className="text-xs text-[#66736B]">Ensure sharp focus on the object</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#17231C]">
                  <CheckCircle className="w-5 h-5 text-[#16803A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Good lighting</span>
                    <span className="text-xs text-[#66736B]">Avoid excessive glare or harsh shadows</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#17231C]">
                  <CheckCircle className="w-5 h-5 text-[#16803A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Single plastic object</span>
                    <span className="text-xs text-[#66736B]">Center one plastic item in frame</span>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm text-[#17231C]">
                  <CheckCircle className="w-5 h-5 text-[#16803A] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Avoid multiple items</span>
                    <span className="text-xs text-[#66736B]">Cluttered backgrounds reduce accuracy</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Recent Scans Section (Matching Panel 2 Reference Image) */}
        {recentScans.length > 0 && (
          <section className="bg-white rounded-3xl p-6 border border-[#DCE5DD]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[#17231C]">Recent Scans</h3>
              <Link
                to="/history"
                className="text-xs font-bold text-[#16803A] hover:underline flex items-center gap-1"
              >
                <span>View All History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentScans.map((scan) => (
                <Link
                  key={scan._id}
                  to={`/result/${scan._id}`}
                  className="group bg-[#F5F7F3] rounded-2xl p-3 border border-[#DCE5DD]/60 hover:border-[#16803A] transition-all flex flex-col items-center text-center"
                >
                  <div className="w-full h-24 rounded-xl overflow-hidden bg-white mb-2 flex items-center justify-center p-2">
                    <img
                      src={scan.imageUrl}
                      alt={scan.objectType}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="font-semibold text-xs text-[#17231C] truncate w-full">
                    {scan.objectType}
                  </span>
                  <span className="text-[11px] font-bold text-[#16803A] mt-0.5">
                    {scan.polymer}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={cameraModalOpen}
        onClose={() => setCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />
    </div>
  );
};

export default Scan;
