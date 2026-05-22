"use client";

type MiniChartProps = {
  values: number[];
  color: string;
  label: string;
};

export function MiniChart({ values, color, label }: MiniChartProps) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 0 : (index / (values.length - 1)) * 100;
      const y = 44 - ((value - min) / Math.max(max - min, 1)) * 38;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="mini-chart" viewBox="0 0 100 48" role="img" aria-label={label}>
      <defs>
        <linearGradient id={`fill-${label.replace(/\W/g, "")}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.42" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,48 ${points} 100,48`} fill={`url(#fill-${label.replace(/\W/g, "")})`} stroke="none" />
      <polyline points={points} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </svg>
  );
}
