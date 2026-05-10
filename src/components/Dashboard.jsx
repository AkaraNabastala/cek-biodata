import React, { useState } from 'react';
import { CheckCircle, AlertCircle, LogOut, User, MapPin, ClipboardList, Plus, Trash2, Send, X } from 'lucide-react';
import { CONFIG } from '../data';

export default function Dashboard({ studentData, onLogout }) {
  const [status, setStatus] = useState(studentData.statusCek || '');
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [listChanges, setListChanges] = useState([]); 
  const [currentEdit, setCurrentEdit] = useState({ field: '', dataBaru: '' });

  const availableFields = [
    "NAMA", "TEMPAT LAHIR", "TANGGAL LAHIR", "NIK", "AGAMA", 
    "JALAN", "RT", "RW", "DUSUN", "KELURAHAN", "KECAMATAN", "KODE POS", 
    "NAMA AYAH", "NAMA IBU"
  ];

  const handleConfirm = async () => {
    if (!window.confirm("Konfirmasi bahwa data Anda sudah benar?")) return;
    setLoading(true);
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'konfirmasi', baris: studentData.baris })
      });
      const res = await response.json();
      if (res.status === 'sukses') setStatus('SESUAI');
    } catch (e) { alert('Gagal terhubung ke server.'); }
    finally { setLoading(false); }
  };

  const addChange = () => {
    if (!currentEdit.field || !currentEdit.dataBaru) return;
    const fieldMap = {
      "NAMA": studentData.nama, "NIK": studentData.nik, "JALAN": studentData.jalan,
      "RT": studentData.rt, "RW": studentData.rw, "DUSUN": studentData.dusun,
      "KELURAHAN": studentData.kelurahan, "KECAMATAN": studentData.kecamatan,
      "KODE POS": studentData.kodePos, "NAMA AYAH": studentData.namaAyah, "NAMA IBU": studentData.namaIbu
    };
    setListChanges([...listChanges, { ...currentEdit, dataLama: fieldMap[currentEdit.field] || "-" }]);
    setCurrentEdit({ field: '', dataBaru: '' });
  };

  const submitChanges = async () => {
    setLoading(true);
    try {
      const response = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'ajukan_perubahan',
          nipd: studentData.nipd,
          nama: studentData.nama,
          perubahan: listChanges 
        })
      });
      const res = await response.json();
      if (res.status === 'sukses') {
        alert("Berhasil dikirim.");
        setListChanges([]);
        setShowEditModal(false);
        setStatus('MENUNGGU REVISI');
      }
    } catch (e) { alert("Gagal mengirim."); }
    finally { setLoading(false); }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-slate-200">
      {/* Header Kecil & Rapi */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-6 rounded-2xl border border-slate-800 mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
            <User className="text-amber-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{studentData.nama}</h2>
            <p className="text-xs text-slate-400">NIPD: {studentData.nipd} | Kelas: {studentData.kelas}</p>
          </div>
        </div>
        <button onClick={onLogout} className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-2 bg-red-400/5 px-4 py-2 rounded-lg border border-red-400/10 transition-all">
          <LogOut size={14} /> Keluar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom Data Utama */}
        <div className="md:col-span-2 space-y-6">
          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-800/50 px-5 py-3 border-b border-slate-800 flex items-center gap-2">
              <ClipboardList size={16} className="text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Biodata Dasar</span>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <DataLabel label="NISN" value={studentData.nisn} />
              <DataLabel label="NIK" value={studentData.nik} />
              <DataLabel label="Tempat Lahir" value={studentData.tempatLahir} />
              <DataLabel label="Tanggal Lahir" value={studentData.tanggalLahir} />
              <DataLabel label="Nama Ayah" value={studentData.namaAyah} />
              <DataLabel label="Nama Ibu" value={studentData.namaIbu} />
            </div>
          </section>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="bg-slate-800/50 px-5 py-3 border-b border-slate-800 flex items-center gap-2">
              <MapPin size={16} className="text-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Informasi Alamat</span>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="col-span-full"><DataLabel label="Jalan" value={studentData.jalan} /></div>
              <DataLabel label="RT/RW" value={`${studentData.rt} / ${studentData.rw}`} />
              <DataLabel label="Dusun" value={studentData.dusun} />
              <DataLabel label="Kelurahan" value={studentData.kelurahan} />
              <DataLabel label="Kecamatan" value={studentData.kecamatan} />
              <DataLabel label="Kode Pos" value={studentData.kodePos} />
            </div>
          </section>
        </div>

        {/* Kolom Status & Aksi */}
        <div className="space-y-4">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
            <h3 className="text-sm font-bold mb-4">Verifikasi Data</h3>
            {status === 'SESUAI' ? (
              <div className="bg-green-500/10 text-green-500 p-4 rounded-xl border border-green-500/20 flex flex-col items-center gap-2">
                <CheckCircle size={32} />
                <span className="text-xs font-bold">DATA SUDAH SESUAI</span>
              </div>
            ) : status === 'MENUNGGU REVISI' ? (
              <div className="bg-amber-500/10 text-amber-500 p-4 rounded-xl border border-amber-500/20 flex flex-col items-center gap-2">
                <AlertCircle size={32} />
                <span className="text-xs font-bold uppercase">Menunggu Revisi</span>
              </div>
            ) : (
              <div className="space-y-3">
                <button onClick={handleConfirm} disabled={loading} className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold text-sm transition-all flex justify-center items-center gap-2">
                  <CheckCircle size={18} /> Konfirmasi Sesuai
                </button>
                <button onClick={() => setShowEditModal(true)} className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-xl font-bold text-sm border border-slate-700 transition-all flex justify-center items-center gap-2 text-slate-300">
                  <AlertCircle size={18} /> Ada Kesalahan?
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Edit Proporsional */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
              <span className="text-sm font-bold">Laporkan Perbaikan Data</span>
              <button onClick={() => setShowEditModal(false)}><X size={20}/></button>
            </div>
            <div className="p-6 space-y-4">
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" value={currentEdit.field} onChange={(e) => setCurrentEdit({...currentEdit, field: e.target.value})}>
                <option value="">Pilih Kolom Yang Salah...</option>
                {availableFields.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <div className="flex gap-2">
                <input type="text" placeholder="Data yang benar..." className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" value={currentEdit.dataBaru} onChange={(e) => setCurrentEdit({...currentEdit, dataBaru: e.target.value})} />
                <button onClick={addChange} className="bg-amber-500 text-slate-900 p-3 rounded-xl"><Plus size={20}/></button>
              </div>
              
              <div className="bg-slate-950 rounded-xl p-2 max-h-40 overflow-y-auto space-y-2">
                {listChanges.map((it, i) => (
                  <div key={i} className="flex justify-between items-center bg-slate-800 p-3 rounded-lg text-xs">
                    <span>{it.field}: <b className="text-amber-500">{it.dataBaru}</b></span>
                    <button onClick={() => setListChanges(listChanges.filter((_, idx) => idx !== i))}><Trash2 size={14} className="text-red-400"/></button>
                  </div>
                ))}
              </div>

              <button onClick={submitChanges} disabled={listChanges.length === 0 || loading} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2 transition-all">
                <Send size={18} /> {loading ? 'Mengirim...' : 'Kirim Laporan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DataLabel({ label, value }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-slate-500 font-bold uppercase">{label}</p>
      <p className="text-sm font-medium text-slate-200">{value || '-'}</p>
    </div>
  );
}