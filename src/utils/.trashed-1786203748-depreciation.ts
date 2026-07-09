import { categories, departments, parameters } from '../data/masterData';
import type { AnnualScheduleRow, Asset, AssetMetrics, AssetStatus, MonthlyScheduleRow } from '../types/asset';
import { monthYear } from './formatters';

function safeNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function parseLocalDate(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + months, 1);
  return d;
}

function monthDiffInclusive(start: Date, end: Date): number {
  const startMonth = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
  if (startMonth > endMonth) return 0;
  return (endMonth.getFullYear() - startMonth.getFullYear()) * 12 + (endMonth.getMonth() - startMonth.getMonth()) + 1;
}

export function calculateAssetMetrics(asset: Asset, asOf: Date = new Date()): AssetMetrics {
  const usefulLifeYears = Math.max(safeNumber(asset.usefulLifeYears), 0);
  const usefulLifeMonths = usefulLifeYears * 12;
  const depreciableBase = Math.max(safeNumber(asset.purchasePrice) - safeNumber(asset.residualValue), 0);
  const annualDepreciation = usefulLifeYears > 0 ? depreciableBase / usefulLifeYears : 0;
  const monthlyDepreciation = usefulLifeMonths > 0 ? depreciableBase / usefulLifeMonths : 0;
  const startDate = parseLocalDate(asset.depreciationStartDate);
  const elapsedMonths = Math.min(monthDiffInclusive(startDate, asOf), usefulLifeMonths);
  const accumulatedDepreciation = Math.min(monthlyDepreciation * elapsedMonths, depreciableBase);
  const currentBookValue = Math.max(safeNumber(asset.purchasePrice) - accumulatedDepreciation, safeNumber(asset.residualValue));
  const remainingLifeMonths = Math.max(usefulLifeMonths - elapsedMonths, 0);
  const depreciationRatio = depreciableBase > 0 ? accumulatedDepreciation / depreciableBase : 0;
  const status = resolveStatus(asset.manualStatus, currentBookValue, asset.residualValue, depreciationRatio, remainingLifeMonths);
  const isHighValue = currentBookValue >= parameters.highValueThreshold;
  const recommendation = buildRecommendation(status, isHighValue);

  return {
    usefulLifeMonths,
    depreciableBase,
    annualDepreciation,
    monthlyDepreciation,
    elapsedMonths,
    accumulatedDepreciation,
    currentBookValue,
    remainingLifeMonths,
    depreciationRatio,
    status,
    isHighValue,
    recommendation
  };
}

function resolveStatus(
  manualStatus: AssetStatus,
  bookValue: number,
  residualValue: number,
  ratio: number,
  remainingMonths: number
): AssetStatus {
  if (['Dijual', 'Rusak', 'Dihapuskan'].includes(manualStatus)) return manualStatus;
  if (bookValue <= residualValue + 1 || remainingMonths <= 0) return 'Fully Depreciated';
  if (ratio >= parameters.nearingEndRatio) return 'Mendekati Habis Umur Ekonomis';
  return 'Aktif';
}

function buildRecommendation(status: AssetStatus, isHighValue: boolean): string {
  if (status === 'Fully Depreciated') return 'Evaluasi penggantian, disposal, atau perpanjangan masa manfaat sesuai kebijakan.';
  if (['Dijual', 'Rusak', 'Dihapuskan'].includes(status)) return 'Lakukan rekonsiliasi fisik, dokumen disposal, dan approval manajemen.';
  if (status === 'Mendekati Habis Umur Ekonomis') return 'Review kebutuhan penggantian, perawatan, atau penyesuaian masa manfaat.';
  if (isHighValue) return 'Prioritaskan monitoring aset bernilai tinggi dan rekonsiliasi fisik berkala.';
  return 'Monitoring normal.';
}

export function buildMonthlySchedule(assets: Asset[], assetId = 'Semua'): MonthlyScheduleRow[] {
  const selected = assetId === 'Semua' ? assets : assets.filter(asset => asset.id === assetId);
  const rows: MonthlyScheduleRow[] = [];
  selected.forEach(asset => {
    const metrics = calculateAssetMetrics(asset);
    const start = parseLocalDate(asset.depreciationStartDate);
    const maxMonths = Math.min(metrics.usefulLifeMonths, parameters.maxMonthlySchedule);
    for (let monthNo = 1; monthNo <= maxMonths; monthNo += 1) {
      const accumulated = Math.min(metrics.monthlyDepreciation * monthNo, metrics.depreciableBase);
      const previousAccumulated = Math.min(metrics.monthlyDepreciation * (monthNo - 1), metrics.depreciableBase);
      const opening = Math.max(asset.purchasePrice - previousAccumulated, asset.residualValue);
      const closing = Math.max(asset.purchasePrice - accumulated, asset.residualValue);
      const ratio = metrics.depreciableBase > 0 ? accumulated / metrics.depreciableBase : 0;
      const status = closing <= asset.residualValue + 1 ? 'Fully Depreciated' : ratio >= parameters.nearingEndRatio ? 'Mendekati Habis Umur Ekonomis' : 'Aktif';
      rows.push({
        assetId: asset.id,
        assetName: asset.name,
        monthNo,
        period: monthYear(addMonths(start, monthNo - 1)),
        purchasePrice: asset.purchasePrice,
        residualValue: asset.residualValue,
        monthlyDepreciation: metrics.monthlyDepreciation,
        accumulatedDepreciation: accumulated,
        openingBookValue: opening,
        closingBookValue: closing,
        status
      });
      if (closing <= asset.residualValue + 1) break;
    }
  });
  return rows;
}

export function buildAnnualSchedule(assets: Asset[], assetId = 'Semua'): AnnualScheduleRow[] {
  const selected = assetId === 'Semua' ? assets : assets.filter(asset => asset.id === assetId);
  const rows: AnnualScheduleRow[] = [];
  selected.forEach(asset => {
    const metrics = calculateAssetMetrics(asset);
    const start = parseLocalDate(asset.depreciationStartDate);
    const maxYears = Math.min(asset.usefulLifeYears, parameters.maxAnnualSchedule);
    for (let yearNo = 1; yearNo <= maxYears; yearNo += 1) {
      const accumulated = Math.min(metrics.annualDepreciation * yearNo, metrics.depreciableBase);
      const previousAccumulated = Math.min(metrics.annualDepreciation * (yearNo - 1), metrics.depreciableBase);
      const opening = Math.max(asset.purchasePrice - previousAccumulated, asset.residualValue);
      const closing = Math.max(asset.purchasePrice - accumulated, asset.residualValue);
      const ratio = metrics.depreciableBase > 0 ? accumulated / metrics.depreciableBase : 0;
      const status = closing <= asset.residualValue + 1 ? 'Fully Depreciated' : ratio >= parameters.nearingEndRatio ? 'Mendekati Habis Umur Ekonomis' : 'Aktif';
      rows.push({
        assetId: asset.id,
        assetName: asset.name,
        yearNo,
        depreciationYear: start.getFullYear() + yearNo - 1,
        purchasePrice: asset.purchasePrice,
        residualValue: asset.residualValue,
        annualDepreciation: metrics.annualDepreciation,
        accumulatedDepreciation: accumulated,
        openingBookValue: opening,
        closingBookValue: closing,
        status
      });
      if (closing <= asset.residualValue + 1) break;
    }
  });
  return rows;
}

export function getDashboardSummary(assets: Asset[]) {
  const metrics = assets.map(asset => ({ asset, metrics: calculateAssetMetrics(asset) }));
  return {
    totalAssets: assets.length,
    totalPurchasePrice: assets.reduce((sum, asset) => sum + asset.purchasePrice, 0),
    totalAccumulatedDepreciation: metrics.reduce((sum, item) => sum + item.metrics.accumulatedDepreciation, 0),
    totalBookValue: metrics.reduce((sum, item) => sum + item.metrics.currentBookValue, 0),
    activeAssets: metrics.filter(item => item.metrics.status === 'Aktif').length,
    nearingEndAssets: metrics.filter(item => item.metrics.status === 'Mendekati Habis Umur Ekonomis').length,
    fullyDepreciatedAssets: metrics.filter(item => item.metrics.status === 'Fully Depreciated').length,
    highValueAssets: metrics.filter(item => item.metrics.isHighValue).length
  };
}

export function categoryAnalysis(assets: Asset[]) {
  return categories.map(category => {
    const selected = assets.filter(asset => asset.category === category);
    const purchasePrice = selected.reduce((sum, asset) => sum + asset.purchasePrice, 0);
    const accumulated = selected.reduce((sum, asset) => sum + calculateAssetMetrics(asset).accumulatedDepreciation, 0);
    const bookValue = selected.reduce((sum, asset) => sum + calculateAssetMetrics(asset).currentBookValue, 0);
    return {
      name: category,
      category,
      purchasePrice,
      accumulatedDepreciation: accumulated,
      bookValue,
      assetCount: selected.length,
      depreciationRatio: purchasePrice > 0 ? accumulated / purchasePrice : 0
    };
  });
}

export function departmentAnalysis(assets: Asset[]) {
  return departments.map(department => {
    const selected = assets.filter(asset => asset.department === department);
    const purchasePrice = selected.reduce((sum, asset) => sum + asset.purchasePrice, 0);
    const accumulated = selected.reduce((sum, asset) => sum + calculateAssetMetrics(asset).accumulatedDepreciation, 0);
    const bookValue = selected.reduce((sum, asset) => sum + calculateAssetMetrics(asset).currentBookValue, 0);
    return {
      name: department,
      department,
      purchasePrice,
      accumulatedDepreciation: accumulated,
      bookValue,
      assetCount: selected.length,
      depreciationRatio: purchasePrice > 0 ? accumulated / purchasePrice : 0
    };
  });
}

export function statusComposition(assets: Asset[]) {
  const counts = new Map<string, number>();
  assets.forEach(asset => {
    const status = calculateAssetMetrics(asset).status;
    counts.set(status, (counts.get(status) ?? 0) + 1);
  });
  return Array.from(counts).map(([name, value]) => ({ name, value }));
}

export function topBookValueAssets(assets: Asset[], limit = 10) {
  return assets
    .map(asset => ({ ...asset, metrics: calculateAssetMetrics(asset) }))
    .sort((a, b) => b.metrics.currentBookValue - a.metrics.currentBookValue)
    .slice(0, limit);
}

export function riskAssets(assets: Asset[], limit = 10) {
  return assets
    .map(asset => ({ ...asset, metrics: calculateAssetMetrics(asset) }))
    .filter(item => item.metrics.status !== 'Aktif' || item.metrics.depreciationRatio >= parameters.nearingEndRatio)
    .sort((a, b) => b.metrics.depreciationRatio - a.metrics.depreciationRatio)
    .slice(0, limit);
}

export function annualBookValueTrend(assets: Asset[], startYear = 2021, endYear = 2035) {
  const result = [];
  for (let year = startYear; year <= endYear; year += 1) {
    const asOf = new Date(year, 11, 31);
    const totalBookValue = assets.reduce((sum, asset) => sum + calculateAssetMetrics(asset, asOf).currentBookValue, 0);
    result.push({ year, totalBookValue });
  }
  return result;
}
