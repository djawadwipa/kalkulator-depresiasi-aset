import type { AssetCategory, AssetStatus, Department, DepreciationMethod } from '../types/asset';

export const categories: AssetCategory[] = [
  'Kendaraan',
  'Mesin',
  'Peralatan Kantor',
  'Komputer & Laptop',
  'Furniture',
  'Bangunan',
  'Software',
  'Peralatan Operasional',
  'Lainnya'
];

export const departments: Department[] = [
  'Finance',
  'Accounting',
  'Operasional',
  'Produksi',
  'IT',
  'HR',
  'Procurement',
  'Sales',
  'Logistics',
  'Warehouse',
  'Management',
  'General Affairs'
];

export const statuses: AssetStatus[] = [
  'Aktif',
  'Mendekati Habis Umur Ekonomis',
  'Fully Depreciated',
  'Dijual',
  'Rusak',
  'Dihapuskan'
];

export const depreciationMethods: DepreciationMethod[] = ['Garis Lurus'];

export const pics = [
  'Andi Pratama',
  'Budi Santoso',
  'Citra Lestari',
  'Dewi Anggraini',
  'Eko Wijaya',
  'Finance Asset Team',
  'Procurement Team',
  'IT Asset Admin'
];

export const parameters = {
  highValueThreshold: 100_000_000,
  nearingEndRatio: 0.8,
  healthyMaxRatio: 0.6,
  maxMonthlySchedule: 120,
  maxAnnualSchedule: 20
};

export const statusDescriptions = [
  { status: 'Sehat', description: 'Aset aktif dan belum mendekati akhir umur ekonomis.' },
  { status: 'Perhatian', description: 'Sisa umur ekonomis rendah atau nilai buku mendekati residu.' },
  { status: 'Risiko', description: 'Aset telah mencapai nilai residu, rusak, dihapuskan, atau fully depreciated.' },
  { status: 'Bernilai Tinggi', description: 'Nilai buku aset melewati ambang aset bernilai tinggi.' }
];
