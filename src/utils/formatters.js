export const formatDate = (isoString) => {
  if (!isoString) return '';
  
  // Jika formatnya bukan string ISO atau sudah format pendek, kembalikan apa adanya
  if (typeof isoString !== 'string' || !isoString.includes('T')) {
    return isoString; 
  }

  try {
    const date = new Date(isoString);
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  } catch (e) {
    return isoString;
  }
};
