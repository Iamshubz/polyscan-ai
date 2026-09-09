import React, { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import EmptyState from '../components/EmptyState';
import CardSkeleton from '../components/LoadingSkeleton';
import { dashboardService } from '../services/api';
import {
  ScanLine,
  Award,
  TrendingUp,
  Recycle,
  BarChart3,
  PieChart as PieIcon,
  Calendar,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from 'recharts';

const ECO_COLORS = ['#16803A', '#14532D', '#7BA77B', '#A3C9A8', '#D38B2F', '#52796F', '#2D6A4F'];

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('[Dashboard Stats Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <TopNav title="Dashboard Analytics" subtitle="Sustainability insights & scan statistics" />
        <div className="px-6 lg:px-8 mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const hasData = stats && stats.totalScans > 0;

  return (
    <div>
      <TopNav title="Dashboard Analytics" subtitle="Real-time MongoDB sustainability metrics and AI scan trends" />

      <div className="px-6 lg:px-8 mt-6 space-y-8">
        {/* 4 Top Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Total Scans */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#66736B] uppercase tracking-wider">
                Total Scans
              </span>
              <h3 className="text-3xl font-extrabold text-[#17231C] mt-1">
                {stats?.totalScans || 0}
              </h3>
              <span className="text-[11px] font-medium text-[#16803A] mt-1 inline-block">
                All time scans
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center">
              <ScanLine className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Most Detected Polymer */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#66736B] uppercase tracking-wider">
                Most Detected Polymer
              </span>
              <h3 className="text-3xl font-extrabold text-[#16803A] mt-1">
                {stats?.mostDetectedPolymer || 'N/A'}
              </h3>
              <span className="text-[11px] font-medium text-[#66736B] mt-1 inline-block">
                Highest frequency
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Average Confidence */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#66736B] uppercase tracking-wider">
                Avg AI Confidence
              </span>
              <h3 className="text-3xl font-extrabold text-[#17231C] mt-1">
                {stats?.averageConfidence || 0}%
              </h3>
              <span className="text-[11px] font-medium text-[#16803A] mt-1 inline-block">
                Visual precision
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Recyclable Items */}
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#66736B] uppercase tracking-wider">
                Recyclable Items
              </span>
              <h3 className="text-3xl font-extrabold text-[#14532D] mt-1">
                {stats?.recyclableItems || 0}
              </h3>
              <span className="text-[11px] font-medium text-[#16803A] mt-1 inline-block">
                Diverted from waste
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center">
              <Recycle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Recharts Section */}
        {!hasData ? (
          <EmptyState
            icon={BarChart3}
            title="No Dashboard Data Yet"
            description="Perform your first plastic scan to generate interactive polymer analytics and sustainability charts."
            actionText="Start Scanning"
            actionLink="/scan"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chart 1: Polymer Distribution (Pie Chart) */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-base text-[#17231C]">Polymer Distribution</h3>
                  <p className="text-xs text-[#66736B]">Breakdown by resin classification</p>
                </div>
                <PieIcon className="w-5 h-5 text-[#16803A]" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.polymerDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {stats.polymerDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ECO_COLORS[index % ECO_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#DCE5DD',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Scan Activity Over Time (Area Chart) */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-base text-[#17231C]">Scan Activity Over Time</h3>
                  <p className="text-xs text-[#66736B]">Daily scan volume history</p>
                </div>
                <Calendar className="w-5 h-5 text-[#16803A]" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.activityTimeline}>
                    <defs>
                      <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16803A" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#16803A" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F5F7F3" />
                    <XAxis dataKey="date" stroke="#66736B" fontSize={11} />
                    <YAxis stroke="#66736B" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#DCE5DD',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      stroke="#16803A"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorScans)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Recyclability Distribution (Bar Chart) */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-base text-[#17231C]">Recyclability Breakdown</h3>
                  <p className="text-xs text-[#66736B]">Ease of mechanical processing</p>
                </div>
                <Recycle className="w-5 h-5 text-[#16803A]" />
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.recyclabilityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F5F7F3" />
                    <XAxis dataKey="name" stroke="#66736B" fontSize={11} />
                    <YAxis stroke="#66736B" fontSize={11} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#DCE5DD',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="value" fill="#16803A" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Sustainability Overview */}
            <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base text-[#17231C]">Sustainability Impact</h3>
                  <Sparkles className="w-5 h-5 text-[#16803A]" />
                </div>
                <p className="text-xs text-[#66736B] leading-relaxed mb-6">
                  By utilizing PolyScan AI, you are systematically identifying polymers, choosing optimal disposal routes, and reducing microplastic landfill contamination.
                </p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#17231C]">Recyclable Rate</span>
                      <span className="text-[#16803A]">
                        {Math.round((stats.recyclableItems / (stats.totalScans || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#EAF6E9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#16803A] rounded-full"
                        style={{
                          width: `${Math.round(
                            (stats.recyclableItems / (stats.totalScans || 1)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#17231C]">Average AI Confidence</span>
                      <span className="text-[#16803A]">{stats.averageConfidence}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#EAF6E9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#16803A] rounded-full"
                        style={{ width: `${stats.averageConfidence}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#EAF6E9] rounded-2xl text-center">
                <span className="font-bold text-xs text-[#14532D]">
                  Eco Goal: Keep scanning and upcycling!
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
