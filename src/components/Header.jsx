import React, { useState, useRef, useEffect } from 'react';
import { FaSignOutAlt, FaUserCircle, FaBars } from 'react-icons/fa';
import logoNebula from '../assets/logonebula.png';

const Header = ({ user, onLogout, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const detailText = `${user?.NIPD || ''} ${user?.['Rombel Saat Ini'] ? '/ ' + user['Rombel Saat Ini'] : ''}`;

  return (
    <header className="bg-transparent md:bg-white/40 md:backdrop-blur-xl md:shadow-sm md:border md:border-white md:rounded-[1.5rem] mx-2 md:mx-4 mt-2 md:mt-3 mb-2 md:mb-4 font-sans h-12 md:h-14 flex items-center shrink-0 z-30">
      <div className="w-full flex items-center justify-between px-2 md:px-5">
        
        {/* Kiri: Hamburger (Mobile) & Brand Identity (NEBULA) */}
        <div className="flex items-center">
          
          {/* Hamburger Mobile */}
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2.5 -ml-1 mr-3 bg-white/70 backdrop-blur-md hover:bg-white text-gray-700 shadow-sm border border-white focus:outline-none rounded-xl transition-all"
          >
            <FaBars className="w-5 h-5" />
          </button>

          {/* Desktop Kosong atau Judul */}
          <div className="hidden md:block">
            <h2 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-500 tracking-tight">PORTAL SISWA</h2>
          </div>

          {/* Mobile Brand Identity */}
          <div className="md:hidden flex items-center">
            <img
              src={logoNebula}
              alt="Nebula Logo"
              className="w-6 h-6 object-contain mr-2 drop-shadow-sm"
            />
            <div className="flex flex-col">
              <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-widest leading-none">NEBULA</span>
            </div>
          </div>
        </div>

        {/* Kanan: Profil & Dropdown (Hanya Desktop) */}
        <div className="relative hidden md:flex items-center" ref={dropdownRef}>
          
          {/* Avatar Button */}
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 focus:outline-none p-1 md:p-1.5 rounded-full md:rounded-xl md:cursor-default"
          >
            <div className="hidden md:flex flex-col text-right mr-1">
              <span className="text-xs font-bold text-gray-800 tracking-wide">{user?.Nama}</span>
              <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded-full mt-0.5 inline-block w-fit self-end">{detailText}</span>
            </div>
            
            {/* Avatar Circle */}
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-sm flex items-center justify-center overflow-hidden border-2 border-white ring-1 ring-blue-50">
              <FaUserCircle className="w-10 h-10 text-white/90 mt-1.5" />
            </div>
          </button>

          {/* Dropdown Menu (Hanya muncul di Mobile) */}
          {isDropdownOpen && (
            <div className="md:hidden absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-2 z-50 transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
              <div className="px-5 py-3 border-b border-gray-50">
                <p className="text-sm font-bold text-gray-800 truncate">{user?.Nama}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{detailText}</p>
              </div>

              <div className="p-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center px-4 py-3 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors group"
                >
                  <FaSignOutAlt className="mr-3 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Keluar / Logout
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;
