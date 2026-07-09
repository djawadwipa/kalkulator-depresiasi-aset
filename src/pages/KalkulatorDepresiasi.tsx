import { useMemo, useState } from 'react';
import { KpiCard } from '../components/KpiCard';
import { PrintHeader } from '../components/PrintHeader';
import { StatusBadge } from '../components/StatusBadge';
import type { Asset } from '../types/asset';
import { calculateAssetMetrics } from '../utils/depreciation';
import { printReport } from '../utils/exportPrint';
import { formatDate, percent, rupiah } from '../utils/formatters';

interface KalkulatorDepresiasiProps { assets: Asset[]; }

export function KalkulatorDepresiasi({ assets }: KalkulatorDepresiasiProps) {
  const [selectedId, setSelectedId] = useState(assets[0]?.id ?? '');
  const asset = useMemo(() => assets.find(item => item.id === selectedId) ?? assets[0], [assets, selectedId]);
  const metrics = asset ? calculateAssetMetrics(asset) : null;

  if (!asset || !metrics) {
    return <div className="empty-state">Belum ada aset. Tambahkan data aset terlebih dahulu.</div>;
  }

  return (
    <div className="page-stack printable-area">
      <PrintHeader title="Kalkulator Depresiasi" />
      <section className="section-heading">
        <div>
          <h2>Kalkulator Depresiasi</h2>
          <p>Kalkulator garis lurus untuk menghitung dasar depresiasi, depresiasi tahunan/bulanan, nilai buku, sisa umur, dan status aset.</p>
        </div>
        <div className="actions no-print">
          <button className="btn primary" onClick={() => printReport('Kalkulator Depresiasi')}>Cetak Hasil</button>
        </div>
      </section>

      <section className="calculator-grid">
        <div className="panel-card">
          <h3>Input</h3>
          <label>Pilih Nama Aset<select value={asset.id} onChange={e => setSelectedId(e.target.value)}>{assets.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <div className="field-list">
            <span><b>Harga Beli</b>{rupiah(asset.purchasePrice)}</span>
            <span><b>Umur Ekonomis Tahun</b>{asset.usefulLifeYears} tahun</span>
            <span><b>Umur Ekonomis Bulan</b>{metrics.usefulLifeMonths} bulan</span>
            <span><b>Nilai Residu</b>{rupiah(asset.residualValue)}</span>
            <span><b>Tanggal Mulai Depresiasi</b>{formatDate(asset.depreciationStartDate)}</span>
            <span><b>Metode Depresiasi</b>{asset.method}</span>
          </div>
        </div>

        <div className="panel-card output-card">
          <h3>Output</h3>
          <div className="mini-kpi-grid">
            <KpiCard title="Dasar Depresiasi" value={rupiah(metrics.depreciableBase)} />
            <KpiCard title="Depresiasi Tahunan" value={rupiah(metrics.annualDepreciation)} />
            <KpiCard title="Depresiasi Bulanan" value={rupiah(metrics.monthlyDepreciation)} />
            <KpiCard title="Jumlah Bulan Berjalan" value={`${metrics.elapsedMonths} bulan`} />
            <KpiCard title="Akumulasi Depresiasi" value={rupiah(metrics.accumulatedDepreciation)} tone="gold" />
            <KpiCard title="Nilai Buku Saat Ini" value={rupiah(metrics.currentBookValue)} tone="teal" />
            <KpiCard title="Sisa Umur Ekonomis" value={`${metrics.remainingLifeMonths} bulan`} />
            <KpiCard title="Rasio Depresiasi" value={percent(metrics.depreciationRatio)} tone="gold" />
          </div>
          <div className="status-panel">
            <StatusBadge status={metrics.status} highValue={metrics.isHighValue} />
            <div className="progress"><span style={{ width: `${Math.min(metrics.depreciationRatio * 100, 100)}%` }} /></div>
            <p>{metrics.recommendation}</p>
          </div>
        </div>
      </section>

      <section className="formula-card">
        <h3>Catatan Perhitungan</h3>
        <div className="formula-grid">
          <p><b>Dasar Depresiasi</b> = Harga Beli - Nilai Residu</p>
          <p><b>Depresiasi Tahunan</b> = Dasar Depresiasi / Umur Ekonomis Tahun</p>
          <p><b>Depresiasi Bulanan</b> = Dasar Depresiasi / Umur Ekonomis Bulan</p>
          <p><b>Akumulasi Depresiasi</b> = Depresiasi Bulanan × Jumlah Bulan Berjalan</p>
          <p><b>Nilai Buku</b> tidak boleh lebih kecil dari nilai residu.</p>
          <p><b>Status</b> hijau sehat, kuning mendekati akhir umur, merah fully depreciated.</p>
        </div>
      </section>
    </div>
  );
}
