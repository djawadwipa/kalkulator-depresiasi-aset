import { PrintHeader } from '../components/PrintHeader';
import { printReport } from '../utils/exportPrint';

export function PanduanPenggunaan() {
  return (
    <div className="page-stack printable-area">
      <PrintHeader title="Panduan Penggunaan" />
      <section className="section-heading">
        <div>
          <h2>Panduan Penggunaan</h2>
          <p>Petunjuk ringkas untuk Finance, Accounting, GA, Asset Management, dan Manajemen.</p>
        </div>
        <div className="actions no-print"><button className="btn primary" onClick={() => printReport('Panduan Penggunaan')}>Cetak Panduan</button></div>
      </section>

      <section className="guide-card">
        <h3>1. Cara Mengisi Data Aset</h3>
        <p>Buka menu <b>Input Data Aset</b>. Isi ID aset, nama aset, kategori, departemen, tanggal pembelian, harga beli, umur ekonomis tahun, nilai residu, metode depresiasi, tanggal mulai depresiasi, status, PIC, dan catatan. Umur ekonomis bulan dihitung otomatis.</p>
      </section>
      <section className="guide-card">
        <h3>2. Cara Menghitung Depresiasi</h3>
        <p>Buka menu <b>Kalkulator Depresiasi</b>, pilih nama aset pada dropdown. Output akan menampilkan dasar depresiasi, depresiasi tahunan, depresiasi bulanan, akumulasi depresiasi, nilai buku saat ini, sisa umur ekonomis, status aset, rasio depresiasi, dan rekomendasi.</p>
      </section>
      <section className="guide-card">
        <h3>3. Cara Membaca Jadwal Depresiasi</h3>
        <p>Menu <b>Jadwal Bulanan</b> dan <b>Jadwal Tahunan</b> menampilkan periode penyusutan per aset. Jadwal berhenti setelah aset mencapai nilai residu sesuai aturan metode garis lurus.</p>
      </section>
      <section className="guide-card">
        <h3>4. Cara Membaca Nilai Buku</h3>
        <p>Nilai buku adalah harga beli dikurangi akumulasi depresiasi. Aplikasi membatasi nilai buku agar tidak lebih kecil dari nilai residu.</p>
      </section>
      <section className="guide-card">
        <h3>5. Cara Menggunakan Dashboard</h3>
        <p>Gunakan dropdown filter kategori dan departemen. KPI dan grafik membantu memantau total aset, nilai buku, akumulasi depresiasi, aset aktif, aset mendekati akhir umur, fully depreciated, dan aset bernilai tinggi.</p>
      </section>
      <section className="guide-card">
        <h3>6. Penjelasan Metode Garis Lurus</h3>
        <p>Metode garis lurus mengalokasikan biaya depresiasi secara merata selama umur ekonomis aset.</p>
        <div className="example-box">
          <b>Contoh:</b><br />
          Harga beli aset: Rp120.000.000<br />
          Umur ekonomis: 5 tahun / 60 bulan<br />
          Nilai residu: Rp20.000.000<br />
          Dasar depresiasi: Rp100.000.000<br />
          Depresiasi tahunan: Rp20.000.000<br />
          Depresiasi bulanan: ±Rp1.666.667
        </div>
      </section>
      <section className="guide-card">
        <h3>7. Catatan Penting Finance/Accounting</h3>
        <p>Pastikan tanggal mulai depresiasi, nilai residu, umur ekonomis, dan kebijakan kapitalisasi aset mengikuti kebijakan akuntansi perusahaan serta standar pelaporan yang berlaku. Review aset fully depreciated secara berkala.</p>
      </section>
    </div>
  );
}
