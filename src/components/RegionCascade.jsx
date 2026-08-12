import React, { useState, useEffect } from 'react';

const RegionCascade = ({ isEditing, provinsi, kabupaten, kecamatan, desa, onChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [loading, setLoading] = useState('');

  // Fetch provinces on mount
  useEffect(() => {
    if (!isEditing) return;
    const fetchProv = async () => {
      setLoading('provinsi');
      try {
        const res = await fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
        const data = await res.json();
        setProvinces(data);
      } catch (err) {
        console.error("Gagal memuat provinsi", err);
      }
      setLoading('');
    };
    fetchProv();
  }, [isEditing]);

  // When provinces load and we have an initial provinsi name, fetch regencies
  useEffect(() => {
    if (!isEditing || !provinsi || provinces.length === 0) return;
    const prov = provinces.find(p => p.name === provinsi);
    if (prov) {
      const fetchReg = async () => {
        setLoading('kabupaten');
        try {
          const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${prov.id}.json`);
          const data = await res.json();
          setRegencies(data);
        } catch (err) {
          console.error("Gagal memuat kabupaten", err);
        }
        setLoading('');
      };
      fetchReg();
    } else {
      setRegencies([]);
      setDistricts([]);
      setVillages([]);
    }
  }, [provinsi, provinces, isEditing]);

  // When regencies load and we have an initial kabupaten name, fetch districts
  useEffect(() => {
    if (!isEditing || !kabupaten || regencies.length === 0) return;
    const reg = regencies.find(r => r.name === kabupaten);
    if (reg) {
      const fetchDist = async () => {
        setLoading('kecamatan');
        try {
          const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${reg.id}.json`);
          const data = await res.json();
          setDistricts(data);
        } catch (err) {
          console.error("Gagal memuat kecamatan", err);
        }
        setLoading('');
      };
      fetchDist();
    } else {
      setDistricts([]);
      setVillages([]);
    }
  }, [kabupaten, regencies, isEditing]);

  // When districts load and we have an initial kecamatan name, fetch villages
  useEffect(() => {
    if (!isEditing || !kecamatan || districts.length === 0) return;
    const dist = districts.find(d => d.name === kecamatan);
    if (dist) {
      const fetchVill = async () => {
        setLoading('desa');
        try {
          const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${dist.id}.json`);
          const data = await res.json();
          setVillages(data);
        } catch (err) {
          console.error("Gagal memuat desa", err);
        }
        setLoading('');
      };
      fetchVill();
    } else {
      setVillages([]);
    }
  }, [kecamatan, districts, isEditing]);

  const handleProvChange = (e) => {
    const val = e.target.value;
    onChange({ Provinsi: val, Kabupaten: '', Kecamatan: '', Kelurahan: '' });
  };

  const handleRegChange = (e) => {
    const val = e.target.value;
    onChange({ Kabupaten: val, Kecamatan: '', Kelurahan: '' });
  };

  const handleDistChange = (e) => {
    const val = e.target.value;
    onChange({ Kecamatan: val, Kelurahan: '' });
  };

  const handleVillChange = (e) => {
    const val = e.target.value;
    onChange({ Kelurahan: val });
  };

  const renderSelect = (label, name, value, options, onChangeHandler, isLoading, placeholder) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-1.5 flex justify-between items-center">
        <span>{label}</span>
        {isLoading && <span className="text-[10px] text-blue-500 italic">Memuat...</span>}
      </label>
      <select
        value={value}
        onChange={onChangeHandler}
        disabled={!isEditing || isLoading || (options.length === 0 && !value && isEditing)}
        className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors ${
          !isEditing 
            ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed appearance-none' 
            : 'bg-white border-gray-300 text-gray-800 cursor-pointer'
        }`}
      >
        <option value="">{placeholder}</option>
        {!isEditing && value && <option value={value}>{value}</option>}
        {isEditing && options.map(opt => (
          <option key={opt.id} value={opt.name}>{opt.name}</option>
        ))}
        {isEditing && options.length === 0 && value && (
          <option value={value}>{value}</option>
        )}
      </select>
    </div>
  );

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-blue-50/50 border border-blue-100 rounded-xl">
        {renderSelect('Provinsi', 'Provinsi', provinsi, provinces, handleProvChange, loading === 'provinsi', '-- Pilih Provinsi --')}
        {renderSelect('Kabupaten / Kota', 'Kabupaten', kabupaten, regencies, handleRegChange, loading === 'kabupaten', '-- Pilih Kabupaten/Kota --')}
        {renderSelect('Kecamatan', 'Kecamatan', kecamatan, districts, handleDistChange, loading === 'kecamatan', '-- Pilih Kecamatan --')}
        {renderSelect('Desa / Kelurahan', 'Kelurahan', desa, villages, handleVillChange, loading === 'desa', '-- Pilih Desa/Kelurahan --')}
      </div>
    </div>
  );
};

export default RegionCascade;
