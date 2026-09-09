import React, { useState, useEffect } from 'react';
import TopNav from '../components/TopNav';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { User, Mail, Calendar, ScanLine, Award, Recycle, LogOut, Edit2, Check } from 'lucide-react';

const Profile = () => {
  const { user, logout, setUser } = useAuth();
  const { showToast } = useToast();

  const [profileStats, setProfileStats] = useState({
    totalScans: 0,
    recyclableItems: 0,
    mostScannedPolymer: 'N/A',
  });
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const res = await profileService.getProfile();
      if (res.success) {
        setProfileStats(res.stats);
        if (res.user?.name) setName(res.user.name);
      }
    } catch (err) {
      console.error('[Profile Fetch Error]:', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await profileService.updateProfile({ name });
      if (res.success) {
        setUser((prev) => ({ ...prev, name }));
        showToast('Profile updated successfully.', 'success');
        setEditing(false);
      }
    } catch (err) {
      console.error('[Update Profile Error]:', err);
      showToast('Error updating profile.', 'error');
    }
  };

  return (
    <div>
      <TopNav title="User Profile" subtitle="Manage your PolyScan AI account and statistics" />

      <div className="px-6 lg:px-8 mt-6 space-y-8 max-w-4xl">
        {/* Profile Identity Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#DCE5DD] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#EAF6E9] text-[#16803A] font-extrabold text-3xl flex items-center justify-center border border-[#7BA77B]/30 shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              {!editing ? (
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-[#17231C]">{user?.name || 'User'}</h2>
                  <p className="text-sm text-[#66736B] flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#16803A]" />
                    <span>{user?.email || 'user@polyscan.ai'}</span>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2 bg-[#F5F7F3] border border-[#DCE5DD] rounded-xl text-sm font-semibold focus:outline-none focus:border-[#16803A]"
                    required
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#16803A] text-white rounded-xl hover:bg-[#14532D]"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#DCE5DD] text-[#17231C] font-semibold text-xs rounded-xl hover:bg-[#F5F7F3]"
              >
                <Edit2 className="w-4 h-4 text-[#16803A]" />
                <span>Edit Profile</span>
              </button>
            )}

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-50 text-[#B94A48] border border-[#B94A48]/20 font-semibold text-xs rounded-xl hover:bg-red-100"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* User Impact Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center shrink-0">
              <ScanLine className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#66736B] uppercase">Total Scans</span>
              <h3 className="text-2xl font-extrabold text-[#17231C]">{profileStats.totalScans}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center shrink-0">
              <Recycle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#66736B] uppercase">Recyclable Items</span>
              <h3 className="text-2xl font-extrabold text-[#14532D]">{profileStats.recyclableItems}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EAF6E9] text-[#16803A] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#66736B] uppercase">Top Polymer</span>
              <h3 className="text-2xl font-extrabold text-[#16803A]">
                {profileStats.mostScannedPolymer}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
