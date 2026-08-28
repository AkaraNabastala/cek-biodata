import React, { useState, useEffect } from 'react';
import { FaSave, FaEdit, FaTimes, FaPlus, FaLock, FaMale, FaFemale } from 'react-icons/fa';
import MapPicker from './MapPicker';
import RegionCascade from './RegionCascade';
import { formatDate } from '../utils/formatters';

// Dapodik Standard Options
const optAgama = ["Islam", "Kristen", "Katholik", "Hindu", "Budha", "Konghucu", "Kepercayaan Kepada Tuhan YME", "Lainnya"];
const optPekerjaan = ["Tidak Bekerja", "Nelayan", "Petani", "Peternak", "PNS/TNI/POLRI", "Karyawan Swasta", "Pedagang Kecil", "Pedagang Besar", "Wiraswasta", "Wirausaha", "Buruh", "Pensiunan", "Tenaga Kerja Indonesia", "Karyawan BUMN", "Aparatur Sipil Negara", "TNI", "Perdagangan", "Tidak dapat diterapkan", "Sudah Meninggal", "Lainnya"];
const optPendidikan = ["D1", "D2", "D3", "D4", "Informal", "Lainnya", "Non Formal", "Paket A", "Paket B", "Paket C", "PAUD", "Profesi", "Putus SD", "S1", "S2", "S2 Terapan", "S3", "S3 Terapan", "SD/Sederajat", "SMP/Sederajat", "SMA/Sederajat", "Sp-1", "Sp-2", "Tidak Sekolah", "TK/Sederajat"];
const optPenghasilan = ["Tidak Berpenghasilan", "< Rp 500.000", "Rp 500.000 - Rp 999.999", "Rp 1.000.000 - Rp 1.999.999", "Rp 2.000.000 - Rp 4.999.999", "Rp 5.000.000 - Rp 20.000.000"];
const optTransportasi = ["Jalan Kaki", "Angkutan Umum", "Mobil/Bus Antar Jemput", "Kereta Api", "Ojek", "Andong/Becak/Dokar", "Perahu Penyebrangan/Rakit/Getek", "Sepeda", "Sepeda Motor", "Mobil Pribadi", "Lainnya"];
const optJenisTinggal = ["Bersama Orang Tua", "Wali", "Kost", "Asrama", "Panti Asuhan", "Pesantren", "Lainnya"];
const optKebutuhanKhusus = ["Netra (A)", "Rungu (B)", "Grahita Ringan (C)", "Grahita Sedang (C1)", "Daksa Ringan (D)", "Daksa Sedang (D1)", "Laras (E)", "Wicara (F)", "Tuna Ganda (G)", "Hiperaktif (H)", "Cerdas Istimewa (i)", "Bakat Istimewa (J)", "Kesulitan Belajar (K)", "Narkoba (N)", "Indigo (O)", "Down Syndrome (P)", "Autis (Q)"];

const schema = {
  biodata: [
    { name: 'Nama', label: 'Nama Lengkap', type: 'text', readOnly: false },
    { name: 'JK', label: 'Jenis Kelamin', type: 'select', options: ['L', 'P'] },
    { name: 'Tempat Lahir', label: 'Tempat Lahir', type: 'text' },
    { name: 'Tanggal Lahir', label: 'Tanggal Lahir', type: 'date' },
    { name: 'NIK', label: 'NIK (No Induk Kependudukan)', type: 'text' },
    { name: 'Agama', label: 'Agama', type: 'select', options: optAgama },
    { name: 'Anak ke-berapa', label: 'Anak Ke-berapa', type: 'text' },
    { name: 'Kebutuhan Khusus', label: 'Berkebutuhan Khusus', type: 'multi_select', options: optKebutuhanKhusus },
    { name: 'No Registrasi Akta Lahir', label: 'No Akta Lahir', type: 'text' }
  ],
  alamat: [
    { name: 'Alamat', label: 'Alamat Jalan', type: 'text' },
    { name: 'RT', label: 'RT', type: 'text' },
    { name: 'RW', label: 'RW', type: 'text' },
    { name: 'Dusun', label: 'Dusun / Kampung', type: 'text' },
    { name: 'REGION_CASCADE', type: 'region_cascade', group: 'Wilayah Administratif' },
    { name: 'Provinsi', type: 'hidden' },
    { name: 'Kabupaten', type: 'hidden' },
    { name: 'Kecamatan', type: 'hidden' },
    { name: 'Kelurahan', type: 'hidden' },
    { name: 'Kode Pos', label: 'Kode Pos', type: 'text' },
    { name: 'Jenis Tinggal', label: 'Jenis Tempat Tinggal', type: 'select', options: optJenisTinggal },
    { name: 'Alat Transportasi', label: 'Alat Transportasi ke Sekolah', type: 'select', options: optTransportasi },
    { name: 'Telepon', label: 'No Telepon Rumah', type: 'text' },
    { name: 'HP', label: 'No HP / WhatsApp Siswa', type: 'text' },
    { name: 'HP Orang Tua', label: 'No HP / WhatsApp Orang Tua', type: 'text' },
    { name: 'E-Mail', label: 'Email Aktif', type: 'text' },
    // Map fields
    { name: 'MAP_SECTION', type: 'map', group: 'Koordinat & Jarak' },
    { name: 'Lintang', label: 'Lintang (Latitude)', type: 'text', group: 'Koordinat & Jarak', readOnly: true },
    { name: 'Bujur', label: 'Bujur (Longitude)', type: 'text', group: 'Koordinat & Jarak', readOnly: true },
    { name: 'Jarak Rumah ke Sekolah (KM)', label: 'Jarak ke Sekolah (KM)', type: 'text', group: 'Koordinat & Jarak', readOnly: true },
    { name: 'Waktu Tempuh', label: 'Estimasi Waktu Tempuh (Menit)', type: 'text', group: 'Koordinat & Jarak', readOnly: true },
  ],
  orangtua: [
    { name: 'Status Ayah', label: 'Status Ayah', type: 'select', options: ['Masih Hidup', 'Sudah Wafat'], group: 'Data Ayah' },
    { name: 'Nama ayah', label: 'Nama Ayah', type: 'text', group: 'Data Ayah' },
    { name: 'NIK ayah', label: 'NIK Ayah', type: 'text', group: 'Data Ayah' },
    { name: 'Tahun Lahir ayah', label: 'Tahun Lahir Ayah', type: 'text', group: 'Data Ayah' },
    { name: 'Jenjang Pendidikan ayah', label: 'Pendidikan Ayah', type: 'select', options: optPendidikan, group: 'Data Ayah' },
    { name: 'Pekerjaanayah', label: 'Pekerjaan Ayah', type: 'select', options: optPekerjaan, group: 'Data Ayah' },
    { name: 'Penghasilan ayah', label: 'Penghasilan Ayah', type: 'select', options: optPenghasilan, group: 'Data Ayah' },
    { name: 'Kebutuhan Khusus Ayah', label: 'Berkebutuhan Khusus Ayah', type: 'multi_select', options: optKebutuhanKhusus, group: 'Data Ayah' },
    
    { name: 'Status Ibu', label: 'Status Ibu', type: 'select', options: ['Masih Hidup', 'Sudah Wafat'], group: 'Data Ibu' },
    { name: 'Nama ibu', label: 'Nama Ibu', type: 'text', group: 'Data Ibu' },
    { name: 'NIK ibu', label: 'NIK Ibu', type: 'text', group: 'Data Ibu' },
    { name: 'Tahun Lahir ibu', label: 'Tahun Lahir Ibu', type: 'text', group: 'Data Ibu' },
    { name: 'Jenjang Pendidikan ibu', label: 'Pendidikan Ibu', type: 'select', options: optPendidikan, group: 'Data Ibu' },
    { name: 'Pekerjaanibu', label: 'Pekerjaan Ibu', type: 'select', options: optPekerjaan, group: 'Data Ibu' },
    { name: 'Penghasilan ibu', label: 'Penghasilan Ibu', type: 'select', options: optPenghasilan, group: 'Data Ibu' },
    { name: 'Kebutuhan Khusus Ibu', label: 'Berkebutuhan Khusus Ibu', type: 'multi_select', options: optKebutuhanKhusus, group: 'Data Ibu' },
    
    { name: 'Nama wali', label: 'Nama Wali', type: 'text', group: 'Data Wali (Jika Ada)' },
    { name: 'NIK wali', label: 'NIK Wali', type: 'text', group: 'Data Wali (Jika Ada)' },
    { name: 'Tahun Lahir wali', label: 'Tahun Lahir Wali', type: 'text', group: 'Data Wali (Jika Ada)' },
    { name: 'Jenjang Pendidikan wali', label: 'Pendidikan Wali', type: 'select', options: optPendidikan, group: 'Data Wali (Jika Ada)' },
    { name: 'Pekerjaanwali', label: 'Pekerjaan Wali', type: 'select', options: optPekerjaan, group: 'Data Wali (Jika Ada)' },
    { name: 'Penghasilan wali', label: 'Penghasilan Wali', type: 'select', options: optPenghasilan, group: 'Data Wali (Jika Ada)' },
    { name: 'Kebutuhan Khusus Wali', label: 'Berkebutuhan Khusus Wali', type: 'multi_select', options: optKebutuhanKhusus, group: 'Data Wali (Jika Ada)' },
    { name: 'No KK', label: 'Nomor Kartu Keluarga (KK)', type: 'text', group: 'Lainnya' },
    { name: 'Jml. Saudara Kandung', label: 'Jumlah Saudara Kandung', type: 'text', group: 'Lainnya' }
  ],
  akademik: [
    { name: 'NIPD', label: 'NIPD (Nomor Induk Peserta Didik)', type: 'text', readOnly: true },
    { name: 'NISN', label: 'NISN', type: 'text', readOnly: true },
    { name: 'Rombel Saat Ini', label: 'Rombongan Belajar (Kelas)', type: 'text', readOnly: true },
    { name: 'Sekolah Asal', label: 'Sekolah Asal (SD/MI)', type: 'text' },
    { name: 'SKHUN', label: 'Nomor SKHUN', type: 'text' },
    { name: 'No Peserta Ujian Nasional', label: 'No Peserta UN', type: 'text' },
    { name: 'No Seri Ijazah', label: 'No Seri Ijazah', type: 'text' }
  ],
  kesejahteraan: [
    { name: 'Penerima KPS', label: 'Penerima KPS (Ya/Tidak)', type: 'select', options: ['Ya', 'Tidak'], group: 'Kartu Perlindungan Sosial (KPS)' },
    { name: 'No. KPS', label: 'Nomor KPS', type: 'text', group: 'Kartu Perlindungan Sosial (KPS)' },
    { name: 'Nama di KPS', label: 'Nama tertera di KPS', type: 'text', group: 'Kartu Perlindungan Sosial (KPS)' },
    
    { name: 'Penerima KIP', label: 'Penerima KIP (Ya/Tidak)', type: 'select', options: ['Ya', 'Tidak'], group: 'Kartu Indonesia Pintar (KIP)' },
    { name: 'Nomor KIP', label: 'Nomor KIP', type: 'text', group: 'Kartu Indonesia Pintar (KIP)' },
    { name: 'Nama di KIP', label: 'Nama tertera di KIP', type: 'text', group: 'Kartu Indonesia Pintar (KIP)' },
    
    { name: 'Penerima KKS', label: 'Penerima KKS (Ya/Tidak)', type: 'select', options: ['Ya', 'Tidak'], group: 'Kartu Keluarga Sejahtera (KKS)' },
    { name: 'Nomor KKS', label: 'Nomor KKS', type: 'text', group: 'Kartu Keluarga Sejahtera (KKS)' },
    { name: 'Nama di KKS', label: 'Nama tertera di KKS', type: 'text', group: 'Kartu Keluarga Sejahtera (KKS)' },
    
    { name: 'Layak PIP (usulan dari sekolah)', label: 'Layak PIP (Ya/Tidak)', type: 'select', options: ['Ya', 'Tidak'], group: 'Program Indonesia Pintar (PIP)' },
    { name: 'Alasan Layak PIP', label: 'Alasan Layak PIP', type: 'text', group: 'Program Indonesia Pintar (PIP)' },
    
    { name: 'Bank', label: 'Nama Bank', type: 'text', group: 'Rekening Bank' },
    { name: 'Nomor Rekening Bank', label: 'Nomor Rekening', type: 'text', group: 'Rekening Bank' },
    { name: 'Rekening Atas Nama', label: 'Rekening Atas Nama', type: 'text', group: 'Rekening Bank' },
    
    { name: 'CUSTOM_KARTU', type: 'custom_kartu', group: 'Tambah Kartu Kesejahteraan Lain (KIS, dll)' }
  ],
  periodik: [
    { name: 'Tinggi Badan', label: 'Tinggi Badan (cm)', type: 'text' },
    { name: 'Berat Badan', label: 'Berat Badan (kg)', type: 'text' },
    { name: 'Lingkar Kepala', label: 'Lingkar Kepala (cm)', type: 'text' }
  ]
};

const MultiSelectDropdown = ({ field, value, isEditing, setFormData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isEditing) {
    return (
      <div className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 text-gray-500 rounded-lg cursor-not-allowed mt-1">
        {value || 'Tidak Ada'}
      </div>
    );
  }

  return (
    <div className="relative mt-1" ref={dropdownRef}>
      <div 
        className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-300 text-gray-800 rounded-lg cursor-pointer flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{value || 'Tidak Ada (Kosong)'}</span>
        <span className="text-gray-400 text-xs">▼</span>
      </div>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="p-2">
            <label className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
              <input
                type="checkbox"
                checked={!value || value === 'Tidak Ada' || value.trim() === ''}
                onChange={(e) => {
                  if (e.target.checked) setFormData(prev => ({ ...prev, [field.name]: '' }));
                }}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
              />
              <span className="font-semibold text-gray-500">Tidak Ada (Kosong)</span>
            </label>
            {field.options.map(opt => {
              const isChecked = value.includes(opt);
              return (
                <label key={opt} className="flex items-center space-x-3 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      let currentVals = value ? value.split(',').map(v => v.trim()).filter(v => v !== 'Tidak Ada' && v !== '') : [];
                      if (e.target.checked) {
                        currentVals.push(opt);
                      } else {
                        currentVals = currentVals.filter(v => v !== opt);
                      }
                      setFormData(prev => ({ ...prev, [field.name]: currentVals.join(', ') }));
                    }}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300 cursor-pointer"
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const DataForm = ({ user, activeTab, onSave, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [customKartu, setCustomKartu] = useState([{ jenis: '', nomor: '', nama: '' }]);
  const [hasWali, setHasWali] = useState(false);

  const activeSchema = schema[activeTab] || [];

  // Reset form data when tab changes or editing is toggled off
  useEffect(() => {
    if (!isEditing) {
      const initialData = {};
      activeSchema.forEach(field => {
        if (field.type !== 'map' && field.type !== 'custom_kartu' && field.type !== 'region_cascade') {
          // Jangan format tanggal lahir saat load form, biarkan asli (YYYY-MM-DD) agar bisa masuk ke input type="date"
          initialData[field.name] = user[field.name] || '';
        }
      });
      setFormData(initialData);
      setCustomKartu([{ jenis: '', nomor: '', nama: '' }]);
      setHasWali(!!user?.['Nama wali'] || !!user?.['NIK wali']);
    }
  }, [activeTab, isEditing, user, activeSchema]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      if (name === 'Status Ayah' && value === 'Sudah Wafat') {
        updated['Jenjang Pendidikan ayah'] = 'Tidak Sekolah';
        updated['Pekerjaanayah'] = 'Sudah Meninggal';
        updated['Penghasilan ayah'] = 'Tidak Berpenghasilan';
        updated['Kebutuhan Khusus Ayah'] = '';
      }
      if (name === 'Status Ibu' && value === 'Sudah Wafat') {
        updated['Jenjang Pendidikan ibu'] = 'Tidak Sekolah';
        updated['Pekerjaanibu'] = 'Sudah Meninggal';
        updated['Penghasilan ibu'] = 'Tidak Berpenghasilan';
        updated['Kebutuhan Khusus Ibu'] = '';
      }
      
      return updated;
    });
  };
  
  const handleLocationChange = (lat, lng, dist, timeMin) => {
    setFormData(prev => ({
      ...prev,
      'Lintang': lat,
      'Bujur': lng,
      'Jarak Rumah ke Sekolah (KM)': dist,
      'Waktu Tempuh': timeMin
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Gabungkan data custom kartu jika ada isinya
    const submitData = { ...formData };
    const validCards = customKartu.filter(k => k.jenis && k.nomor);
    if (validCards.length > 0) {
      submitData['_custom_kartu'] = validCards;
    }
    
    onSave(submitData, activeTab);
    setIsEditing(false);
  };

  // Organize fields by group if applicable
  const groupedFields = activeSchema.reduce((acc, field) => {
    // Sembunyikan field yang tidak perlu jika statusnya Wafat
    if (field.group === 'Data Ayah' && formData['Status Ayah'] === 'Sudah Wafat') {
      if (['Jenjang Pendidikan ayah', 'Pekerjaanayah', 'Penghasilan ayah', 'Kebutuhan Khusus Ayah'].includes(field.name)) {
        return acc;
      }
    }
    if (field.group === 'Data Ibu' && formData['Status Ibu'] === 'Sudah Wafat') {
      if (['Jenjang Pendidikan ibu', 'Pekerjaanibu', 'Penghasilan ibu', 'Kebutuhan Khusus Ibu'].includes(field.name)) {
        return acc;
      }
    }
    
    const group = field.group || 'General';
    if (!acc[group]) acc[group] = [];
    acc[group].push(field);
    return acc;
  }, {});

  const renderField = (field) => {
    if (field.type === 'hidden') return null;
    
    if (field.type === 'region_cascade') {
      return (
        <RegionCascade 
          key="region_cascade"
          isEditing={isEditing}
          provinsi={formData['Provinsi'] || ''}
          kabupaten={formData['Kabupaten'] || ''}
          kecamatan={formData['Kecamatan'] || ''}
          desa={formData['Kelurahan'] || ''}
          onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
        />
      );
    }

    if (field.type === 'map') {
      return (
        <div key={`map_section_${activeTab}`} className="col-span-1 md:col-span-2 mb-4">
          <MapPicker 
            initialLat={formData['Lintang']} 
            initialLng={formData['Bujur']} 
            transportMode={formData['Alat Transportasi']}
            onLocationChange={handleLocationChange}
          />
        </div>
      );
    }
    
    if (field.type === 'custom_kartu') {
      return (
        <div key="custom_kartu" className="col-span-1 md:col-span-2 bg-yellow-50 p-4 rounded-lg border border-yellow-200 mt-2">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-yellow-800 italic m-0">
              * Jika Anda memiliki kartu kesejahteraan lain (seperti KIS, dll), silakan tambahkan di sini.
            </p>
            {isEditing && (
              <button 
                type="button" 
                onClick={() => setCustomKartu([...customKartu, {jenis: '', nomor: '', nama: ''}])} 
                className="text-xs bg-yellow-200 text-yellow-800 px-3 py-1.5 rounded font-bold hover:bg-yellow-300 flex items-center gap-1"
              >
                <FaPlus size={10} /> Tambah Kartu
              </button>
            )}
          </div>
          <div className="space-y-4">
            {customKartu.map((kartu, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-4 items-end bg-white/50 p-3 rounded border border-yellow-100">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Jenis Kartu {index + 1}</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={kartu.jenis}
                    onChange={e => {
                      const newKartu = [...customKartu];
                      newKartu[index].jenis = e.target.value;
                      setCustomKartu(newKartu);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-white disabled:bg-gray-100" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Nomor Kartu</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={kartu.nomor}
                    onChange={e => {
                      const newKartu = [...customKartu];
                      newKartu[index].nomor = e.target.value;
                      setCustomKartu(newKartu);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-white disabled:bg-gray-100" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Nama di Kartu</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={kartu.nama}
                    onChange={e => {
                      const newKartu = [...customKartu];
                      newKartu[index].nama = e.target.value;
                      setCustomKartu(newKartu);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 bg-white disabled:bg-gray-100" 
                  />
                </div>
                {isEditing && customKartu.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => {
                      const newKartu = [...customKartu];
                      newKartu.splice(index, 1);
                      setCustomKartu(newKartu);
                    }} 
                    className="mb-1 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded flex justify-center items-center"
                    title="Hapus Kartu"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    const value = formData[field.name] || '';
    const isReadOnly = field.readOnly;
    const isNikOrKk = field.name.includes('NIK') || field.name === 'No. KK';

    return (
      <div key={field.name} className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-1.5 flex justify-between items-center">
          <span>
            {field.label}
            {field.readOnly && (
              <span className="ml-2 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Terkunci
              </span>
            )}
          </span>
          {field.note && <span className="text-gray-400 text-xs italic font-normal">{field.note}</span>}
        </label>
        
        {field.name === 'JK' && !field.readOnly ? (
          <div className="flex gap-4">
            <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors ${value === 'L' ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'} ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}>
              <input type="radio" name={field.name} value="L" checked={value === 'L'} onChange={handleChange} disabled={!isEditing} className="hidden" />
              <FaMale className="text-lg" /> Laki-laki
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 p-2.5 border rounded-lg cursor-pointer transition-colors ${value === 'P' ? 'bg-pink-50 border-pink-500 text-pink-700 font-bold shadow-sm' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'} ${!isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}>
              <input type="radio" name={field.name} value="P" checked={value === 'P'} onChange={handleChange} disabled={!isEditing} className="hidden" />
              <FaFemale className="text-lg" /> Perempuan
            </label>
          </div>
        ) : field.type === 'multi_select' && !field.readOnly ? (
          <MultiSelectDropdown field={field} value={value} isEditing={isEditing} setFormData={setFormData} />
        ) : field.type === 'select' && !field.readOnly ? (
          <select
            name={field.name}
            value={value}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
              !isEditing 
                ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed appearance-none' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="">-- Pilih --</option>
            {field.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : field.type === 'date' && isEditing && !field.readOnly ? (
          <input
            type="date"
            name={field.name}
            value={value}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors bg-white border-gray-300 text-gray-800`}
          />
        ) : (
          <input
            type="text"
            name={field.name}
            value={(field.type === 'date' && value && !isEditing) ? formatDate(value) : value}
            onChange={handleChange}
            readOnly={field.readOnly || !isEditing}
            maxLength={isNikOrKk ? 16 : undefined}
            onKeyPress={(e) => {
              if (isNikOrKk) {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }
            }}
            className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
              (field.readOnly || !isEditing) 
                ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-visible mb-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 md:p-6 border-b border-gray-100 bg-gray-50/50">
        <div>
          <h2 className="text-lg font-bold text-gray-800 capitalize flex items-center">
            <div className="w-1.5 h-5 bg-blue-500 rounded-full mr-3"></div>
            {activeTab === 'biodata' ? 'Biodata Siswa' : 
             activeTab === 'alamat' ? 'Alamat & Peta Lokasi' : 
             activeTab === 'orangtua' ? 'Identitas Orang Tua / Wali' : 
             activeTab === 'akademik' ? 'Data Akademik' : 
             activeTab === 'periodik' ? 'Data Fisik Periodik' : 'Kesejahteraan'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 ml-4">
            {!isEditing ? 'Status: Terkunci (Mode Lihat)' : 'Status: Mode Edit Aktif'}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 w-full sm:w-auto">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center w-full sm:w-auto text-sm bg-white border border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <FaEdit className="mr-2 text-blue-500" /> Edit Data
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center justify-center w-full sm:w-auto text-sm bg-white border border-gray-300 text-red-600 hover:bg-red-50 hover:border-red-200 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
            >
              <FaTimes className="mr-2" /> Batal Edit
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 md:p-6">
        {Object.keys(groupedFields).map((groupName, index) => {
          const isWaliGroup = groupName === 'Data Wali (Jika Ada)';
          
          if (isWaliGroup && !hasWali && !isEditing) return null;

          return (
            <div key={groupName} className={`${index > 0 ? 'mt-8 pt-6 border-t border-gray-100' : ''}`}>
              {groupName !== 'General' && (
                <h3 className="text-sm font-bold text-gray-800 mb-4">{groupName}</h3>
              )}
              
              {isWaliGroup && isEditing && (
                <div className="flex items-center justify-between mb-5 bg-gray-50 p-4 rounded-xl border border-gray-200 max-w-sm">
                  <span className="text-sm font-medium text-gray-700">Siswa memiliki wali?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={hasWali} 
                      onChange={() => setHasWali(!hasWali)} 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>
              )}

              {(!isWaliGroup || hasWali) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {groupedFields[groupName].map(renderField)}
                </div>
              )}
            </div>
          );
        })}

        {isEditing && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className={`flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors w-full sm:w-auto ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menyimpan Data...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default DataForm;
