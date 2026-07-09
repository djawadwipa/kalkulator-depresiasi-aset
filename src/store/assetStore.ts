import { useEffect, useState } from 'react';
import { sampleAssets } from '../data/sampleAssets';
import type { Asset } from '../types/asset';
import { loadAssets, saveAssets } from '../utils/storage';

export function useAssetStore() {
  const [assets, setAssets] = useState<Asset[]>(() => loadAssets());

  useEffect(() => {
    saveAssets(assets);
  }, [assets]);

  const addAsset = (asset: Asset) => {
    setAssets(prev => {
      if (prev.some(item => item.id === asset.id)) {
        alert('ID aset sudah digunakan. Gunakan ID aset lain.');
        return prev;
      }
      return [...prev, asset];
    });
  };

  const updateAsset = (asset: Asset) => {
    setAssets(prev => prev.map(item => (item.id === asset.id ? asset : item)));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(item => item.id !== id));
  };

  const resetToSample = () => setAssets(sampleAssets);
  const replaceAssets = (newAssets: Asset[]) => setAssets(newAssets);

  return { assets, addAsset, updateAsset, deleteAsset, resetToSample, replaceAssets };
}
