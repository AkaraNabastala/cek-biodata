const GAS_URL = "https://script.google.com/macros/s/AKfycbxJ54zWbzSBUuVH8j3F4cqv1BakR252vRAnPtfbrV-clx9tXgUUnZCLDN4OrkHBk-s/exec";

export const loginStudent = async (nipd, nisn) => {
  if (!GAS_URL) {
    throw new Error("URL API (Google Apps Script) belum diatur di .env");
  }
  
  try {
    const response = await fetch(`${GAS_URL}?action=login&nipd=${nipd}&nisn=${nisn}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during login API call:", error);
    throw new Error("Terjadi kesalahan jaringan. Silakan coba lagi.");
  }
};

export const updateStudentData = async (nipd, nisn, updatedData, changeLog, activityMessage) => {
  if (!GAS_URL) {
    throw new Error("URL API (Google Apps Script) belum diatur di .env");
  }

  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      // Menggunakan mode no-cors terkadang diperlukan untuk GAS POST jika tidak setup CORS dengan benar di GAS,
      // tapi kita asumsikan GAS diatur dengan ContentService.createTextOutput dan doPost yang me-return JSON dengan header CORS.
      // Jika mode no-cors dipakai, kita tidak bisa membaca response JSON.
      // Mari asumsikan GAS sudah diatur me-return JSON dengan CORS header.
      body: JSON.stringify({
        action: "update",
        nipd: nipd,
        nisn: nisn,
        data: updatedData,
        changeLog: changeLog, // Array ringkasan perubahan untuk Sheet 2
        activityMessage: activityMessage // Pesan deskripsi log aktivitas
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during update API call:", error);
    // Fallback jika CORS error saat POST tapi data masuk
    throw new Error("Terjadi kesalahan saat menyimpan data. Hubungi admin jika masalah berlanjut.");
  }
};
