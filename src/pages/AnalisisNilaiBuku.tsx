import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { DataTable } from '../components/DataTable';
import { PrintHeader } from '../components/PrintHeader';
import { StatusBadge } from '../components/StatusBadge';
import type { Asset } from '../types/asset';
import { categoryAnalysis, departmentAnalysis, riskAssets, topBookValueAssets } from '../utils/depreciation';
import { exportToCSV, printReport } from '../utils/exportPrint';
import { percent, rupiah } from '../utils/formatters';

interface AnalisisNilaiBukuProps { assets: Asset[]; }

export function AnalisisNilaiBuku({ assets }: AnalisisNilaiBukuProps) {
  const categoryRows = useMemo(() => categoryAnalysis(assets), [assets]);
  const departmentRows = useMemo(() => departmentAnalysis(assets), [assets]);
  const topAssets = useMemo(() => topBookValueAssets(assets, 10), [assets]);
  const risky = useMemo(() => riskAssets(assets, 10), [assets]);

  return (
    <div className="page-stack printable-area">
      <PrintHeader title="Analisis Nilai Buku" />
      <section className="section-heading">
        <div>
          <h2>Analisis Nilai Buku</h2>
          <p>Analisis nilai buku per kategori, departemen, aset tertinggi, status risiko, rasio depresiasi, dan rekomendasi manajemen aset.</p>
        </div>
        <div className="actions no-print">
          <button className="btn secondary" onClick={() => exportToCSV('analisis-nilai-buku-kategori.csv', categoryRows)}>Export CSV</button>
          <button className="btn primary" onClick={() => printReport('Analisis Nilai Buku')}>Cetak Analisis</button>
        </div>
      </section>

      <section className="chart-grid two-col">
        <ChartCard title="Nilai Buku per Kategori" subtitle="Perbandingan nilai buku antar kategori aset.">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryRows.filter(row => row.assetCount > 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
              <YAxis tickFormatter={v => `${Number(v) / 1000000} jt`} />
              <Tooltip formatter={(value: number) => rupiah(value)} />
              <Bar dataKey="bookValue" name="Nilai Buku" fill="#008D84" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Akumulasi Depresiasi per Departemen" subtitle="Beban depresiasi terkumpul per departemen.">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentRows.filter(row => row.assetCount > 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
              <YAxis tickFormatter={v => `${Number(v) / 1000000} jt`} />
              <Tooltip formatter={(value: number) => rupiah(value)} />
              <Bar dataKey="accumulatedDepreciation" name="Akumulasi Depresiasi" fill="#F5A623" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="split-section">
        <div>
          <h3>Analisis per Kategori</h3>
          <DataTable
            headers={['Kategori Aset', 'Harga Beli', 'Akumulasi Depresiasi', 'Nilai Buku', 'Jumlah Aset', 'Rasio Depresiasi']}
            rows={categoryRows.map(row => [row.category, rupiah(row.purchasePrice), rupiah(row.accumulatedDepreciation), rupiah(row.bookValue), row.assetCount, percent(row.depreciationRatio)])}
          />
        </div>
        <div>
          <h3>Analisis per Departemen</h3>
          <DataTable
            headers={['Departemen', 'Harga Beli', 'Akumulasi Depresiasi', 'Nilai Buku', 'Jumlah Aset', 'Rasio Depresiasi']}
            rows={departmentRows.map(row => [row.department, rupiah(row.purchasePrice), rupiah(row.accumulatedDepreciation), rupiah(row.bookValue), row.assetCount, percent(row.depreciationRatio)])}
          />
        </div>
      </section>

      <section>
        <h3>Top Aset Nilai Buku Tertinggi</h3>
        <DataTable
          headers={['Rank', 'ID Aset', 'Nama Aset', 'Kategori', 'Nilai Buku', 'Rekomendasi']}
          rows={topAssets.map((item, idx) => [idx + 1, item.id, item.name, item.category, rupiah(item.metrics.currentBookValue), item.metrics.recommendation])}
        />
      </section>

      <section>
        <h3>Daftar Aset Risiko</h3>
        <DataTable
          headers={['No', 'ID Aset', 'Nama Aset', 'Status', 'Nilai Buku', 'Rasio Depresiasi', 'Rekomendasi']}
          rows={risky.map((item, idx) => [idx + 1, item.id, item.name, <StatusBadge status={item.metrics.status} highValue={item.metrics.isHighValue} />, rupiah(item.metrics.currentBookValue), percent(item.metrics.depreciationRatio), item.metrics.recommendation])}
          emptyText="Belum ada aset yang masuk kategori risiko."
        />
      </section>

      <section className="formula-card">
        <h3>Rekomendasi Status Aset</h3>
        <div className="formula-grid">
          <p><b>Sehat:</b> Rasio depresiasi rendah / nilai buku masih signifikan.</p>
          <p><b>Perhatian:</b> Review kebutuhan penggantian atau perpanjangan masa manfaat.</p>
          <p><b>Risiko:</b> Evaluasi opsi dijual, diperbaiki, diganti, atau dihapuskan sesuai kebijakan akuntansi.</p>
          <p><b>Bernilai Tinggi:</b> Tambahkan monitoring fisik dan rekonsiliasi periodik.</p>
          <p><b>Catatan Audit:</b> Seluruh perhitungan menggunakan metode garis lurus dan nilai buku dibatasi tidak lebih kecil dari nilai residu.</p>
        </div>
      </section>
    </div>
  );
}
