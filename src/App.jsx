import React, { useState } from 'react';
import { CONFIG } from './data';
import { School } from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  // State ini menyimpan data siswa jika sudah login
  const [studentData, setStudentData] = useState(null);

  // Fungsi untuk logout (menghapus data)
  const handleLogout = () => {
    setStudentData(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-amber-500 selection:text-slate-900">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-amber-500/5 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-4xl z-10">
        
        {/* Global Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 shadow-lg shadow-amber-500/20 mb-4">
            <School className="w-8 h-8 text-slate-900" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
            {CONFIG.APP_NAME}
          </h1>
          <p className="text-slate-400 mt-2 font-medium">{CONFIG.SCHOOL_NAME}</p>
        </div>

        {/* LOGIKA ROUTING SEDERHANA */}
        {/* Jika belum ada data siswa, tampilkan Login. Jika ada, tampilkan Dashboard */}
        
        {!studentData ? (
          <Login onLoginSuccess={(data) => setStudentData(data)} />
        ) : (
          <Dashboard studentData={studentData} onLogout={handleLogout} />
        )}

        <div className="text-center mt-12">
          <p className="text-slate-600 text-sm">{CONFIG.FOOTER_TEXT}</p>
        </div>
      </div>
    </div>
  );
}