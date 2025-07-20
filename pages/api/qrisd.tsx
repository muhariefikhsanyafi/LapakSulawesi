import type { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';

type awusahrul_JawabanQris = {
  awusahrul_stringQris?: string;
  awusahrul_urlDataKodeQr?: string;
  awusahrul_pesanKesalahan?: string;
};

const AWUSAHRUL_DATA_STATIS_QRIS = process.env.AWUSAHRUL_QRIS_STATIS;

const awusahrul_hitungCRC16 = (awusahrul_input: string): string => {
  let awusahrul_crc = 0xFFFF;
  for (let i = 0; i < awusahrul_input.length; i++) {
    awusahrul_crc ^= awusahrul_input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      awusahrul_crc = (awusahrul_crc & 0x8000) ? (awusahrul_crc << 1) ^ 0x1021 : awusahrul_crc << 1;
    }
  }
  return ('0000' + (awusahrul_crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
};

const awusahrul_buatStringQris = (awusahrul_nominal: number): string => {
  if (!AWUSAHRUL_DATA_STATIS_QRIS) {
    throw new Error("Data QRIS statis tidak ditemukan di konfigurasi server.");
  }
  if (typeof awusahrul_nominal !== 'number' || awusahrul_nominal <= 0) {
    throw new Error("Jumlah nominal tidak valid");
  }
  const awusahrul_qris = AWUSAHRUL_DATA_STATIS_QRIS.slice(0, -4).replace("010211", "010212");
  const [awusahrul_bagian1, awusahrul_bagian2] = awusahrul_qris.split("5802ID");
  const awusahrul_bagianJumlah = `54${awusahrul_nominal.toString().length.toString().padStart(2, '0')}${awusahrul_nominal}5802ID`;
  const awusahrul_output = awusahrul_bagian1 + awusahrul_bagianJumlah + awusahrul_bagian2;
  return awusahrul_output + awusahrul_hitungCRC16(awusahrul_output);
};

export default async function handler(
  awusahrul_permintaan: NextApiRequest,
  awusahrul_jawaban: NextApiResponse<awusahrul_JawabanQris>
) {
  if (!AWUSAHRUL_DATA_STATIS_QRIS) {
    console.error("Variabel AWUSAHRUL_QRIS_STATIS belum diatur di file .env.local");
    return awusahrul_jawaban.status(500).json({ awusahrul_pesanKesalahan: 'Konfigurasi server tidak lengkap.' });
  }

  if (awusahrul_permintaan.method !== 'POST') {
    awusahrul_jawaban.setHeader('Allow', ['POST']);
    return awusahrul_jawaban.status(405).json({ awusahrul_pesanKesalahan: `Metode ${awusahrul_permintaan.method} Tidak Diizinkan` });
  }

  try {
    const { amount: awusahrul_jumlah } = awusahrul_permintaan.body;

    if (typeof awusahrul_jumlah !== 'number' || awusahrul_jumlah < 1) {
      return awusahrul_jawaban.status(400).json({ awusahrul_pesanKesalahan: 'Jumlah tidak valid.' });
    }

    const awusahrul_stringHasil = awusahrul_buatStringQris(awusahrul_jumlah);

    const awusahrul_urlDataHasil = await QRCode.toDataURL(awusahrul_stringHasil, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 256,
    });

    return awusahrul_jawaban.status(200).json({ 
        awusahrul_stringQris: awusahrul_stringHasil, 
        awusahrul_urlDataKodeQr: awusahrul_urlDataHasil 
    });

  } catch (awusahrul_error) {
    console.error("Kesalahan Pembuatan QRIS:", awusahrul_error);
    return awusahrul_jawaban.status(500).json({ awusahrul_pesanKesalahan: 'Kesalahan Internal Server' });
  }
      }
