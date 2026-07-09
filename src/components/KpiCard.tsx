interface KpiCardProps {
  title: string;
  value: string | number;
  hint?: string;
  tone?: 'navy' | 'teal' | 'gold' | 'red' | 'neutral';
}

export function KpiCard({ title, value, hint, tone = 'navy' }: KpiCardProps) {
  return (
    <div className={`kpi-card tone-${tone}`}>
      <span className="kpi-title">{title}</span>
      <strong className="kpi-value">{value}</strong>
      {hint ? <small className="kpi-hint">{hint}</small> : null}
    </div>
  );
}
