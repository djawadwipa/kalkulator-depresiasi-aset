import type { AssetStatus } from '../types/asset';

interface StatusBadgeProps {
  status: AssetStatus | string;
  highValue?: boolean;
}

export function StatusBadge({ status, highValue = false }: StatusBadgeProps) {
  const cls = status.toLowerCase().replace(/\s+/g, '-');
  return (
    <span className={`status-badge status-${cls} ${highValue ? 'status-high' : ''}`}>
      {status}{highValue ? ' • Bernilai Tinggi' : ''}
    </span>
  );
}
