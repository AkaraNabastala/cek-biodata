import React, { useState } from 'react';
import { CONFIG } from '../data';
import { LogIn, Loader2, FileDigit, MapPin, CalendarDays } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [formData, setFormData] = useState({ nipd: '', tempat: '', tanggal: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payloadData = {
        nipd: formData.nipd,
        tempat: formData.tempat,
        tanggal: formData.tanggal
      };

      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payloadData)
      });

      const result = await response.json();

      if (result.status === 'sukses') {
        onLoginSuccess(result.data);
      } else {
        // Jika ada typo di sheet atau error script, pesannya akan tampil rapi di web, bukan error merah CORS
        setError(result.pesan);
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
      <h2 className="text-xl font-semibold text-white mb-6 text-center">Masuk ke Akun Anda</h2>
      
      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Nomor Induk (NIPD)</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FileDigit className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              name="nipd"
              required
              value={formData.nipd}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-700 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-slate-600"
              placeholder="Masukkan NIPD"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Tempat Lahir</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              name="tempat"
              required
              value={formData.tempat}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-700 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all placeholder:text-slate-600"
              placeholder="Contoh: Majenang"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-300 ml-1">Tanggal Lahir</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <CalendarDays className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="date"
              name="tanggal"
              required
              value={formData.tanggal}
              onChange={handleInputChange}
              className="w-full pl-11 pr-4 py-3 bg-slate-950/50 border border-slate-700 text-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all [color-scheme:dark]"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-900 font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
          {loading ? 'Memverifikasi...' : 'Akses Biodata'}
        </button>
      </form>
    </div>
  );
}