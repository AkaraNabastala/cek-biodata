import React, { useState } from 'react';
import { loginStudent } from '../utils/api';
import bgImage from '../assets/background.jpg';
import logoYkh from '../assets/YKH SUFYAN TSURI.png';

const Login = ({ onLogin }) => {
  const [nipd, setNipd] = useState('');
  const [nisn, setNisn] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nipd || !nisn) {
      setError('Mohon isi NIPD dan NISN.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginStudent(nipd, nisn);

      if (data.success) {
        onLogin(data.data);
      } else {
        setError(data.message || 'NIPD atau NISN tidak ditemukan.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex relative font-sans overflow-hidden">

      {/* 
        Background Image (Left 60% on Desktop, 100% Background on Mobile) 
      */}
      <div
        className="absolute inset-0 md:relative md:w-[60%] h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay Gambar: Gradasi Hitam */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>

        {/* Teks dan Logo Kiri (Desktop Saja) */}
        <div className="hidden md:flex absolute bottom-12 left-12 flex-col text-white max-w-lg">
          <p className="text-4xl font-bold tracking-wide text-yellow-400 drop-shadow-md mb-4">
            PORTAL INFORMASI DATA SISWA
          </p>
          <p className="text-gray-200 font-light leading-relaxed text-lg mb-8 border-l-4 border-yellow-400 pl-4">
            "Jangan takut buat salah, karena kesalahan adalah bukti kalau kamu sedang belajar dan mencoba hal baru."
          </p>
          <div className="flex items-center space-x-4">
            <img
              src={logoYkh}
              alt="Logo SMP Islam Caruy"
              className="w-14 h-14 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            />
            <h1 className="text-2xl font-black tracking-widest text-white drop-shadow-lg">
              SMP ISLAM CARUY
            </h1>
          </div>
        </div>
      </div>

      {/* 
        Panel Kanan (Form Login): 40% Putih di Desktop, Full Glass di Mobile
      */}
      <div className="relative z-10 w-full md:w-[40%] h-full flex flex-col justify-center items-center md:bg-white p-4 sm:p-8 md:p-14 md:shadow-[-20px_0_40px_rgba(0,0,0,0.1)]">

        {/* Kontainer Form */}
        <div className="w-full max-w-sm bg-white/10 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none border border-white/20 md:border-none rounded-[2rem] md:rounded-none p-8 md:p-0 shadow-2xl md:shadow-none flex flex-col items-center md:items-start">

          {/* Logo khusus Mobile (Desktop disembunyikan) */}
          <div className="mb-6 flex md:hidden flex-col items-center w-full text-center">
            <img
              src={logoYkh}
              alt="Logo SMP Islam Caruy"
              className="w-20 h-20 object-contain drop-shadow-lg mb-3"
            />
            <h2 className="text-lg font-bold text-white tracking-wide">SMP ISLAM CARUY</h2>
          </div>

          <div className="w-full text-center md:text-left mb-10">
            {/* Ikon Hiasan (Khusus Desktop) dengan animasi pulse pelan */}
            <div className="hidden md:inline-flex items-center justify-center w-14 h-14 bg-blue-50/80 text-blue-600 rounded-2xl mb-6 shadow-sm border border-blue-100/50">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white md:text-slate-900 mb-3 tracking-tight">Selamat Datang</h2>
            <p className="text-gray-300 md:text-slate-500 text-sm md:text-base font-light">
              Silakan masuk menggunakan NIPD dan NISN Anda.
            </p>
          </div>

          {error && (
            <div className="w-full bg-red-500/10 md:bg-red-50 border-l-4 border-red-500 md:border-red-500 text-red-200 md:text-red-700 p-4 mb-6 rounded-r-xl rounded-l-sm text-sm text-left flex items-start space-x-3 shadow-sm">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 w-full">

            <div className="space-y-2">
              <label htmlFor="nipd" className="block text-xs font-bold text-gray-300 md:text-slate-600 uppercase tracking-widest pl-1 md:pl-0">
                NIPD
              </label>
              <input
                type="text"
                id="nipd"
                name="nipd"
                value={nipd}
                onChange={(e) => setNipd(e.target.value)}
                className="w-full px-5 py-4 bg-black/20 md:bg-slate-50 border border-white/10 md:border-slate-200 rounded-xl md:focus:border-blue-500 focus:border-yellow-400 focus:bg-black/40 md:focus:bg-white text-white md:text-slate-900 placeholder-gray-500 md:placeholder-slate-400 md:focus:ring-4 md:focus:ring-blue-500/15 transition-all duration-300 text-sm outline-none"
                placeholder="Masukkan NIPD"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="nisn" className="block text-xs font-bold text-gray-300 md:text-slate-600 uppercase tracking-widest pl-1 md:pl-0">
                NISN
              </label>
              <input
                type="text"
                id="nisn"
                name="nisn"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="w-full px-5 py-4 bg-black/20 md:bg-slate-50 border border-white/10 md:border-slate-200 rounded-xl md:focus:border-blue-500 focus:border-yellow-400 focus:bg-black/40 md:focus:bg-white text-white md:text-slate-900 placeholder-gray-500 md:placeholder-slate-400 md:focus:ring-4 md:focus:ring-blue-500/15 transition-all duration-300 text-sm outline-none"
                placeholder="Masukkan NISN"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full group mt-10 py-4 px-4 bg-yellow-500 md:bg-blue-600 md:hover:bg-blue-700 hover:bg-yellow-400 text-gray-900 md:text-white font-bold tracking-widest text-sm rounded-xl md:shadow-[0_8px_20px_rgb(37,99,235,0.25)] md:hover:shadow-[0_8px_25px_rgb(37,99,235,0.4)] md:hover:-translate-y-0.5 transition-all duration-300 flex justify-center items-center ${loading ? 'opacity-90 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  MEMVERIFIKASI...
                </>
              ) : (
                <>
                  MASUK SEKARANG
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer Nebula */}
        <div className="absolute bottom-6 md:bottom-8 left-0 w-full text-center md:text-left md:pl-14 flex flex-col items-center md:items-start opacity-70 hover:opacity-100 transition-opacity">
          <span className="text-gray-400 md:text-gray-500 text-[9px] uppercase tracking-[0.2em] mb-1 md:mb-0">Managed by</span>
          <a href="https://akaranabastala.github.io/portofolio_dicha/" target="_blank" rel="noopener noreferrer" className="font-black tracking-[0.2em] text-gray-300 md:text-gray-700 text-[11px] uppercase md:hover:text-blue-600 hover:text-yellow-400 transition-colors duration-300">
            NEBULA
          </a>
        </div>

      </div>

    </div>
  );
};

export default Login;
