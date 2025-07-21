import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect, FC } from 'react';
import html2canvas from 'html2canvas';

interface awusahrul_DukunganAktif {
  awusahrul_jumlah: number;
  awusahrul_biaya: number;
  awusahrul_total: number;
  awusahrul_idInvoice: string;
  awusahrul_urlDataKodeQr: string;
}
interface awusahrul_ItemRiwayat {
  awusahrul_nama: string;
  awusahrul_jumlah: number;
  awusahrul_pesan: string;
  awusahrul_tanggal: string;
}

const Awusahrul_HalamanDukungan: NextPage = () => {
  const [awusahrul_nama, atur_awusahrul_nama] = useState('');
  const [awusahrul_email, atur_awusahrul_email] = useState('');
  const [awusahrul_pesan, atur_awusahrul_pesan] = useState('');
  const [awusahrul_jumlahDukungan, atur_awusahrul_jumlahDukungan] = useState(0);
  const [awusahrul_jumlahKustom, atur_awusahrul_jumlahKustom] = useState('');
  const [awusahrul_apakahKustom, atur_awusahrul_apakahKustom] = useState(false);
  const [awusahrul_modalQrisTerbuka, atur_awusahrul_modalQrisTerbuka] = useState(false);
  const [awusahrul_modalRiwayatTerbuka, atur_awusahrul_modalRiwayatTerbuka] = useState(false);
  const [awusahrul_sedangMemuat, atur_awusahrul_sedangMemuat] = useState(false);
  const [awusahrul_dropdownTerbuka, atur_awusahrul_dropdownTerbuka] = useState(false);
  const [awusahrul_setujuUmur, atur_awusahrul_setujuUmur] = useState(false);
  const [awusahrul_setujuSyarat, atur_awusahrul_setujuSyarat] = useState(false);
  const [awusahrul_riwayat, atur_awusahrul_riwayat] = useState<awusahrul_ItemRiwayat[]>([]);
  const [awusahrul_dukunganAktif, atur_awusahrul_dukunganAktif] = useState<awusahrul_DukunganAktif | null>(null);
  const [awusahrul_hitungMundur, atur_awusahrul_hitungMundur] = useState(300);

  const awusahrul_persenBiaya = 0.007;
  const awusahrul_biayaLayanan = Math.ceil(awusahrul_jumlahDukungan * awusahrul_persenBiaya);
  const awusahrul_totalBayar = awusahrul_jumlahDukungan + awusahrul_biayaLayanan;
  
  useEffect(() => {
    try {
      const awusahrul_riwayatTersimpan = localStorage.getItem('riwayatDukungan');
      if (awusahrul_riwayatTersimpan) atur_awusahrul_riwayat(JSON.parse(awusahrul_riwayatTersimpan));
    } catch (error) { console.error("Gagal memuat riwayat:", error); }
  }, []);

  useEffect(() => {
    let awusahrul_timer: NodeJS.Timeout;
    if (awusahrul_modalQrisTerbuka && awusahrul_hitungMundur > 0) {
      awusahrul_timer = setInterval(() => { atur_awusahrul_hitungMundur((prev) => prev - 1); }, 1000);
    }
    return () => clearInterval(awusahrul_timer);
  }, [awusahrul_modalQrisTerbuka, awusahrul_hitungMundur]);

  const awusahrul_formatMataUang = (awusahrul_jumlah: number): string => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(awusahrul_jumlah);
  
  const awusahrul_tanganiPerubahanJumlah = (awusahrul_jumlah: number | 'custom', awusahrul_teks: string) => {
    const awusahrul_elemenTeksDropdown = document.getElementById('awusahrul_teks_pemantik_jumlah');
    if (awusahrul_elemenTeksDropdown) awusahrul_elemenTeksDropdown.textContent = awusahrul_teks;
    atur_awusahrul_dropdownTerbuka(false);
    if (awusahrul_jumlah === 'custom') {
      atur_awusahrul_apakahKustom(true);
      atur_awusahrul_jumlahDukungan(0);
    } else {
      atur_awusahrul_apakahKustom(false);
      atur_awusahrul_jumlahKustom('');
      atur_awusahrul_jumlahDukungan(awusahrul_jumlah);
    }
  };

  const awusahrul_tanganiInputJumlahKustom = (awusahrul_event: React.ChangeEvent<HTMLInputElement>) => {
    const awusahrul_nilai = awusahrul_event.target.value.replace(/\D/g, '');
    atur_awusahrul_jumlahKustom(awusahrul_nilai);
    atur_awusahrul_jumlahDukungan(Number(awusahrul_nilai));
  };
    
  const awusahrul_tanganiPengirimanFormulir = async (awusahrul_event: React.FormEvent<HTMLFormElement>) => {
    awusahrul_event.preventDefault();
    if (!awusahrul_setujuUmur || !awusahrul_setujuSyarat) {
      alert('Anda harus menyetujui semua persyaratan untuk melanjutkan.');
      return;
    }
    if (awusahrul_jumlahDukungan < 1000) {
      alert('Minimal dukungan adalah Rp 1.000');
      return;
    }
    atur_awusahrul_sedangMemuat(true);
    try {
      const awusahrul_jawabanApi = await fetch('/api/qrisd', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: awusahrul_totalBayar }) });
      if (!awusahrul_jawabanApi.ok) throw new Error('Gagal membuat kode QRIS.');
      const awusahrul_data = await awusahrul_jawabanApi.json();
      const awusahrul_dukunganBaru: awusahrul_DukunganAktif = { awusahrul_jumlah: awusahrul_jumlahDukungan, awusahrul_biaya: awusahrul_biayaLayanan, awusahrul_total: awusahrul_totalBayar, awusahrul_idInvoice: `INV-${Date.now()}`, awusahrul_urlDataKodeQr: awusahrul_data.awusahrul_urlDataKodeQr };
      atur_awusahrul_dukunganAktif(awusahrul_dukunganBaru);
      const awusahrul_itemRiwayatBaru: awusahrul_ItemRiwayat = { awusahrul_nama: awusahrul_nama, awusahrul_jumlah: awusahrul_jumlahDukungan, awusahrul_pesan: awusahrul_pesan, awusahrul_tanggal: new Date().toISOString() };
      const awusahrul_riwayatDiperbarui = [awusahrul_itemRiwayatBaru, ...awusahrul_riwayat];
      atur_awusahrul_riwayat(awusahrul_riwayatDiperbarui);
      localStorage.setItem('riwayatDukungan', JSON.stringify(awusahrul_riwayatDiperbarui));
      atur_awusahrul_hitungMundur(300);
      atur_awusahrul_modalQrisTerbuka(true);
      atur_awusahrul_nama(''); atur_awusahrul_email(''); atur_awusahrul_pesan(''); atur_awusahrul_jumlahDukungan(0);
      atur_awusahrul_jumlahKustom(''); atur_awusahrul_setujuUmur(false); atur_awusahrul_setujuSyarat(false); atur_awusahrul_apakahKustom(false);
      const awusahrul_elemenTeksDropdown = document.getElementById('awusahrul_teks_pemantik_jumlah');
      if (awusahrul_elemenTeksDropdown) awusahrul_elemenTeksDropdown.textContent = "Pilih Nominal";
    } catch (error) {
      alert((error as Error).message);
    } finally {
      atur_awusahrul_sedangMemuat(false);
    }
  };

  const awusahrul_tanganiUnduhInvoice = () => {
    if (!awusahrul_dukunganAktif) return;
    const awusahrul_tombol = document.getElementById('awusahrul_tombol_unduh_invoice') as HTMLButtonElement;
    if (awusahrul_tombol) { awusahrul_tombol.textContent = 'Membuat...'; awusahrul_tombol.disabled = true; }
    const awusahrul_elemenInvoice = document.getElementById('awusahrul_wadah_invoice');
    const awusahrul_elemenGambarQr = document.getElementById('awusahrul_kode_qr_invoice');
    if (awusahrul_elemenGambarQr && awusahrul_elemenInvoice) {
      const awusahrul_gambar = new Image();
      awusahrul_gambar.onload = () => {
        awusahrul_elemenGambarQr.innerHTML = '';
        awusahrul_elemenGambarQr.appendChild(awusahrul_gambar);
        setTimeout(() => {
          html2canvas(awusahrul_elemenInvoice, { scale: 2 }).then(canvas => {
            const link = document.createElement('a');
            link.download = `Invoice-Sahrul-${awusahrul_dukunganAktif.awusahrul_idInvoice}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            if (awusahrul_tombol) { awusahrul_tombol.textContent = 'Download Invoice'; awusahrul_tombol.disabled = false; }
          }).catch(err => {
            console.error("html2canvas error:", err);
            if (awusahrul_tombol) { awusahrul_tombol.textContent = 'Download Invoice'; awusahrul_tombol.disabled = false; }
          });
        }, 100);
      };
      awusahrul_gambar.onerror = () => { if (awusahrul_tombol) { awusahrul_tombol.textContent = 'Download Invoice'; awusahrul_tombol.disabled = false; } };
      awusahrul_gambar.src = awusahrul_dukunganAktif.awusahrul_urlDataKodeQr;
    }
  };

  const awusahrul_tanganiSalinJumlah = () => {
    if(!awusahrul_dukunganAktif) return;
    navigator.clipboard.writeText(awusahrul_dukunganAktif.awusahrul_total.toString()).then(() => {
        alert(`Nominal ${awusahrul_formatMataUang(awusahrul_dukunganAktif.awusahrul_total)} berhasil disalin!`);
    }, () => {
        alert('Gagal menyalin nominal.');
    });
  };

  const Awusahrul_KomponenInvoiceTersembunyi: FC<{ awusahrul_dataDukungan: awusahrul_DukunganAktif | null }> = ({ awusahrul_dataDukungan }) => {
    if (!awusahrul_dataDukungan) return null;
    return (
      <div id="awusahrul_wadah_invoice">
        <div className="awusahrul_kepala_invoice"><h2>INVOICE PEMBAYARAN</h2><p>buat: <strong>Awu</strong></p></div>
        <div className="awusahrul_detail_invoice">
          <table><tbody>
            <tr><td>No. Invoice:</td><td>{awusahrul_dataDukungan.awusahrul_idInvoice}</td></tr>
            <tr><td>Tanggal:</td><td>{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td></tr>
            <tr><td>Jatuh Tempo:</td><td>Bayar Segera</td></tr>
          </tbody></table>
        </div>
        <div className="awusahrul_badan_invoice">
          <p>Scan QR Code di bawah ini:</p>
          <div id="awusahrul_kode_qr_invoice"></div>
        </div>
        <div className="awusahrul_detail_pembayaran_invoice">
          <table><tbody>
            <tr><td>Jumlah Dukungan:</td><td>{awusahrul_formatMataUang(awusahrul_dataDukungan.awusahrul_jumlah)}</td></tr>
            <tr><td>Biaya Layanan:</td><td>{awusahrul_formatMataUang(awusahrul_dataDukungan.awusahrul_biaya)}</td></tr>
            <tr className="awusahrul_baris_total"><td>TOTAL BAYAR:</td><td>{awusahrul_formatMataUang(awusahrul_dataDukungan.awusahrul_total)}</td></tr>
          </tbody></table>
        </div>
        <div className="awusahrul_kaki_invoice"><p>Terima kasih atas dukungan Anda!</p></div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>dariKami! ~ buat Awu</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/jpeg" href="/gambar.jpg" />
        <meta content='#000000' name='theme-color'/>
        <meta content='#000000' name='msapplication-navbutton-color'/>
        <meta content='yes' name='apple-mobile-web-app-capable'/>
        <meta content='#000000' name='apple-mobile-web-app-status-bar-style'/>
      </Head>
      <div className="awusahrul_wadah">
        <div className="awusahrul_konten_utama">
          <div className="awusahrul_kepala">
              <button className="awusahrul_tombol_kepala" onClick={() => atur_awusahrul_modalRiwayatTerbuka(true)}>Riwayat</button>
              <img src="/gambar.jpg" alt="Profile" className="awusahrul_gambar_profil"/>
              <div className="awusahrul_nama_merek">Awu</div>
          </div>
          <div className="awusahrul_wadah_formulir">
              <form onSubmit={awusahrul_tanganiPengirimanFormulir}>
                  <div className="awusahrul_grup_formulir">
                      <label>Nominal Dukungan: <span className="awusahrul_wajib">*</span></label>
                      <div className="awusahrul_turun">
                          <button type="button" className="awusahrul_pemantik_turun" onClick={() => atur_awusahrul_dropdownTerbuka(!awusahrul_dropdownTerbuka)}>
                              <span id="awusahrul_teks_pemantik_jumlah">Pilih Nominal</span>
                              <span>▼</span>
                          </button>
                          <div className={`awusahrul_menu_turun ${awusahrul_dropdownTerbuka ? 'awusahrul_tampil' : ''}`}>
                              {[5000, 10000, 25000, 50000].map(awusahrul_jumlah => (
                                  <div key={awusahrul_jumlah} className="awusahrul_item_turun" onClick={() => awusahrul_tanganiPerubahanJumlah(awusahrul_jumlah, awusahrul_formatMataUang(awusahrul_jumlah))}>
                                      {awusahrul_formatMataUang(awusahrul_jumlah)}
                                  </div>
                              ))}
                              <div className="awusahrul_item_turun" onClick={() => awusahrul_tanganiPerubahanJumlah('custom', 'Nominal Lain')}>
                                  Nominal Lain
                              </div>
                          </div>
                      </div>
                      {awusahrul_apakahKustom && (
                          <input type="text" className="awusahrul_input_formulir awusahrul_jumlah_kustom" placeholder="Ketik nominal (min. 1.000)" value={awusahrul_jumlahKustom} onChange={awusahrul_tanganiInputJumlahKustom} />
                      )}
                  </div>
                  <div className="awusahrul_grup_formulir"><label htmlFor="fromInput">Nama Anda: <span className="awusahrul_wajib">*</span></label><input type="text" id="fromInput" className="awusahrul_input_formulir" placeholder="Contoh: Budi" value={awusahrul_nama} onChange={e => atur_awusahrul_nama(e.target.value)} required /></div>
                  <div className="awusahrul_grup_formulir"><label htmlFor="emailInput">Email: <span className="awusahrul_wajib">*</span></label><input type="email" id="emailInput" className="awusahrul_input_formulir" placeholder="Contoh: budi@example.com" value={awusahrul_email} onChange={e => atur_awusahrul_email(e.target.value)} required /></div>
                  <div className="awusahrul_grup_formulir"><label htmlFor="messageInput">Pesan (Opsional):</label><input type="text" id="messageInput" className="awusahrul_input_formulir" placeholder="Contoh: Semoga selalu berkarya!" value={awusahrul_pesan} onChange={e => atur_awusahrul_pesan(e.target.value)} /></div>
                  <div className="awusahrul_grup_centang"><div className="awusahrul_item_centang"><input type="checkbox" id="age-check" checked={awusahrul_setujuUmur} onChange={(e) => atur_awusahrul_setujuUmur(e.target.checked)} required /><label htmlFor="age-check">Saya berusia 17 tahun atau lebih</label></div><div className="awusahrul_item_centang"><input type="checkbox" id="terms-check" checked={awusahrul_setujuSyarat} onChange={(e) => atur_awusahrul_setujuSyarat(e.target.checked)} required /><label htmlFor="terms-check">Saya memahami dan menyetujui bahwa dukungan ini bersifat sukarela dan sesuai <a href="#" target="_blank" rel="noopener noreferrer">syarat & ketentuan</a>.</label></div></div>
                  <div className="awusahrul_ringkasan_pembayaran"><div className="awusahrul_baris_ringkasan"><span>Jumlah Dukungan:</span><span>{awusahrul_formatMataUang(awusahrul_jumlahDukungan)}</span></div><div className="awusahrul_baris_ringkasan"><span>Biaya Layanan:</span><span>{awusahrul_formatMataUang(awusahrul_biayaLayanan)}</span></div><div className="awusahrul_baris_ringkasan"><span>Total Bayar:</span><span>{awusahrul_formatMataUang(awusahrul_totalBayar)}</span></div></div>
                  <button type="submit" className="awusahrul_tombol_dukung" disabled={awusahrul_sedangMemuat}>{awusahrul_sedangMemuat ? 'Memproses...' : 'Lanjutkan Pembayaran'}</button>
              </form>
          </div>
        </div>
        <footer className="awusahrul_kaki_utama">dariKami! ~ buat Jajan karya | Ikuti <a href="https://whatsapp.com/channel/0029Vb6WmoKGpLHOdbB4NS3I">Saluran WhatsApp</a> untuk mendapatkan update project ini</footer>
      </div>
      {awusahrul_modalQrisTerbuka && awusahrul_dukunganAktif && (
        <div className={`awusahrul_modal ${awusahrul_modalQrisTerbuka ? 'awusahrul_aktif' : ''}`} onClick={() => atur_awusahrul_modalQrisTerbuka(false)}>
            <div className="awusahrul_konten_modal" onClick={e => e.stopPropagation()}>
                <div className="awusahrul_kepala_modal"><h3 className="awusahrul_judul_modal">Pembayaran QRIS</h3><button type="button" className="awusahrul_tutup_modal" onClick={() => atur_awusahrul_modalQrisTerbuka(false)}>&times;</button></div>
                {awusahrul_hitungMundur > 0 ? (
                    <p className="awusahrul_detail_pembayaran">Scan untuk membayar sebesar <span className="awusahrul_jumlah">{awusahrul_formatMataUang(awusahrul_dukunganAktif.awusahrul_total)}</span><br/>dalam waktu <span className="awusahrul_pewaktu">{Math.floor(awusahrul_hitungMundur / 60)}:{(awusahrul_hitungMundur % 60).toString().padStart(2, '0')}</span> lagi.</p>
                ) : (
                    <p className="awusahrul_detail_pembayaran">Waktu pembayaran habis.</p>
                )}
                <img src={awusahrul_dukunganAktif.awusahrul_urlDataKodeQr} alt="QRIS Payment Code" width="200" height="200" style={{opacity: awusahrul_hitungMundur > 0 ? 1 : 0.2}}/>
                <div className="awusahrul_kaki_modal">
                    <button type="button" className="awusahrul_tombol_modal" onClick={awusahrul_tanganiSalinJumlah} disabled={awusahrul_hitungMundur === 0}>Salin Nominal</button>
                    <button type="button" className="awusahrul_tombol_modal" id="awusahrul_tombol_unduh_invoice" onClick={awusahrul_tanganiUnduhInvoice} disabled={awusahrul_hitungMundur === 0}>Download Invoice</button>
                </div>
            </div>
        </div>
      )}
      {awusahrul_modalRiwayatTerbuka && (
          <div className={`awusahrul_modal ${awusahrul_modalRiwayatTerbuka ? 'awusahrul_aktif' : ''}`} onClick={() => atur_awusahrul_modalRiwayatTerbuka(false)}>
              <div className="awusahrul_konten_modal" onClick={e => e.stopPropagation()}>
                  <div className="awusahrul_kepala_modal"><h3 className="awusahrul_judul_modal">Riwayat Dukunganmu</h3><button type="button" className="awusahrul_tutup_modal" onClick={() => atur_awusahrul_modalRiwayatTerbuka(false)}>&times;</button></div>
                  <ul id="awusahrul_daftar_riwayat">
                      {awusahrul_riwayat.length > 0 ? awusahrul_riwayat.map((awusahrul_item, awusahrul_indeks) => (
                          <li key={awusahrul_indeks}>
                              <p><strong>{awusahrul_item.awusahrul_nama}</strong> mendukung sebesar <strong>{awusahrul_formatMataUang(awusahrul_item.awusahrul_jumlah)}</strong></p>
                              <p><em>"{awusahrul_item.awusahrul_pesan}"</em></p>
                              <p className="awusahrul_meta_riwayat">{new Date(awusahrul_item.awusahrul_tanggal).toLocaleString('id-ID')}</p>
                          </li>
                      )) : <p>Belum ada riwayat dukungan.</p>}
                  </ul>
              </div>
          </div>
      )}
      <Awusahrul_KomponenInvoiceTersembunyi awusahrul_dataDukungan={awusahrul_dukunganAktif} />
    </>
  );
};

export default Awusahrul_HalamanDukungan;
