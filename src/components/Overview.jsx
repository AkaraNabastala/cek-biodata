import React, { useState } from 'react';
import { FaIdCard, FaGraduationCap, FaExternalLinkAlt, FaFileAlt, FaSync, FaTimes, FaPlayCircle, FaInfoCircle, FaAddressCard } from 'react-icons/fa';
import aktaImage from '../assets/NOMOR AKTE KELAHIRAN.png';
import kkImage from '../assets/kartu keluarga.png';
import pipVideo from '../assets/cek-pip.mp4';

const Overview = ({ user, setActiveTab }) => {
  const [isPipModalOpen, setIsPipModalOpen] = useState(false);
  const [isAktaModalOpen, setIsAktaModalOpen] = useState(false);
  const [isKkModalOpen, setIsKkModalOpen] = useState(false);
  const [isBansosModalOpen, setIsBansosModalOpen] = useState(false);
  // Hitung kelengkapan data (simulasi sederhana)
  const totalFields = Object.keys(user || {}).length;
  const filledFields = Object.values(user || {}).filter(val => val !== null && val !== '').length;
  const progress = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  return (
    <div className="space-y-4 md:space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Stats Card */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl p-5 md:p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Left: Circular Progress */}
        <div className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 flex items-center justify-center drop-shadow-md">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.15)" strokeWidth="8" fill="none" />
            <circle 
              cx="50" cy="50" r="40" 
              stroke="white" strokeWidth="8" fill="none" strokeLinecap="round"
              strokeDasharray="251.2" 
              strokeDashoffset={251.2 - (251.2 * progress) / 100} 
              className="transition-all duration-1000 ease-out" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl md:text-2xl font-black">{progress}%</span>
          </div>
        </div>

        {/* Right: Quick Info */}
        <div className="flex-1 w-full relative z-10 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-black mb-1">Status Pengisian Data</h2>
          <p className="text-blue-100/90 text-[11px] md:text-xs mb-4 max-w-sm mx-auto md:mx-0">Pastikan progres mencapai 100% agar data tervalidasi secara nasional.</p>
          
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl px-3.5 py-2.5 flex items-center gap-3 transition-colors border border-white/10">
              <FaIdCard className="text-white/80 text-lg" />
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-widest text-blue-100/80 font-bold leading-none mb-1">NIPD / NISN</p>
                <p className="text-sm font-bold leading-none">{user?.NIPD} / {user?.NISN}</p>
              </div>
            </div>
            <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl px-3.5 py-2.5 flex items-center gap-3 transition-colors border border-white/10">
              <FaGraduationCap className="text-white/80 text-lg" />
              <div className="text-left">
                <p className="text-[9px] uppercase tracking-widest text-blue-100/80 font-bold leading-none mb-1">Kelas</p>
                <p className="text-sm font-bold leading-none">{user?.['Rombel Saat Ini'] || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panduan Ringkas List */}
      <div className="bg-white/60 backdrop-blur-xl border border-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h3 className="text-sm font-black text-gray-800 mb-3 flex items-center">
          <div className="w-1.5 h-4 bg-indigo-500 rounded-full mr-2"></div>
          Informasi Penting
        </h3>
        
        <div className="space-y-1">
          {/* PIP Compact */}
          <div className="group flex items-start gap-3 p-3 hover:bg-blue-50/60 rounded-2xl transition-colors">
            <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl shrink-0 mt-0.5">
              <FaExternalLinkAlt className="text-sm" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-800">Cek Status PIP (Program Indonesia Pintar)</h4>
              <p className="text-xs text-gray-500 mb-2 mt-0.5">Pastikan status penerima PIP Anda secara mandiri.</p>
              <button 
                onClick={() => setIsPipModalOpen(true)} 
                className="text-xs font-bold text-blue-600 bg-white shadow-sm border border-blue-100 hover:bg-blue-600 hover:text-white px-3 py-1.5 rounded-lg flex items-center transition-all w-fit"
              >
                <FaPlayCircle className="mr-1.5 text-sm" /> Tonton Panduan
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100 mx-3"></div>

          {/* Bansos Info */}
          <div className="group flex items-start gap-3 p-3 hover:bg-orange-50/60 rounded-2xl transition-colors">
            <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl shrink-0 mt-0.5">
              <FaIdCard className="text-sm" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-800">Cek Bantuan Sosial (Bansos) Kemensos</h4>
              <p className="text-xs text-gray-500 mb-2 mt-0.5">Pengecekan data Bansos (PKH, BPNT, dll). Cukup masukkan Provinsi, Kabupaten, Kecamatan, Desa, dan Nama Sesuai KTP beserta Captcha.</p>
              <button 
                onClick={() => setIsBansosModalOpen(true)}
                className="text-xs font-bold text-orange-600 bg-white shadow-sm border border-orange-100 hover:bg-orange-600 hover:text-white px-3 py-1.5 rounded-lg flex items-center transition-all w-fit"
              >
                <FaExternalLinkAlt className="mr-1.5 text-sm" /> Panduan & Cek Bansos
              </button>
            </div>
          </div>

          <div className="h-px bg-gray-100 mx-3"></div>

          {/* Akta & Dukcapil Combined */}
          <div className="group flex items-start gap-3 p-3 hover:bg-emerald-50/60 rounded-2xl transition-colors">
            <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl shrink-0 mt-0.5">
              <FaSync className="text-sm" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-800">Sinkronisasi Dokumen Resmi</h4>
              <p className="text-xs text-gray-600 leading-relaxed mt-1 mb-1">
                Data identitas siswa wajib sama persis antara Akta Kelahiran dan Kartu Keluarga (KK).
              </p>
              <div className="flex flex-wrap gap-2 mt-2.5">
                <button 
                  onClick={() => setIsAktaModalOpen(true)} 
                  className="text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 px-3 py-1.5 rounded-lg flex items-center transition-colors shadow-sm"
                >
                  <FaFileAlt className="mr-1.5" /> Panduan Akta
                </button>
                <button 
                  onClick={() => setIsKkModalOpen(true)} 
                  className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 px-3 py-1.5 rounded-lg flex items-center transition-colors shadow-sm"
                >
                  <FaAddressCard className="mr-1.5" /> Panduan KK
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Bansos */}
      {isBansosModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBansosModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-800 flex items-center">
                <FaIdCard className="text-orange-500 mr-2" /> Panduan Pengecekan Bansos
              </h3>
              <button onClick={() => setIsBansosModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-full">
                <FaTimes />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[75vh] text-sm text-gray-700 space-y-5">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                <h4 className="font-black text-orange-800 mb-3 text-base">Petunjuk Pencarian:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-orange-900/90">
                  <li>Masukkan <strong>NIK</strong> (Nomor Induk Kependudukan) 16 digit sesuai KTP.</li>
                  <li>Ketikkan huruf kode (Captcha) yang tertera dalam kotak.</li>
                  <li>Jika huruf kode kurang jelas, klik ikon putar untuk <i>refresh</i>.</li>
                  <li>Klik tombol <strong>CARI DATA</strong>.</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Keterangan Penting:</h4>
                <ul className="list-disc pl-5 space-y-2 text-xs leading-relaxed text-gray-600">
                  <li><strong>Sumber data:</strong> Data Tunggal Sosial dan Ekonomi Nasional (DTSEN).</li>
                  <li>
                    <strong>Desil:</strong> Kelompok kesejahteraan keluarga yang diukur berdasarkan variabel sosial ekonomi mencakup keterangan individu (pekerjaan, pendidikan), keterangan perumahan (kondisi rumah, daya listrik) dan kepemilikan aset. Terdapat 10 desil yang masing-masing berisi 10% keluarga di Indonesia, desil 1 merupakan keluarga dengan tingkat kesejahteraan 10% terbawah sementara desil 10 merupakan keluarga dengan tingkat kesejahteraan 10% tertingi.
                  </li>
                  <li>
                    Desil bersifat <strong>dinamis</strong>, jika tidak sesuai dapat diperbarui melalui desa/kelurahan dan dinas sosial atau melalui aplikasi cek bansos dengan menyampaikan data sesuai kondisi nyata; selanjutnya desil akan dihitung ulang oleh BPS secara periodik.
                  </li>
                  <li>
                    Desil digunakan untuk penentuan sasaran bantuan sosial. <strong>Desil 1-4 (40% terbawah)</strong> dapat diusulkan sebagai penerima bantuan sosial PKH dan Sembako. <strong>Desil 5</strong> dapat diusulkan sebagai peserta PBI-JK.
                  </li>
                </ul>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100">
                <button onClick={() => setIsBansosModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-200 transition-colors text-center">
                  Tutup Panduan
                </button>
                <a 
                  href="https://cekbansos.kemensos.go.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/30 flex justify-center items-center"
                >
                  Buka Web Cek Bansos <FaExternalLinkAlt className="ml-2 text-xs" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Video Panduan PIP */}
      {isPipModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-0">
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPipModalOpen(false)}></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-800 flex items-center">
                <FaPlayCircle className="text-blue-500 mr-2" /> Panduan Cek PIP Kemdikbud
              </h3>
              <button onClick={() => setIsPipModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-full">
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Video Player */}
              <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-inner mb-6 relative flex items-center justify-center">
                <video 
                  className="w-full h-full object-contain" 
                  controls 
                  controlsList="nodownload"
                  preload="metadata"
                >
                  <source src={pipVideo} type="video/mp4" />
                  Maaf, browser Anda tidak mendukung pemutaran video.
                </video>
              </div>

              {/* Instruksi Tambahan */}
              <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-3 text-sm">Langkah Penting Setelah Membuka Website:</h4>
                <ul className="list-decimal list-inside text-[13px] text-blue-800 space-y-2 ml-1 marker:font-bold">
                  <li>Pilih bagian <strong>"Cari Penerima PIP"</strong> pada layar.</li>
                  <li>Masukkan <strong>NISN</strong>, <strong>NIK</strong>, dan jawab soal perhitungan keamanan dengan benar.</li>
                  <li>Klik tombol <strong>"Cek Penerima PIP"</strong>.</li>
                  <li>Jika data Anda ditemukan, catat/copy <strong>Nomor SK Pemberian</strong> atau <strong>Tahun Penyaluran</strong> yang tertulis di dalam sistem. Data ini yang akan Anda masukkan ke form biodata sekolah.</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end space-x-3">
              <button onClick={() => setIsPipModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-200 transition-colors">
                Batal
              </button>
              <a 
                href="https://pip.kemendikdasmen.go.id/home_v1" 
                target="_blank" 
                rel="noreferrer"
                onClick={() => setIsPipModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all flex items-center"
              >
                Lanjut Buka Web PIP <FaExternalLinkAlt className="ml-2 text-xs" />
              </a>
            </div>
            
          </div>
        </div>
      )}

      {/* Modal Panduan Akta Kelahiran */}
      {isAktaModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAktaModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-800 flex items-center">
                <FaFileAlt className="text-blue-500 mr-2" /> Panduan Akta Kelahiran
              </h3>
              <button onClick={() => setIsAktaModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-full">
                <FaTimes />
              </button>
            </div>

            <div className="p-0 overflow-y-auto max-h-[75vh] bg-gray-50">
              <div className="p-6 bg-white border-b border-gray-100">
                <div className="bg-blue-50/50 rounded-2xl overflow-hidden border border-blue-100 mb-4 shadow-sm">
                  <img src={aktaImage} alt="Panduan Akta Kelahiran" className="w-full object-contain" />
                </div>
                <p className="text-[13px] text-gray-600 mb-3 font-medium">Pengisian data berikut <strong className="text-blue-700">wajib merujuk pada Akta Kelahiran</strong>:</p>
                <ul className="list-disc list-inside text-[13px] text-gray-600 space-y-1.5 ml-2 marker:text-blue-400">
                  <li><strong>Nama Lengkap Siswa</strong> (Sesuai ejaan, tanpa gelar tambahan)</li>
                  <li><strong>Tempat & Tanggal Lahir</strong></li>
                  <li><strong>Nama Lengkap Ibu Kandung</strong></li>
                  <li><strong>Nomor Akta Kelahiran</strong></li>
                </ul>
              </div>

              <div className="p-6 bg-amber-50/80">
                <h4 className="font-bold text-amber-900 mb-2 text-sm flex items-center">
                  <FaSync className="mr-2 text-amber-500" /> Wajib Sinkron dengan KK
                </h4>
                <p className="text-[12px] text-amber-800 leading-relaxed">
                  Data <strong>Nama</strong> di atas harus sama persis dengan yang tertera di Kartu Keluarga (KK). Jika berbeda, segera lakukan perbaikan di Dukcapil setempat.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end">
              <button 
                onClick={() => setIsAktaModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Panduan Kartu Keluarga (KK) */}
      {isKkModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-0">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsKkModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-black text-gray-800 flex items-center">
                <FaAddressCard className="text-emerald-500 mr-2" /> Panduan Kartu Keluarga
              </h3>
              <button onClick={() => setIsKkModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-full">
                <FaTimes />
              </button>
            </div>

            <div className="p-0 overflow-y-auto max-h-[75vh] bg-gray-50">
              <div className="p-6 bg-white border-b border-gray-100">
                <div className="bg-emerald-50/50 rounded-2xl overflow-hidden border border-emerald-100 mb-4 shadow-sm">
                  <img src={kkImage} alt="Panduan Kartu Keluarga" className="w-full object-contain" />
                </div>
                <p className="text-[13px] text-gray-600 mb-3 font-medium">Pengisian data berikut <strong className="text-emerald-700">wajib diambil dari Kartu Keluarga</strong>:</p>
                <ul className="list-disc list-inside text-[13px] text-gray-600 space-y-1.5 ml-2 marker:text-emerald-400 grid grid-cols-1 gap-x-4">
                  <li><strong>Nomor Kartu Keluarga (KK)</strong></li>
                  <li><strong>Alamat Lengkap Tempat Tinggal</strong></li>
                  <li><strong>NIK Siswa & NIK Orang Tua</strong></li>
                  <li><strong>Tahun Lahir Orang Tua</strong></li>
                  <li><strong>Pendidikan Terakhir & Pekerjaan Orang Tua</strong></li>
                </ul>
              </div>

              <div className="p-6 bg-amber-50/80">
                <h4 className="font-bold text-amber-900 mb-2 text-sm flex items-center">
                  <FaSync className="mr-2 text-amber-500" /> Wajib Sinkron dengan Akta
                </h4>
                <p className="text-[12px] text-amber-800 leading-relaxed">
                  Data <strong>Nama dan NIK</strong> di KK harus sama persis dengan Akta Kelahiran dan KTP. Dapodik tersinkronisasi langsung dengan pusat Dukcapil.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-white flex justify-end">
              <button 
                onClick={() => setIsKkModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20 transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Overview;
