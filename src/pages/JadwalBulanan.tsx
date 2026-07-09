import { useMemo, useState } from 'react';
import { DataTable } from '../components/DataTable';
import { PrintHeader } from '../components/PrintHeader';
import { StatusBadge } from '../components/StatusBadge';
import type { Asset } from '../types/asset';
import { buildMonthlySchedule } from '../utils/depreciation';
import { exportToCSV, printReport } from '../utils/exportPrint';
import { rupiah } from '../utils/formatters';

interface JadwalBulananProps { assets: Asset[]; }

export function JadwalBulanan({ assets }: JadwalBulananProps) {
  const [assetId, setAssetId] = useState('Semua');
  const rows = useMemo(() => buildMonthlySchedule(assets, assetId), [assets, assetId]);

  const exportRows = rows.map(row => ({
    'ID Aset': row.assetId,
    'Nama Aset': row.assetName,
    'Bulan Ke': row.monthNo,
    'Periode Bulan': row.period,
    'Harga Beli': row.purchasePrice,
    'Nilai Residu': row.residualValue,
    'Depresiasi Bulanan': row.monthlyDepreciation,
    'Akumulasi Depresiasi': row.accumulatedDepreciation,
    'Nilai Buku Awal': row.openingBookValue,
    'Nilai Buku Akhir': row.closingBookValue,
    'Status Depresiasi': row.status
  }));

  return (
    <div className="page-stack printable-area">
      <PrintHeader title="Jadwal Depresiasi Bulanan" />
      <section className="section-heading">
        <div>
          <h2>Jadwal Depresiasi Bulanan</h2>
          <p>Jadwal penyusutan per bulan sampai aset mencapai nilai residu. Maksimum default 120 bulan.</p>
        </div>
        <div className="actions no-print">
          <button className="btn secondary" onClick={() => exportToCSV('jadwal-depresiasi-bulanan.csv', exportRows)}>Export CSV</button>
          <button className="btn primary" onClick={() => printReport('Jadwal Depresiasi Bulanan')}>Cetak Jadwal</button>
        </div>
      </section>

      <section className="filter-bar no-print">
        <label>Pilih Aset<select value={assetId} onChange={e => setAssetId(e.target.value)}><option>Semua</option>{assets.map(asset => <option key={asset.id} value={asset.id}>{asset.id} — {asset.name}</option>)}</select></label>
        <span className="last-update">Total baris: {rows.length}</span>
      </section>

      <DataTable
        headers={['ID Aset', 'Nama Aset', 'Bulan Ke-', 'Periode Bulan', 'Harga Beli', 'Nilai Residu', 'Depresiasi Bulanan', 'Akumulasi', 'Nilai Buku Awal', 'Nilai Buku Akhir', 'Status']}
        rows={rows.map(row => [
          row.assetId,
          row.assetName,
          row.monthNo,
          row.period,
          rupiah(row.purchasePrice),
          rupiah(row.residualValue),
          rupiah(row.monthlyDepreciation),
          rupiah(row.accumulatedDepreciation),
          rupiah(row.openingBookValue),
          rupiah(row.closingBookValue),
          <StatusBadge status={row.status} />
        ])}
      />
    </div>
  );
}
