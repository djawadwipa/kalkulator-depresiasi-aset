import { useMemo, useRef, useState } from 'react';
import { AssetFormModal } from '../components/AssetFormModal';
import { DataTable } from '../components/DataTable';
import { PrintHeader } from '../components/PrintHeader';
import { StatusBadge } from '../components/StatusBadge';
import { categories, departments } from '../data/masterData';
import type { Asset } from '../types/asset';
import { calculateAssetMetrics } from '../utils/depreciation';
import { exportToCSV, exportToJSON, printReport } from '../utils/exportPrint';
import { formatDate, rupiah } from '../utils/formatters';

interface InputDataAsetProps {
  assets: Asset[];
  addAsset: (asset: Asset) => void;
  updateAsset: (asset: Asset) => void;
  deleteAsset: (id: string) => void;
  resetToSample: () => void;
  replaceAssets: (assets: Asset[]) => void;
}

export function InputDataAset({ assets, addAsset, updateAsset, deleteAsset, resetToSample, replaceAssets }: InputDataAsetProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Semua');
  const [department, setDepartment] = useState('Semua');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const filteredAssets = useMemo(() => assets.filter(asset => {
    const keyword = `${asset.id} ${asset.name} ${asset.category} ${asset.department} ${asset.note}`.toLowerCase();
    return keyword.includes(search.toLowerCase()) &&
      (category === 'Semua' || asset.category === category) &&
      (department === 'Semua' || asset.department === department);
  }), [assets, search, category, department]);

  const nextId = useMemo(() => {
    const numbers = assets.map(asset => Number(asset.id.replace(/\D/g, ''))).filter(Boolean);
    const next = Math.max(0, ...numbers) + 1;
    return `AST-${String(next).padStart(3, '0')}`;
  }, [assets]);

  const rows = filteredAssets.map(asset => {
    const metrics = calculateAssetMetrics(asset);
    return [
      asset.id,
      <strong>{asset.name}</strong>,
      asset.category,
      asset.department,
      formatDate(asset.purchaseDate),
      rupiah(asset.purchasePrice),
      `${asset.usefulLifeYears} th`,
      `${asset.usefulLifeYears * 12} bln`,
      rupiah(asset.residualValue),
      asset.method,
      formatDate(asset.depreciationStartDate),
      <StatusBadge status={metrics.status} highValue={metrics.isHighValue} />,
      asset.note,
      <div className="row-actions no-print">
        <button className="btn tiny" onClick={() => { setEditing(asset); setModalOpen(true); }}>Edit</button>
        <button className="btn tiny danger" onClick={() => confirm(`Hapus aset ${asset.id}?`) && deleteAsset(asset.id)}>Hapus</button>
      </div>
    ];
  });

  const exportRows = filteredAssets.map(asset => {
    const metrics = calculateAssetMetrics(asset);
    return {
      'ID Aset': asset.id,
      'Nama Aset': asset.name,
      'Kategori Aset': asset.category,
      'Departemen/Pengguna': asset.department,
      'Tanggal Pembelian': asset.purchaseDate,
      'Harga Beli': asset.purchasePrice,
      'Umur Ekonomis Tahun': asset.usefulLifeYears,
      'Umur Ekonomis Bulan': asset.usefulLifeYears * 12,
      'Nilai Residu': asset.residualValue,
      'Metode Depresiasi': asset.method,
      'Tanggal Mulai Depresiasi': asset.depreciationStartDate,
      'Status Aset': metrics.status,
      'Catatan': asset.note
    };
  });

  const handleSubmit = (asset: Asset) => {
    if (editing) updateAsset(asset); else addAsset(asset);
    setModalOpen(false);
    setEditing(null);
  };

  const importJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Asset[];
        if (!Array.isArray(parsed)) throw new Error('Format JSON tidak valid.');
        replaceAssets(parsed);
        alert('Import JSON berhasil.');
      } catch {
        alert('File JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="page-stack printable-area">
      <PrintHeader title="Input Data Aset" />
      <section className="section-heading">
        <div>
          <h2>Input Data Aset</h2>
          <p>Isi data aset tetap perusahaan. Kolom input mengikuti workbook Excel; kolom umur bulan dan status dihitung otomatis.</p>
        </div>
        <div className="actions no-print">
          <button className="btn primary" onClick={() => { setEditing(null); setModalOpen(true); }}>+ Tambah Aset</button>
          <button className="btn secondary" onClick={() => exportToCSV('input-data-aset.csv', exportRows)}>Export CSV</button>
          <button className="btn secondary" onClick={() => exportToJSON('backup-data-aset.json', assets)}>Backup JSON</button>
          <button className="btn secondary" onClick={() => importRef.current?.click()}>Import JSON</button>
          <button className="btn secondary" onClick={() => printReport('Input Data Aset')}>Cetak</button>
          <button className="btn danger" onClick={() => confirm('Reset semua data ke data contoh Excel?') && resetToSample()}>Reset Sample</button>
          <input ref={importRef} type="file" accept="application/json" hidden onChange={e => e.target.files?.[0] && importJSON(e.target.files[0])} />
        </div>
      </section>

      <section className="filter-bar no-print">
        <label>Cari Aset<input placeholder="Cari ID, nama, kategori, departemen..." value={search} onChange={e => setSearch(e.target.value)} /></label>
        <label>Kategori<select value={category} onChange={e => setCategory(e.target.value)}><option>Semua</option>{categories.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Departemen<select value={department} onChange={e => setDepartment(e.target.value)}><option>Semua</option>{departments.map(item => <option key={item}>{item}</option>)}</select></label>
      </section>

      <DataTable
        headers={['ID Aset', 'Nama Aset', 'Kategori', 'Departemen', 'Tanggal Beli', 'Harga Beli', 'Umur Tahun', 'Umur Bulan', 'Nilai Residu', 'Metode', 'Mulai Depresiasi', 'Status', 'Catatan', 'Aksi']}
        rows={rows}
      />

      <AssetFormModal open={modalOpen} initial={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSubmit={handleSubmit} nextId={nextId} />
    </div>
  );
}
