import React from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { ScanLine, LayoutDashboard, ShieldCheck, Leaf, Recycle, Sparkles, Upload, Eye, BookOpen, Lightbulb, ArrowRight } from 'lucide-react';
import heroImg from '../assets/hero_illustration.png';

const Home = () => {
  return (
    <div>
      <TopNav />

      <div className="px-6 lg:px-8 mt-4 space-y-8">
        {/* Hero Section (Matching Panel 1 Reference Image) */}
        <section className="bg-white rounded-3xl p-8 lg:p-12 border border-[#DCE5DD] flex flex-col lg:flex-row items-center justify-between gap-10 shadow-xs relative overflow-hidden">
          {/* Hero Left Content */}
          <div className="max-w-xl space-y-6 z-10">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#17231C] tracking-tight leading-tight">
                Welcome to <br />
                <span className="text-[#16803A]">PolyScan AI</span>
              </h1>
              <p className="text-lg font-semibold text-[#14532D] tracking-wide pt-1">
                AI-Powered Plastic Identification for a Sustainable Future
              </p>
            </div>

            <p className="text-sm sm:text-base text-[#66736B] leading-relaxed">
              Upload an image of any plastic item and let our AI estimate the polymer type and provide sustainability insights.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/scan"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#16803A] text-white font-semibold text-sm rounded-xl hover:bg-[#14532D] transition-all shadow-md group"
              >
                <ScanLine className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Scan Plastic Now</span>
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-[#DCE5DD] text-[#17231C] font-semibold text-sm rounded-xl hover:bg-[#F5F7F3] transition-all shadow-xs"
              >
                <LayoutDashboard className="w-5 h-5 text-[#16803A]" />
                <span>View Dashboard</span>
              </Link>
            </div>
          </div>

          {/* Hero Right Visual (3D Recyclable Plastics Illustration) */}
          <div className="relative w-full max-w-md flex items-center justify-center">
            <div className="w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 rounded-full bg-[#EAF6E9]/60 flex items-center justify-center p-4 border border-[#7BA77B]/20">
              <img
                src={heroImg}
                alt="Recyclable plastics sustainability composition"
                className="w-full h-full object-contain drop-shadow-md hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </section>

        {/* 4 Feature Items (Matching Panel 1 Reference Image) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#DCE5DD] flex items-center gap-4 hover:border-[#16803A]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#17231C]">Identify Plastics</h3>
              <p className="text-xs text-[#66736B] font-medium">AI Detection</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCE5DD] flex items-center gap-4 hover:border-[#16803A]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#17231C]">Sustainability Insights</h3>
              <p className="text-xs text-[#66736B] font-medium">Eco Impact</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCE5DD] flex items-center gap-4 hover:border-[#16803A]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center shrink-0">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#17231C]">Smart Disposal</h3>
              <p className="text-xs text-[#66736B] font-medium">Better Planet</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCE5DD] flex items-center gap-4 hover:border-[#16803A]/50 transition-all">
            <div className="w-12 h-12 rounded-xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#17231C]">Reuse Ideas</h3>
              <p className="text-xs text-[#66736B] font-medium">Creative Reuse</p>
            </div>
          </div>
        </section>

        {/* How PolyScan Works Section */}
        <section className="bg-white rounded-3xl p-8 border border-[#DCE5DD]">
          <div className="text-center max-w-lg mx-auto mb-10">
            <h2 className="text-2xl font-bold text-[#17231C]">How PolyScan Works</h2>
            <p className="text-sm text-[#66736B] mt-1">
              Four simple steps from photograph to comprehensive sustainability guidance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-6 bg-[#F5F7F3] rounded-2xl border border-[#DCE5DD]/60">
              <div className="w-10 h-10 rounded-full bg-[#16803A] text-white font-bold text-sm flex items-center justify-center mb-4">
                1
              </div>
              <Upload className="w-6 h-6 text-[#16803A] mb-2" />
              <h3 className="font-bold text-sm text-[#17231C]">Upload</h3>
              <p className="text-xs text-[#66736B] mt-1 leading-relaxed">
                Take a picture or drop a clear image of your plastic item.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-[#F5F7F3] rounded-2xl border border-[#DCE5DD]/60">
              <div className="w-10 h-10 rounded-full bg-[#16803A] text-white font-bold text-sm flex items-center justify-center mb-4">
                2
              </div>
              <Eye className="w-6 h-6 text-[#16803A] mb-2" />
              <h3 className="font-bold text-sm text-[#17231C]">AI Vision</h3>
              <p className="text-xs text-[#66736B] mt-1 leading-relaxed">
                Gemini Vision analyzes geometry, wall clarity, and molding features.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-[#F5F7F3] rounded-2xl border border-[#DCE5DD]/60">
              <div className="w-10 h-10 rounded-full bg-[#16803A] text-white font-bold text-sm flex items-center justify-center mb-4">
                3
              </div>
              <BookOpen className="w-6 h-6 text-[#16803A] mb-2" />
              <h3 className="font-bold text-sm text-[#17231C]">Material Knowledge</h3>
              <p className="text-xs text-[#66736B] mt-1 leading-relaxed">
                Matches resin type (PET, HDPE, PP, etc.) with structured database.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-[#F5F7F3] rounded-2xl border border-[#DCE5DD]/60">
              <div className="w-10 h-10 rounded-full bg-[#16803A] text-white font-bold text-sm flex items-center justify-center mb-4">
                4
              </div>
              <Sparkles className="w-6 h-6 text-[#16803A] mb-2" />
              <h3 className="font-bold text-sm text-[#17231C]">Sustainability Insights</h3>
              <p className="text-xs text-[#66736B] mt-1 leading-relaxed">
                Get recyclability score, disposal guides, and upcycling ideas.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
