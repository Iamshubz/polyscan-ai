import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  ScanLine,
  History,
  LayoutDashboard,
  BookOpen,
  User,
  Settings,
  Menu,
  X,
  Recycle,
  Hexagon,
  Leaf
} from 'lucide-react';
import ecoGlobeImg from '../assets/eco_globe.png';

const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Scan Plastic', path: '/scan', icon: ScanLine },
    { name: 'History', path: '/history', icon: History },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Learn', path: '/learn', icon: BookOpen },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#DCE5DD] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 flex items-center justify-center text-[#16803A]">
            <Hexagon className="w-8 h-8 stroke-[1.8]" />
            <Leaf className="w-4 h-4 absolute fill-[#16803A]" />
          </div>
          <span className="font-bold text-lg text-[#17231C] tracking-tight">
            PolyScan <span className="text-[#16803A]">AI</span>
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#66736B] hover:text-[#16803A] focus:outline-none"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay for Mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop & Mobile Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-[250px] bg-white border-r border-[#DCE5DD] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Logo Header */}
          <div className="px-6 py-6 border-b border-[#F5F7F3] flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center text-[#16803A]">
              <Hexagon className="w-9 h-9 stroke-[1.8]" />
              <Leaf className="w-4.5 h-4.5 absolute fill-[#16803A] text-[#16803A]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-[#17231C] tracking-tight leading-none">
                PolyScan <span className="text-[#16803A]">AI</span>
              </span>
              <span className="text-[10px] text-[#66736B] tracking-wider uppercase font-semibold mt-1">
                AI Sustainability
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-4 py-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-[#EAF6E9] text-[#16803A] font-semibold shadow-xs'
                        : 'text-[#66736B] hover:bg-[#F5F7F3] hover:text-[#17231C]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-[#16803A]' : 'text-[#66736B]'}`} />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Eco Impact Card */}
        <div className="p-4 m-4 bg-[#EAF6E9] rounded-2xl border border-[#DCE5DD]/60 flex flex-col items-center text-center">
          <div className="w-14 h-14 mb-2 flex items-center justify-center">
            <img
              src={ecoGlobeImg}
              alt="Eco Impact Globe"
              className="w-full h-full object-contain drop-shadow-xs"
            />
          </div>
          <h4 className="font-semibold text-xs text-[#14532D] uppercase tracking-wider mb-1">
            Eco Impact
          </h4>
          <p className="text-xs text-[#66736B] font-medium leading-relaxed">
            Together we can make a difference
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
