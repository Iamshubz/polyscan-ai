import React, { useState } from 'react';
import TopNav from '../components/TopNav';
import { useToast } from '../context/ToastContext';
import { Bell, Shield, Moon, Trash2, Check } from 'lucide-react';

const Settings = () => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleSavePreferences = () => {
    showToast('Preferences updated successfully.', 'success');
  };

  return (
    <div>
      <TopNav title="Settings" subtitle="System preferences and account privacy controls" />

      <div className="px-6 lg:px-8 mt-6 space-y-6 max-w-3xl">
        {/* Account & Notifications */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs space-y-6">
          <h3 className="font-bold text-base text-[#17231C]">Notifications & Alerts</h3>

          <div className="flex items-center justify-between py-2 border-b border-[#F5F7F3]">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-[#16803A]" />
              <div>
                <h4 className="font-semibold text-sm text-[#17231C]">Email Notifications</h4>
                <p className="text-xs text-[#66736B]">Receive weekly recycling insights and scan summaries</p>
              </div>
            </div>

            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                notifications ? 'bg-[#16803A]' : 'bg-[#DCE5DD]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  notifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <h3 className="font-bold text-base text-[#17231C] pt-2">Appearance & Theme</h3>

          <div className="flex items-center justify-between py-2 border-b border-[#F5F7F3]">
            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-[#16803A]" />
              <div>
                <h4 className="font-semibold text-sm text-[#17231C]">Dashboard Theme</h4>
                <p className="text-xs text-[#66736B]">Light Sustainability Dashboard (Default)</p>
              </div>
            </div>

            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="px-3 py-1.5 bg-[#F5F7F3] border border-[#DCE5DD] rounded-xl text-xs font-semibold text-[#17231C]"
            >
              <option value="light">Light Eco Mode</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="px-6 py-2.5 bg-[#16803A] text-white font-semibold text-xs rounded-xl hover:bg-[#14532D] shadow-xs"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* Privacy & Account Deletion */}
        <div className="bg-white rounded-3xl p-6 border border-[#DCE5DD] shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#17231C]">Privacy & Security</h3>
          <p className="text-xs text-[#66736B]">
            PolyScan AI stores scan history securely in MongoDB and strictly uses images for polymer identification.
          </p>

          <div className="pt-4 border-t border-[#F5F7F3] flex justify-between items-center">
            <div>
              <h4 className="font-semibold text-xs text-[#B94A48]">Delete Account</h4>
              <p className="text-[11px] text-[#66736B]">Permanently remove account data and scan history</p>
            </div>
            <button
              onClick={() => showToast('Account deletion request registered.', 'info')}
              className="px-4 py-2 bg-red-50 text-[#B94A48] border border-[#B94A48]/30 font-semibold text-xs rounded-xl hover:bg-red-100"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
