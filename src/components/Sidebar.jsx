import React from 'react';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import logoNebula from '../assets/logonebula.png';

const Sidebar = ({ tabs, activeTab, setActiveTab, onLogout, isOpen, setIsOpen, user }) => {
  const detailText = `${user?.NIPD || ''} ${user?.['Rombel Saat Ini'] ? '/ ' + user['Rombel Saat Ini'] : ''}`;
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside 
        className={`fixed inset-y-2 left-2 w-[calc(100%-1rem)] max-w-xs bg-white/90 backdrop-blur-3xl text-gray-800 shadow-[10px_0_40px_rgba(0,0,0,0.06)] z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-72 md:h-full md:m-0 flex flex-col font-sans border border-white md:bg-white/70 md:backdrop-blur-2xl rounded-[2rem] overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-[110%]'
        }`}
      >
        {/* Header (Brand / Logo) */}
        <div className="flex items-center p-6 bg-gradient-to-b from-blue-50/50 to-transparent shrink-0 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <img 
            src={logoNebula} 
            alt="Nebula Logo" 
            className="w-10 h-10 object-contain mr-3 drop-shadow-md z-10"
          />
          <div className="flex flex-col justify-center z-10">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-widest leading-none">NEBULA</h1>
          </div>
        </div>

        {/* Profil User (Hanya Tampil di Mobile) */}
        <div className="md:hidden flex items-center px-6 pb-4 border-b border-gray-100/50 shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-md flex items-center justify-center overflow-hidden border-2 border-white ring-2 ring-blue-50 mr-3 shrink-0">
            <FaUserCircle className="w-12 h-12 text-white/90 mt-2" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800 tracking-wide">{user?.Nama}</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{detailText}</span>
          </div>
        </div>

      {/* Navigasi (Vertical on Mobile & Desktop) */}
      <nav className="flex flex-col justify-start px-4 py-4 flex-1 overflow-y-auto no-scrollbar">
        <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
          Menu Utama
        </p>
        <ul className="flex flex-col w-full space-y-1">
          {tabs.map((tab) => (
            <li key={tab.id} className="flex-none flex justify-start relative">
              <button
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsOpen(false);
                }}
                className={`relative flex flex-row items-center justify-start w-full px-4 py-2.5 text-sm rounded-2xl transition-all duration-300 group overflow-hidden ${
                  activeTab === tab.id 
                    ? 'text-blue-700 bg-gradient-to-r from-blue-50/80 to-indigo-50/30 border border-blue-100/50 shadow-[0_2px_10px_rgba(37,99,235,0.05)] font-semibold' 
                    : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50/80 border border-transparent'
                }`}
              >
                {/* Active Indicator Line */}
                {activeTab === tab.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full"></div>
                )}

                {/* Icon Container */}
                <div className={`mr-3.5 p-1.5 rounded-[10px] transition-all duration-300 flex items-center justify-center ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-md scale-110' 
                    : 'bg-gray-50 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500'
                }`}>
                  <span className="text-[1rem]">
                    {tab.icon}
                  </span>
                </div>
                
                {/* Teks Label */}
                <span className={`block text-xs tracking-wide transition-all ${activeTab === tab.id ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                  {tab.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Tombol Logout (Selalu di bawah Sidebar) */}
      <div className="p-6 mt-auto bg-gradient-to-t from-blue-50/50 to-transparent shrink-0 border-t border-white/50">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center px-4 py-3.5 text-sm font-semibold text-red-600 bg-white/80 border border-white hover:bg-red-50 hover:border-red-100 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md group backdrop-blur-sm"
        >
          <div className="bg-red-50 p-1.5 rounded-lg mr-3 group-hover:bg-white transition-colors">
            <FaSignOutAlt className="text-red-500" />
          </div>
          Keluar / Logout
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
