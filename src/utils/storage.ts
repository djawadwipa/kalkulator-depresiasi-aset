import { sampleAssets } from '../data/sampleAssets';
import type { Asset } from '../types/asset';

const STORAGE_KEY = 'kalkulator-depresiasi-aset:data:v1';

export function loadAssets(): Asset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleAssets;
    const parsed = JSON.parse(raw) as Asset[];
    if (!Array.isArray(parsed) || parsed.length === 0) return sampleAssets;
    return parsed;
  } catch {
    return sampleAssets;
  }
}

export function saveAssets(assets: Asset[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
}

export function resetAssets(): Asset[] {
  saveAssets(sampleAssets);
  return sampleAssets;
}
