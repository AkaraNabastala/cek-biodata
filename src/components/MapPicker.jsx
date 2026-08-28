import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const schoolCoords = { lat: -7.372770449094243, lng: 108.80655218471271 };

const schoolIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
};

const MapPicker = ({ initialLat, initialLng, transportMode, onLocationChange }) => {
  const [mapKey] = useState(() => Math.random().toString(36).substring(7));
  const [position, setPosition] = useState(
    initialLat && initialLng ? { lat: parseFloat(initialLat), lng: parseFloat(initialLng) } : null
  );

  useEffect(() => {
    if (initialLat && initialLng) {
      setPosition({ lat: parseFloat(initialLat), lng: parseFloat(initialLng) });
    }
  }, [initialLat, initialLng]);
  
  const [distance, setDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!position) return;
      
      setIsLoadingRoute(true);
      
      // Tentukan profil OSRM berdasarkan alat transportasi
      let profile = 'driving'; // Default: Kendaraan Pribadi, Umum, Jemputan
      if (transportMode === 'Jalan Kaki') {
        profile = 'walking';
      } else if (transportMode === 'Sepeda') {
        profile = 'cycling';
      }
      
      try {
        // Format OSRM: lon,lat;lon,lat
        const coords = `${position.lng},${position.lat};${schoolCoords.lng},${schoolCoords.lat}`;
        const response = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=false`);
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distKm = (route.distance / 1000).toFixed(2); // meters to km
          const timeMin = Math.round(route.duration / 60); // seconds to minutes
          
          setDistance(distKm);
          setEstimatedTime(timeMin);
          
          onLocationChange(position.lat.toFixed(6), position.lng.toFixed(6), distKm, timeMin);
        }
      } catch (error) {
        console.error("Gagal mengambil rute jalan:", error);
      } finally {
        setIsLoadingRoute(false);
      }
    };
    
    // Memberikan sedikit jeda (debounce) agar tidak spam API saat transportMode diubah cepat
    const timeoutId = setTimeout(() => {
      fetchRoute();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [position, transportMode]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          alert('Gagal mendeteksi lokasi. Pastikan GPS aktif dan Anda memberikan izin akses lokasi.');
        }
      );
    } else {
      alert('Browser Anda tidak mendukung deteksi lokasi.');
    }
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
        <div>
          <p className="text-sm font-semibold text-green-800 flex items-center">
            Jarak: {position ? (isLoadingRoute ? '...' : `${distance} KM`) : '-'}
          </p>
          <p className="text-xs text-green-600">
            Estimasi Waktu: {position ? (isLoadingRoute ? '...' : `${estimatedTime} Menit`) : '-'} ({transportMode || 'Belum dipilih'})
          </p>
        </div>
        <button
          type="button"
          onClick={handleGetLocation}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          📍 Deteksi Lokasi Saya
        </button>
      </div>

      <div className="h-64 w-full rounded-lg border border-gray-300 overflow-hidden relative z-0">
        <MapContainer 
          key={mapKey}
          center={position || schoolCoords} 
          zoom={position ? 15 : 13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={schoolCoords} icon={schoolIcon}>
            {/* School Marker (Green) */}
          </Marker>
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
        <div className="absolute top-2 left-2 z-[1000] bg-white/90 p-2 rounded shadow-md text-xs pointer-events-none">
          <p>🟢 Sekolah</p>
          <p>🔵 Rumah Siswa (Klik peta)</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 italic">
        * Geser dan klik pada peta untuk menentukan koordinat rumah dengan tepat.
      </p>
    </div>
  );
};

export default MapPicker;
