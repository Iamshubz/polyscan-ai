import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import { polymerService } from '../services/api';
import CardSkeleton from '../components/LoadingSkeleton';
import { Recycle, ArrowRight, BookOpen } from 'lucide-react';

const Learn = () => {
  const [polymers, setPolymers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolymers();
  }, []);

  const fetchPolymers = async () => {
    try {
      setLoading(true);
      const res = await polymerService.getPolymers();
      if (res.success) {
        setPolymers(res.polymers);
      }
    } catch (err) {
      console.error('[Fetch Polymers Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <TopNav
        title="Polymer Knowledge Base"
        subtitle="Learn about standard plastic resin codes, properties, and recyclability"
      />

      <div className="px-6 lg:px-8 mt-6 space-y-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polymers.map((poly) => (
              <Link
                key={poly.code}
                to={`/materials/${poly.code}`}
                className="group bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs hover:border-[#16803A] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center font-bold text-lg">
                      {poly.code}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        poly.recyclability?.level === 'High'
                          ? 'bg-[#EAF6E9] text-[#16803A]'
                          : poly.recyclability?.level === 'Moderate'
                          ? 'bg-amber-50 text-[#D38B2F]'
                          : 'bg-red-50 text-[#B94A48]'
                      }`}
                    >
                      {poly.recyclability?.level} Recyclability
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-[#17231C] group-hover:text-[#16803A] transition-colors">
                    {poly.code} - {poly.name}
                  </h3>
                  <p className="text-xs text-[#66736B] leading-relaxed mt-2 line-clamp-3">
                    {poly.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-[#F5F7F3]">
                    <span className="text-[11px] font-bold text-[#17231C] uppercase tracking-wider block mb-1">
                      Common Uses:
                    </span>
                    <p className="text-xs text-[#66736B] truncate">
                      {poly.commonUses?.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between text-xs font-bold text-[#16803A]">
                  <span>Explore Material Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;
