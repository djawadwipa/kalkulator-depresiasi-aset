import { useEffect, useState } from 'react';
import { categories, departments, depreciationMethods, pics, statuses } from '../data/masterData';
import type { Asset } from '../types/asset';
import { toInputDate } from '../utils/formatters';

interface AssetFormModalProps {
  open: boolean;
  initial?: Asset | null;
  onClose: () => void;
  onSubmit: (asset: Asset) => void;
  nextId: string;
}

function createDefaultAsset(nextId: string): Asset {
  return {
    id: nextId,
    name: '',
    category: 'Kendaraan',
    department: 'Finance',
    purchaseDate: toInputDate(),
    purchasePrice: 0,
    usefulLifeYears: 5,
    residualValue: 0,
    method: 'Garis Lurus',
    depreciationStartDate: toInputDate(),
    manualStatus: 'Aktif',
    pic: 'Finance Asset Team',
    note: ''
  };
}

export function AssetFormModal({ open, initial, onClose, onSubmit, nextId }: AssetFormModalProps) {
  const [form, setForm] = useState<Asset>(initial ?? createDefaultAsset(nextId));
  const usefulLifeMonths = Number(form.usefulLifeYears || 0) * 12;

  useEffect(() => {
    if (open) setForm(initial ?? createDefaultAsset(nextId));
  }, [open, initial, nextId]);

  if (!open) return null;

  const update = (key: keyof Asset, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = () => {
    if (!form.id.trim() || !form.name.trim() || form.purchasePrice <= 0 || form.usefulLifeYears <= 0) {
      alert('ID aset, nama aset, harga beli, dan umur ekonomis wajib diisi dengan benar.');
      return;
    }
    if (form.residualValue > form.purchasePrice) {
      alert('Nilai residu tidak boleh lebih besar dari harga beli.');
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2>{initial ? 'Edit Data Aset' : 'Tambah Data Aset'}</h2>
            <p>Kolom otomatis: umur ekonomis bulan = tahun × 12.</p>
          </div>
          <button className="icon-button" onClick={onClose}>×</button>
        </div>

        <div className="form-grid">
          <label>ID Aset<input value={form.id} onChange={e => update('id', e.target.value.toUpperCase())} /></label>
          <label>Nama Aset<input value={form.name} onChange={e => update('name', e.target.value)} /></label>
          <label>Kategori<select value={form.category} onChange={e => update('category', e.target.value)}>{categories.map(v => <option key={v}>{v}</option>)}</select></label>
          <label>Departemen/Pengguna<select value={form.department} onChange={e => update('department', e.target.value)}>{departments.map(v => <option key={v}>{v}</option>)}</select></label>
          <label>Tanggal Pembelian<input type="date" value={form.purchaseDate} onChange={e => update('purchaseDate', e.target.value)} /></label>
          <label>Harga Beli<input type="number" value={form.purchasePrice} onChange={e => update('purchasePrice', Number(e.target.value))} /></label>
          <label>Umur Ekonomis Tahun<input type="number" min="1" value={form.usefulLifeYears} onChange={e => update('usefulLifeYears', Number(e.target.value))} /></label>
          <label>Umur Ekonomis Bulan<input readOnly className="readonly" value={usefulLifeMonths} /></label>
          <label>Nilai Residu<input type="number" min="0" value={form.residualValue} onChange={e => update('residualValue', Number(e.target.value))} /></label>
          <label>Metode Depresiasi<select value={form.method} onChange={e => update('method', e.target.value)}>{depreciationMethods.map(v => <option key={v}>{v}</option>)}</select></label>
          <label>Tanggal Mulai Depresiasi<input type="date" value={form.depreciationStartDate} onChange={e => update('depreciationStartDate', e.target.value)} /></label>
          <label>Status Aset<select value={form.manualStatus} onChange={e => update('manualStatus', e.target.value)}>{statuses.map(v => <option key={v}>{v}</option>)}</select></label>
          <label>PIC/Penanggung Jawab<select value={form.pic} onChange={e => update('pic', e.target.value)}>{pics.map(v => <option key={v}>{v}</option>)}</select></label>
          <label className="span-2">Catatan<textarea value={form.note} onChange={e => update('note', e.target.value)} /></label>
        </div>

        <div className="modal-actions">
          <button className="btn secondary" onClick={onClose}>Batal</button>
          <button className="btn primary" onClick={submit}>Simpan Data Aset</button>
        </div>
      </div>
    </div>
  );
}
