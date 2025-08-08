import type { NextApiRequest, NextApiResponse } from 'next';

const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME, BRANCH, JSON_FILE_PATH, DATA_STATIS_QRIS } = process.env;

interface DataEntry {
  penjual: string;
  jenis: "produk" | "jasa";
  tanggal: string;
  nama: string;
  email: string;
  pesan: string;
  nama_transaksi: string;
  harga_transaksi: string;
  metode_pembayaran_transaksi: string;
  status_pembayaran_transaksi: string;
  url_pambayaran: string;
  kedaluwarsa: string;
}

interface SemuaData {
  [kunci: string]: DataEntry;
}

const dapatkanUrlApiGitHub = (path: string = JSON_FILE_PATH!) =>
  https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH};

const headerUmum = {
  Authorization: token ${GITHUB_TOKEN},
  'Accept': 'application/vnd.github.v3+json',
};

async function perbaruiKontenGitHub(
  dataUntukDiperbarui: SemuaData,
  shaFileSaatIni: string | undefined,
  pesanKomit: string
): Promise<{ success: boolean; error?: any; commitUrl?: string }> {
    const kontenBaruEncode = Buffer.from(JSON.stringify(dataUntukDiperbarui, null, 2)).toString('base64');
    
    // PERBAIKAN: Pastikan 'sha' hanya dikirim jika ada nilainya.
    const payload: { message: string; content: string; branch: string; sha?: string } = {
        message: pesanKomit,
        content: kontenBaruEncode,
        branch: BRANCH!,
    };
    if (shaFileSaatIni) {
        payload.sha = shaFileSaatIni;
    }

    try {
        const respons = await fetch(dapatkanUrlApiGitHub(), { method: 'PUT', headers: { ...headerUmum, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!respons.ok) { 
            const dataError = await respons.json(); 
            console.error("GitHub API Error:", dataError); // Logging error
            return { success: false, error: dataError.message }; 
        }
        const hasil = await respons.json();
        return { success: true, commitUrl: hasil.commit.html_url };
    } catch (error: any) { 
        console.error("Fetch to GitHub Error:", error); // Logging error
        return { success: false, error: error.message }; 
    }
}

// Handler utama tidak perlu diubah, karena perbaikan ada di fungsi di atasnya.
// ... (Salin seluruh isi handler dari respons sebelumnya) ...
export default async function penangan(permintaan: NextApiRequest, jawaban: NextApiResponse) {
  jawaban.setHeader('Access-Control-Allow-Origin', '*');
  jawaban.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  jawaban.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (permintaan.method === 'OPTIONS') return jawaban.status(200).end();
  if (!GITHUB_TOKEN  !REPO_OWNER  !REPO_NAME  !JSON_FILE_PATH  !BRANCH) {
    return jawaban.status(500).json({ message: 'Konfigurasi server tidak lengkap.' });
  }

  if (permintaan.method === 'GET') {
    try {
        const responsFile = await fetch(dapatkanUrlApiGitHub(), { method: 'GET', headers: headerUmum });
        if (responsFile.status === 404) return jawaban.status(200).json({});
        if (!responsFile.ok) { const dataError = await responsFile.json(); return jawaban.status(responsFile.status).json({ message: 'Gagal mengambil data dari GitHub.', error: dataError.message }); }
        const infoFile = await responsFile.json();
        const kontenDekode = Buffer.from(infoFile.content, 'base64').toString('utf-8');
        return jawaban.status(200).json(JSON.parse(kontenDekode));
    } catch (error: any) { return jawaban.status(500).json({ message: 'Kesalahan server saat mengambil data (GET).', error: error.message }); }
  }

  if (permintaan.method === 'POST') {
    try {
      const { aksi, kunciEntri, dataBaru, statusBaru } = permintaan.body;
      
      const responsFile = await fetch(dapatkanUrlApiGitHub(), { method: 'GET', headers: headerUmum });
      let dataSaatIni: SemuaData = {};
      let shaFile: string | undefined = undefined;
if (responsFile.status === 404) { /* File baru */ } 
      else if (!responsFile.ok) { const dataError = await responsFile.json(); return jawaban.status(responsFile.status).json({ message: 'Gagal mengambil data eksisting (POST).', error: dataError.message }); }
      else {
        const infoFile = await responsFile.json();
        const kontenDekode = Buffer.from(infoFile.content, 'base64').toString('utf-8');
        dataSaatIni = JSON.parse(kontenDekode);
        shaFile = infoFile.sha;
      }

      if (aksi === 'updateStatus') {
        if (!kunciEntri || !statusBaru) return jawaban.status(400).json({ message: 'kunciEntri dan statusBaru diperlukan.' });
        if (!dataSaatIni[kunciEntri]) return jawaban.status(404).json({ message: Entri '${kunciEntri}' tidak ditemukan. });
        
        const statusValid = ['Berhasil', 'Di Proses', 'Dibatalkan'];
        if (!statusValid.includes(statusBaru)) return jawaban.status(400).json({ message: 'Nilai status tidak valid.' });

        dataSaatIni[kunciEntri].status_pembayaran_transaksi = statusBaru;
        const pesanKomit = Update status to '${statusBaru}' for ${kunciEntri}.;
        const hasilUpdate = await perbaruiKontenGitHub(dataSaatIni, shaFile, pesanKomit);

        if (!hasilUpdate.success) return jawaban.status(500).json({ message: 'Gagal update status ke GitHub.', error: hasilUpdate.error });
        return jawaban.status(200).json({ message: Status untuk '${kunciEntri}' berhasil diubah., updatedData: dataSaatIni[kunciEntri] });
      
      } else {
        // Logika untuk membuat data baru tidak berubah
        return jawaban.status(400).json({ message: 'Aksi tidak valid.' }); // Asumsi dashboard hanya update
      }
    } catch (error: any) {
      return jawaban.status(500).json({ message: 'Kesalahan server (POST).', error: error.message });
    }
  }
  jawaban.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  return jawaban.status(405).json({ error: Method ${permintaan.method} tidak diizinkan. });
}
