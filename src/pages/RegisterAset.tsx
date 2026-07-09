import { useMemo, useState } from 'react';
import { DataTable } from '../components/DataTable';
import { PrintHeader } from '../components/PrintHeader';
import { StatusBadge } from '../components/StatusBadge';
import { categories } from '../data/masterData';
import type { Asset } from '../types/asset';
import { calculateAssetMetrics } from '../utils/depreciation';
import { exportToCSV, printReport } from '../utils/exportPrint';
import { formatDate, percent, rupiah } from '../utils/formatters';

interface RegisterAsetProps { assets: Asset[]; }

type SortMode = 'book-desc' | 'book-asc' | 'risk-desc';

export function RegisterAset({ assets }: RegisterAsetProps) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('Semua');
  const [category, setCategory] = useState('Semua');
  const [sort, setSort] = useState<SortMode>('book-desc');

  const enriched = useMemo(() => assets.map(asset => ({ asset, metrics: calculateAssetMetrics(asset) })), [assets]);
  const rowsData = useMemo(() => enriched
    .filter(item => {
      const keyword = `${item.asset.id} ${item.asset.name} ${item.asset.category} ${item.asset.department} ${item.asset.pic}`.toLowerCase();
      return keyword.includes(search.toLowerCase()) &&
        (status === 'Semua' || item.metrics.status === status) &&
        (category === 'Semua' || item.asset.category === category);
    })
    .sort((a, b) => {
      if (sort === 'book-asc') return a.metrics.currentBookValue - b.metrics.currentBookValue;
      if (sort === 'risk-desc') return b.metrics.depreciationRatio - a.metrics.depreciationRatio;
      return b.metrics.currentBookValue - a.metrics.currentBookValue;
    }), [enriched, search, status, category, sort]);

  const exportRows = rowsData.map((item, idx) => ({
    'No': idx + 1,
    'ID Aset': item.asset.id,
    'Nama Aset': item.asset.name,
    'Kategori': item.asset.category,
    'Lokasi/Departemen': item.asset.department,
    'Tanggal Beli': item.asset.purchaseDate,
    'Harga Beli': item.asset.purchasePrice,
    'Umur Ekonomis': `${item.asset.usefulLifeYears} tahun`,
    'Nilai Residu': item.asset.residualValue,
    'Akumulasi Depresiasi': item.metrics.accumulatedDepreciation,
    'Nilai Buku Saat Ini': item.metrics.currentBookValue,
    'Status Aset': item.metrics.status,
    'PIC': item.asset.pic,
    'Rasio Depresiasi': item.metrics.depreciationRatio,
    'Catatan': item.asset.note
  }));

  return (
    <div className="page-stack printable-area">
      <PrintHeader title="Register Aset" />
      <section className="section-heading">
        <div>
          <h2>Register Aset</h2>
          <p>Register otomatis dari data input, lengkap dengan nilai buku, akumulasi depresiasi, status, PIC, dan ranking risiko.</p>
        </div>
        <div className="actions no-print">
          <button className="btn secondary" onClick={() => exportToCSV('register-aset.csv', exportRows)}>Export CSV</button>
          <button className="btn primary" onClick={() => printReport('Register Aset')}>Cetak Register</button>
        </div>
      </section>

      <section className="filter-bar no-print">
        <label>Cari<input placeholder="Cari aset..." value={search} onChange={e => setSearch(e.target.value)} /></label>
        <label>Status<select value={status} onChange={e => setStatus(e.target.value)}><option>Semua</option><option>Aktif</option><option>Mendekati Habis Umur Ekonomis</option><option>Fully Depreciated</option><option>Dijual</option><option>Rusak</option><option>Dihapuskan</option></select></label>
        <label>Kategori<select value={category} onChange={e => setCategory(e.target.value)}><option>Semua</option>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Sort<select value={sort} onChange={e => setSort(e.target.value as SortMode)}><option value="book-desc">Nilai Buku Terbesar</option><option value="book-asc">Nilai Buku Terkecil</option><option value="risk-desc">Aset Paling Berisiko</option></select></label>
      </section>

      <DataTable
        headers={['No', 'ID Aset', 'Nama Aset', 'Kategori', 'Departemen', 'Tanggal Beli', 'Harga Beli', 'Umur', 'Residu', 'Akumulasi', 'Nilai Buku', 'Status', 'PIC', 'Rasio', 'Catatan']}
        rows={rowsData.map((item, idx) => [
          idx + 1,
          item.asset.id,
          <strong>{item.asset.name}</strong>,
          item.asset.category,
          item.asset.department,
          formatDate(item.asset.purchaseDate),
          rupiah(item.asset.purchasePrice),
          `${item.asset.usefulLifeYears} th`,
          rupiah(item.asset.residualValue),
          rupiah(item.metrics.accumulatedDepreciation),
          rupiah(item.metrics.currentBookValue),
          <StatusBadge status={item.metrics.status} highValue={item.metrics.isHighValue} />,
          item.asset.pic,
          percent(item.metrics.depreciationRatio),
          item.asset.note
        ])}
      />
    </div>
  );
}
