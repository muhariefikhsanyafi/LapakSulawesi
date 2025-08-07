import type { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';

const { 
    GITHUB_TOKEN, 
    REPO_OWNER, 
    REPO_NAME, 
    BRANCH, 
    JSON_FILE_PATH,
    DATA_STATIS_QRIS
} = process.env;

interface EntriData {
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
  [kunci: string]: EntriData;
}

const hitungCRC16 = (input: string): string => {
  let crc = 0xFFFF;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return ('0000' + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
};

const buatStringQris = (nominal: number): string => {
  if (!DATA_STATIS_QRIS) throw new Error("Data QRIS statis tidak ditemukan.");
  const qris = DATA_STATIS_QRIS.slice(0, -4).replace("010211", "010212");
  const [bagian1, bagian2] = qris.split("5802ID");
  const bagianJumlah = `54${nominal.toString().length.toString().padStart(2, '0')}${nominal}5802ID`;
  const output = bagian1 + bagianJumlah + bagian2;
  return output + hitungCRC16(output);
};

const dapatkanUrlApiGitHub = (path: string = JSON_FILE_PATH!) =>
  `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`;

const headerUmum = {
  Authorization: `token ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
};

async function perbaruiKontenGitHub(
  dataUntukDiperbarui: SemuaData,
  shaFileSaatIni: string | undefined,
  pesanKomit: string
): Promise<{ success: boolean; error?: any; commitUrl?: string }> {
    const kontenBaruEncode = Buffer.from(JSON.stringify(dataUntukDiperbarui, null, 2)).toString('base64');
    const payload = { message: pesanKomit, content: kontenBaruEncode, branch: BRANCH!, sha: shaFileSaatIni };
    try {
        const respons = await fetch(dapatkanUrlApiGitHub(), { method: 'PUT', headers: { ...headerUmum, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!respons.ok) { const dataError = await respons.json(); return { success: false, error: dataError.message }; }
        const hasil = await respons.json();
        return { success: true, commitUrl: hasil.commit.html_url };
    } catch (error: any) { return { success: false, error: error.message }; }
}

export default async function penangan(permintaan: NextApiRequest, jawaban: NextApiResponse) {
  jawaban.setHeader('Access-Control-Allow-Origin', '*');
  jawaban.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  jawaban.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (permintaan.method === 'OPTIONS') return jawaban.status(200).end();
  if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME || !JSON_FILE_PATH || !BRANCH || !DATA_STATIS_QRIS) {
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
        if (!dataSaatIni[kunciEntri]) return jawaban.status(404).json({ message: `Entri '${kunciEntri}' tidak ditemukan.` });
        
        const statusValid = ['Berhasil', 'Di Proses', 'Dibatalkan'];
        if (!statusValid.includes(statusBaru)) return jawaban.status(400).json({ message: 'Nilai status tidak valid.' });

        dataSaatIni[kunciEntri].status_pembayaran_transaksi = statusBaru;
        const pesanKomit = `Update status to '${statusBaru}' for ${kunciEntri}.`;
        const hasilUpdate = await perbaruiKontenGitHub(dataSaatIni, shaFile, pesanKomit);

        if (!hasilUpdate.success) return jawaban.status(500).json({ message: 'Gagal update status ke GitHub.', error: hasilUpdate.error });
        return jawaban.status(200).json({ message: `Status untuk '${kunciEntri}' berhasil diubah.`, updatedData: dataSaatIni[kunciEntri] });
      
      } else {
        if (!kunciEntri || typeof dataBaru !== 'object' || dataBaru === null) return jawaban.status(400).json({ message: 'kunciEntri dan dataBaru diperlukan.' });
        
        const dataDiproses = { ...dataBaru } as EntriData;
        const nominalAngka = parseInt(dataDiproses.harga_transaksi.replace(/[^0-9]/g, ''), 10) || 0;
        
        const stringQris = buatStringQris(nominalAngka);
        const dataUrlQris = await QRCode.toDataURL(stringQris, { errorCorrectionLevel: 'H', margin: 2, width: 256 });
        dataDiproses.url_pambayaran = dataUrlQris;
        
        const semuaDataDiperbarui = { ...dataSaatIni, [kunciEntri]: dataDiproses };
        const pesanKomit = `Create data.json: ${kunciEntri}.`;
        const hasilUpdate = await perbaruiKontenGitHub(semuaDataDiperbarui, shaFile, pesanKomit);

        if (!hasilUpdate.success) return jawaban.status(500).json({ message: 'Gagal menyimpan data ke GitHub.', error: hasilUpdate.error });
        return jawaban.status(200).json({ message: `Data untuk '${kunciEntri}' berhasil diproses!`, url_pambayaran: dataDiproses.url_pambayaran });
      }
    } catch (error: any) {
      return jawaban.status(500).json({ message: 'Kesalahan server (POST).', error: error.message });
    }
  }
  jawaban.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
  return jawaban.status(405).json({ error: `Method ${permintaan.method} tidak diizinkan.` });
}
