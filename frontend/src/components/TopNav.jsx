import React, { useState } from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TopNav = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="flex items-center justify-between py-5 px-6 lg:px-8 bg-transparent border-b border-[#DCE5DD]/40">
      <div>
        {title && <h1 className="text-2xl font-bold text-[#17231C] tracking-tight">{title}</h1>}
        {subtitle && <p className="text-sm text-[#66736B] font-normal mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-white border border-[#DCE5DD] text-[#66736B] hover:text-[#16803A] hover:border-[#16803A] transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#16803A]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-[#DCE5DD] shadow-lg p-4 z-50">
              <h4 className="font-semibold text-xs text-[#17231C] uppercase tracking-wider mb-2">
                Notifications
              </h4>
              <div className="space-y-2 text-xs text-[#66736B]">
                <div className="p-2.5 bg-[#EAF6E9] rounded-xl text-[#14532D]">
                  <p className="font-medium">Welcome to PolyScan AI!</p>
                  <span className="text-[10px] text-[#66736B]">Ready for plastic scanning.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 p-1.5 pr-3 bg-white rounded-xl border border-[#DCE5DD] hover:border-[#16803A] transition-all"
        >
          <div className="w-8 h-8 rounded-lg bg-[#EAF6E9] text-[#16803A] flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <span className="text-xs font-semibold text-[#17231C] hidden sm:inline-block">
            {user?.name || 'User'}
          </span>
        </Link>
      </div>
    </header>
  );
};

export default TopNav;
