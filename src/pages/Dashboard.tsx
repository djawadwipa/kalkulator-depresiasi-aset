import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartCard } from '../components/ChartCard';
import { KpiCard } from '../components/KpiCard';
import { PrintHeader } from '../components/PrintHeader';
import { categories, departments } from '../data/masterData';
import type { Asset } from '../types/asset';
import { annualBookValueTrend, categoryAnalysis, getDashboardSummary, statusComposition } from '../utils/depreciation';
import { printReport } from '../utils/exportPrint';
import { rupiah } from '../utils/formatters';

interface DashboardProps { assets: Asset[]; }

const chartColors = ['#061B3A', '#008D84', '#F5A623', '#0B4A8B', '#64748B', '#B91C1C'];

export function Dashboard({ assets }: DashboardProps) {
  const [category, setCategory] = useState('Semua');
  const [department, setDepartment] = useState('Semua');

  const filteredAssets = useMemo(() => assets.filter(asset =>
    (category === 'Semua' || asset.category === category) &&
    (department === 'Semua' || asset.department === department)
  ), [assets, category, department]);

  const summary = useMemo(() => getDashboardSummary(filteredAssets), [filteredAssets]);
  const categoryRows = useMemo(() => categoryAnalysis(filteredAssets).filter(item => item.assetCount > 0), [filteredAssets]);
  const statusRows = useMemo(() => statusComposition(filteredAssets), [filteredAssets]);
  const trendRows = useMemo(() => annualBookValueTrend(filteredAssets), [filteredAssets]);

  return (
    <div className="page-stack printable-area">
      <PrintHeader title="Dashboard Eksekutif Aset Perusahaan" />
      <section className="hero-card dashboard-hero">
        <div>
          <img src="./assets/logo-horizontal.png" alt="Kalkulator Depresiasi Aset Perusahaan" className="hero-logo" />
          <h2>Dashboard Eksekutif Aset Perusahaan</h2>
          <p>Ringkasan penyusutan, nilai buku, status aset, dan indikator kinerja utama untuk manajemen.</p>
        </div>
        <div className="hero-actions no-print">
          <button className="btn secondary" onClick={() => { setCategory('Semua'); setDepartment('Semua'); }}>Reset Filter</button>
          <button className="btn primary" onClick={() => printReport('Dashboard Depresiasi Aset')}>Cetak Dashboard</button>
        </div>
      </section>

      <section className="filter-bar no-print">
        <label>Filter Kategori<select value={category} onChange={e => setCategory(e.target.value)}><option>Semua</option>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Filter Departemen<select value={department} onChange={e => setDepartment(e.target.value)}><option>Semua</option>{departments.map(item => <option key={item}>{item}</option>)}</select></label>
        <span className="last-update">Tanggal Update: {new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date())}</span>
      </section>

      <section className="kpi-grid">
        <KpiCard title="Total Jumlah Aset" value={summary.totalAssets} hint="Unit aset terdaftar" />
        <KpiCard title="Total Harga Beli Aset" value={rupiah(summary.totalPurchasePrice)} hint="Nilai akuisisi" />
        <KpiCard title="Total Akumulasi Depresiasi" value={rupiah(summary.totalAccumulatedDepreciation)} hint="Beban terkumpul" tone="gold" />
        <KpiCard title="Total Nilai Buku Aset" value={rupiah(summary.totalBookValue)} hint="Nilai buku saat ini" tone="teal" />
        <KpiCard title="Jumlah Aset Aktif" value={summary.activeAssets} hint="Status sehat" tone="teal" />
        <KpiCard title="Aset Hampir Habis Umur" value={summary.nearingEndAssets} hint="Perlu review" tone="gold" />
        <KpiCard title="Aset Fully Depreciated" value={summary.fullyDepreciatedAssets} hint="Risiko/disposal" tone="red" />
        <KpiCard title="Aset Bernilai Tinggi" value={summary.highValueAssets} hint="Monitoring prioritas" tone="gold" />
      </section>

      <section className="chart-grid two-col">
        <ChartCard title="Nilai Buku per Kategori" subtitle="Total nilai buku setelah depresiasi berjalan.">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
              <YAxis tickFormatter={v => `${Number(v) / 1000000} jt`} />
              <Tooltip formatter={(value: number) => rupiah(value)} />
              <Bar dataKey="bookValue" name="Nilai Buku" fill="#008D84" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Jumlah Aset per Kategori" subtitle="Distribusi aset berdasarkan kategori.">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="assetCount" name="Jumlah Aset" fill="#061B3A" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Akumulasi Depresiasi per Kategori" subtitle="Total akumulasi depresiasi berjalan.">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
              <YAxis tickFormatter={v => `${Number(v) / 1000000} jt`} />
              <Tooltip formatter={(value: number) => rupiah(value)} />
              <Bar dataKey="accumulatedDepreciation" name="Akumulasi" fill="#F5A623" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Komposisi Status Aset" subtitle="Hijau aktif, kuning perhatian, merah risiko.">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusRows} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} label>
                {statusRows.map((_, index) => <Cell key={index} fill={chartColors[index % chartColors.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Tren Total Nilai Buku Akhir Tahun" subtitle="Simulasi nilai buku akhir tahun 2021–2035.">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={v => `${Number(v) / 1000000000} M`} />
              <Tooltip formatter={(value: number) => rupiah(value)} />
              <Line type="monotone" dataKey="totalBookValue" name="Nilai Buku" stroke="#008D84" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="legend-card">
        <h3>Indikator Status Aset</h3>
        <div className="legend-list">
          <span><b className="dot green" />Hijau: aset masih sehat</span>
          <span><b className="dot gold" />Kuning: mendekati akhir umur ekonomis</span>
          <span><b className="dot red" />Merah: sudah habis masa ekonomis</span>
          <span><b className="dot navy" />Emas/Navy: aset bernilai tinggi</span>
        </div>
      </section>
    </div>
  );
}
