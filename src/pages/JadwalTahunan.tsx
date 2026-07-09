import { useMemo, useState } from 'react';
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { PrintHeader } from '../components/PrintHeader';
import { StatusBadge } from '../components/StatusBadge';
import type { Asset } from '../types/asset';
import { annualBookValueTrend, buildAnnualSchedule } from '../utils/depreciation';
import { exportToCSV, printReport } from '../utils/exportPrint';
import { rupiah } from '../utils/formatters';

interface JadwalTahunanProps { assets: Asset[]; }

export function JadwalTahunan({ assets }: JadwalTahunanProps) {
  const [assetId, setAssetId] = useState('Semua');
  const rows = useMemo(() => buildAnnualSchedule(assets, assetId), [assets, assetId]);
  const trend = useMemo(() => annualBookValueTrend(assetId === 'Semua' ? assets : assets.filter(asset => asset.id === assetId)), [assets, assetId]);

  const exportRows = rows.map(row => ({
    'ID Aset': row.assetId,
    'Nama Aset': row.assetName,
    'Tahun Ke': row.yearNo,
    'Tahun Depresiasi': row.depreciationYear,
    'Harga Beli': row.purchasePrice,
    'Nilai Residu': row.residualValue,
    'Depresiasi Tahunan': row.annualDepreciation,
    'Akumulasi Depresiasi': row.accumulatedDepreciation,
    'Nilai Buku Awal Tahun': row.openingBookValue,
    'Nilai Buku Akhir Tahun': row.closingBookValue,
    'Status Aset': row.status
  }));

  return (
    <div className="page-stack printable-area">
      <PrintHeader title="Jadwal Depresiasi Tahunan" />
      <section className="section-heading">
        <div>
          <h2>Jadwal Depresiasi Tahunan</h2>
          <p>Jadwal penyusutan tahunan dan tren nilai buku akhir tahun untuk setiap aset.</p>
        </div>
        <div className="actions no-print">
          <button className="btn secondary" onClick={() => exportToCSV('jadwal-depresiasi-tahunan.csv', exportRows)}>Export CSV</button>
          <button className="btn primary" onClick={() => printReport('Jadwal Depresiasi Tahunan')}>Cetak Jadwal</button>
        </div>
      </section>

      <section className="filter-bar no-print">
        <label>Pilih Aset<select value={assetId} onChange={e => setAssetId(e.target.value)}><option>Semua</option>{assets.map(asset => <option key={asset.id} value={asset.id}>{asset.id} — {asset.name}</option>)}</select></label>
        <span className="last-update">Total baris: {rows.length}</span>
      </section>

      <ChartCard title="Total Nilai Buku Akhir Tahun" subtitle="Grafik garis tren nilai buku dari 2021 sampai 2035.">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={v => `${Number(v) / 1000000000} M`} />
            <Tooltip formatter={(value: number) => rupiah(value)} />
            <Line type="monotone" dataKey="totalBookValue" name="Total Nilai Buku" stroke="#008D84" strokeWidth={3} dot />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <DataTable
        headers={['ID Aset', 'Nama Aset', 'Tahun Ke-', 'Tahun Depresiasi', 'Harga Beli', 'Nilai Residu', 'Depresiasi Tahunan', 'Akumulasi', 'Nilai Buku Awal Tahun', 'Nilai Buku Akhir Tahun', 'Status']}
        rows={rows.map(row => [
          row.assetId,
          row.assetName,
          row.yearNo,
          row.depreciationYear,
          rupiah(row.purchasePrice),
          rupiah(row.residualValue),
          rupiah(row.annualDepreciation),
          rupiah(row.accumulatedDepreciation),
          rupiah(row.openingBookValue),
          rupiah(row.closingBookValue),
          <StatusBadge status={row.status} />
        ])}
      />
    </div>
  );
}
