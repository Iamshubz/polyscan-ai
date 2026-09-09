import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TopNav from '../components/TopNav';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { scanService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Search,
  Filter,
  Trash2,
  Eye,
  Calendar,
  ScanLine,
  ChevronDown,
  X,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';

const History = () => {
  const { showToast } = useToast();

  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPolymer, setSelectedPolymer] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scanToDelete, setScanToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const polymerOptions = ['ALL', 'PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'ABS'];

  useEffect(() => {
    fetchScans();
  }, [selectedPolymer, sortOrder]);

  const fetchScans = async () => {
    try {
      setLoading(true);
      const res = await scanService.getScans({
        polymer: selectedPolymer,
        search: searchTerm,
        sort: sortOrder,
      });
      if (res.success) {
        setScans(res.scans);
      }
    } catch (err) {
      console.error('[Fetch History Error]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchScans();
  };

  const openDeleteModal = (scan) => {
    setScanToDelete(scan);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!scanToDelete) return;
    setDeleting(true);

    try {
      const res = await scanService.deleteScan(scanToDelete._id);
      if (res.success) {
        showToast('Scan deleted successfully.', 'success');
        setScans((prev) => prev.filter((s) => s._id !== scanToDelete._id));
      } else {
        showToast('Failed to delete scan.', 'error');
      }
    } catch (err) {
      console.error('[Delete Scan Error]:', err);
      showToast('Error removing scan.', 'error');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setScanToDelete(null);
    }
  };

  return (
    <div>
      <TopNav title="Scan History" subtitle="View and manage your previous plastic scans" />

      <div className="px-6 lg:px-8 mt-6 space-y-6">
        {/* Search & Filter Controls */}
        <div className="bg-white rounded-3xl p-4 lg:p-6 border border-[#DCE5DD] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by object or polymer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F5F7F3] border border-[#DCE5DD] rounded-xl text-sm text-[#17231C] placeholder-[#66736B] focus:outline-none focus:border-[#16803A]"
            />
            <Search className="w-4 h-4 text-[#66736B] absolute left-3.5 top-3.5" />
          </form>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* Polymer Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-md scrollbar-none">
              {polymerOptions.map((code) => (
                <button
                  key={code}
                  onClick={() => setSelectedPolymer(code)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shrink-0 ${
                    selectedPolymer === code
                      ? 'bg-[#16803A] text-white shadow-xs'
                      : 'bg-[#F5F7F3] text-[#66736B] hover:text-[#17231C] border border-[#DCE5DD]'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 bg-white border border-[#DCE5DD] rounded-xl text-xs font-semibold text-[#17231C] focus:outline-none focus:border-[#16803A]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* History Content */}
        {loading ? (
          <TableSkeleton />
        ) : scans.length === 0 ? (
          <EmptyState
            icon={ScanLine}
            title="No scan history yet"
            description="Upload or capture a photograph of a plastic item to start tracking your eco impact."
            actionText="Scan Plastic Now"
            actionLink="/scan"
          />
        ) : (
          <div className="bg-white rounded-3xl border border-[#DCE5DD] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F5F7F3] border-b border-[#DCE5DD] text-xs font-bold text-[#66736B] uppercase tracking-wider">
                    <th className="py-4 px-6">Image</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Object</th>
                    <th className="py-4 px-6">Polymer</th>
                    <th className="py-4 px-6">Confidence</th>
                    <th className="py-4 px-6">Recyclability</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F7F3] text-sm">
                  {scans.map((scan) => (
                    <tr key={scan._id} className="hover:bg-[#EAF6E9]/20 transition-colors">
                      <td className="py-3 px-6">
                        <div className="w-12 h-12 rounded-xl bg-[#F5F7F3] border border-[#DCE5DD] overflow-hidden p-1 flex items-center justify-center">
                          <img
                            src={scan.imageUrl}
                            alt={scan.objectType}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-6 text-xs text-[#66736B] font-medium">
                        {new Date(scan.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-6 font-semibold text-[#17231C]">
                        {scan.objectType}
                      </td>
                      <td className="py-3 px-6 font-bold text-[#16803A]">
                        {scan.polymer}
                      </td>
                      <td className="py-3 px-6 font-semibold text-[#17231C]">
                        {scan.confidence}%
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            scan.recyclability?.level === 'High'
                              ? 'bg-[#EAF6E9] text-[#16803A]'
                              : 'bg-amber-50 text-[#D38B2F]'
                          }`}
                        >
                          {scan.recyclability?.level || 'Moderate'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right space-x-2">
                        <Link
                          to={`/result/${scan._id}`}
                          className="inline-flex items-center p-2 rounded-xl text-[#16803A] hover:bg-[#EAF6E9] transition-colors"
                          title="View Result"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(scan)}
                          className="inline-flex items-center p-2 rounded-xl text-[#66736B] hover:text-[#B94A48] hover:bg-red-50 transition-colors"
                          title="Delete Scan"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Scan Deletion */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-[#DCE5DD] shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#B94A48] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-[#17231C]">Delete Scan Record?</h3>
            <p className="text-xs text-[#66736B]">
              Are you sure you want to remove <span className="font-bold text-[#17231C]">{scanToDelete?.objectType}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 py-2.5 bg-[#F5F7F3] border border-[#DCE5DD] text-[#17231C] font-semibold text-xs rounded-xl hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-2.5 bg-[#B94A48] text-white font-semibold text-xs rounded-xl hover:bg-[#B94A48]/90 shadow-xs"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
