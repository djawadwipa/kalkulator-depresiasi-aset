export type AssetCategory =
  | 'Kendaraan'
  | 'Mesin'
  | 'Peralatan Kantor'
  | 'Komputer & Laptop'
  | 'Furniture'
  | 'Bangunan'
  | 'Software'
  | 'Peralatan Operasional'
  | 'Lainnya';

export type Department =
  | 'Finance'
  | 'Accounting'
  | 'Operasional'
  | 'Produksi'
  | 'IT'
  | 'HR'
  | 'Procurement'
  | 'Sales'
  | 'Logistics'
  | 'Warehouse'
  | 'Management'
  | 'General Affairs';

export type AssetStatus =
  | 'Aktif'
  | 'Mendekati Habis Umur Ekonomis'
  | 'Fully Depreciated'
  | 'Dijual'
  | 'Rusak'
  | 'Dihapuskan';

export type DepreciationMethod = 'Garis Lurus';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  department: Department;
  purchaseDate: string;
  purchasePrice: number;
  usefulLifeYears: number;
  residualValue: number;
  method: DepreciationMethod;
  depreciationStartDate: string;
  manualStatus: AssetStatus;
  pic: string;
  note: string;
}

export interface AssetMetrics {
  usefulLifeMonths: number;
  depreciableBase: number;
  annualDepreciation: number;
  monthlyDepreciation: number;
  elapsedMonths: number;
  accumulatedDepreciation: number;
  currentBookValue: number;
  remainingLifeMonths: number;
  depreciationRatio: number;
  status: AssetStatus;
  isHighValue: boolean;
  recommendation: string;
}

export interface MonthlyScheduleRow {
  assetId: string;
  assetName: string;
  monthNo: number;
  period: string;
  purchasePrice: number;
  residualValue: number;
  monthlyDepreciation: number;
  accumulatedDepreciation: number;
  openingBookValue: number;
  closingBookValue: number;
  status: AssetStatus;
}

export interface AnnualScheduleRow {
  assetId: string;
  assetName: string;
  yearNo: number;
  depreciationYear: number;
  purchasePrice: number;
  residualValue: number;
  annualDepreciation: number;
  accumulatedDepreciation: number;
  openingBookValue: number;
  closingBookValue: number;
  status: AssetStatus;
}
