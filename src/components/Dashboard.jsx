import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import DataForm from './DataForm';
import Overview from './Overview';
import { updateStudentData } from '../utils/api';
import { formatDate } from '../utils/formatters';
import { 
  FaUser, FaMapMarkerAlt, FaUserFriends, 
  FaGraduationCap, FaMedkit, FaChartLine, FaThLarge 
} from 'react-icons/fa';

const Dashboard = ({ user, onLogout, setUser }) => {
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'beranda';
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    window.location.hash = activeTab;
  }, [activeTab]);

  const tabs = [
    { id: 'beranda', label: 'Ringkasan', icon: <FaThLarge /> },
    { id: 'biodata', label: 'Biodata Diri', icon: <FaUser /> },
    { id: 'alamat', label: 'Alamat', icon: <FaMapMarkerAlt /> }, // Shortened labels for mobile
    { id: 'orangtua', label: 'Orang Tua', icon: <FaUserFriends /> },
    { id: 'akademik', label: 'Akademik', icon: <FaGraduationCap /> },
    { id: 'kesejahteraan', label: 'Bantuan', icon: <FaMedkit /> }, // Shortened
    { id: 'periodik', label: 'Periodik', icon: <FaChartLine /> },
  ];

  const handleSave = async (updatedFields, sectionName) => {
    setIsSaving(true);
    setSaveMessage({ text: '', type: '' });
    
    const changes = [];
    const changedKeys = [];

    // Khusus untuk Kesejahteraan yang mengirimkan array _custom_kartu
    if (updatedFields._custom_kartu) {
      changes.push({
        kategori: 'Penambahan Kartu Kesejahteraan',
        before: '-',
        after: `Menambahkan ${updatedFields._custom_kartu.length} kartu baru`
      });
      changedKeys.push('Kartu Kesejahteraan');
    }

    Object.keys(updatedFields).forEach(key => {
      if (key === '_custom_kartu') return;
      
      let currentValue = user[key];
      if (key === 'Tanggal Lahir') {
        currentValue = formatDate(currentValue);
      }
      
      if (updatedFields[key] !== currentValue) {
        changes.push({
          kategori: key,
          before: currentValue || '-',
          after: updatedFields[key] || '-'
        });
        changedKeys.push(key);
      }
    });

    if (changes.length === 0) {
      setSaveMessage({ text: 'Tidak ada perubahan yang perlu disimpan.', type: 'info' });
      setIsSaving(false);
      return;
    }

    const activityMessage = `Melakukan perubahan pada bagian [${sectionName}] (Kategori: ${changedKeys.join(', ')})`;
    const newData = { ...user, ...updatedFields };

    try {
      await updateStudentData(user.NIPD, user.NISN, newData, changes, activityMessage);
      setUser(newData);
      setSaveMessage({ text: 'Data berhasil disimpan dan log dicatat!', type: 'success' });
    } catch (error) {
      setSaveMessage({ text: error.message, type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage({ text: '', type: '' }), 5000);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-teal-50 overflow-hidden font-sans p-2 md:p-4 gap-2 md:gap-4 relative">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[100px]"></div>
      </div>

      {/* Sidebar Desktop / Drawer Mobile */}
      <Sidebar 
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={onLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        user={user}
      />
      
      {/* Area Konten Utama */}
      <div className="flex flex-col flex-1 w-full h-full relative z-10 bg-white/70 backdrop-blur-2xl md:rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white overflow-hidden">
        <Header 
          user={user} 
          onLogout={onLogout} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        {/* Kontainer Scroll */}
        <main className="flex-1 overflow-y-auto p-3 md:p-5 rounded-b-[2rem]">
          <div className="max-w-5xl mx-auto">
            {saveMessage.text && (
              <div className={`mb-8 p-4 rounded-2xl shadow-sm border-l-4 transition-all flex items-center space-x-3 ${
                saveMessage.type === 'success' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 
                saveMessage.type === 'error' ? 'bg-red-50 border-red-500 text-red-700' : 
                'bg-blue-50 border-blue-500 text-blue-700'
              }`}>
                {saveMessage.type === 'success' && <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                <span className="font-semibold text-sm">{saveMessage.text}</span>
              </div>
            )}
            
            {/* Render Komponen Berdasarkan Tab Aktif */}
            {activeTab === 'beranda' ? (
              <Overview user={user} setActiveTab={setActiveTab} />
            ) : (
              <DataForm 
                user={user} 
                activeTab={activeTab} 
                onSave={handleSave} 
                isSaving={isSaving} 
              />
            )}
          </div>
        </main>
      </div>

      {/* Full-screen Loading Overlay */}
      {isSaving && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex flex-col items-center max-w-xs text-center animate-bounce-slight">
            <svg className="animate-spin h-12 w-12 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-800 font-bold text-lg">Menyimpan Data</p>
            <p className="text-gray-500 text-sm mt-1">Mohon tunggu, perubahan Anda sedang disinkronisasi...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
