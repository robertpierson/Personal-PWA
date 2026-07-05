/**
 * Dependency-free area/line chart rendered as SVG. Pure presentational
 * component — safe to render on the server. Scales to its container width via a
 * fixed viewBox with non-uniform preserveAspectRatio.
 */
export function AreaChart({
  data,
  labels,
  color = "var(--color-forest)",
  height = 220,
  formatValue = (n: number) => n.toLocaleString(),
}: {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  formatValue?: (n: number) => string;
}) {
  const W = 760;
  const H = 260;
  const padX = 8;
  const padTop = 16;
  const padBottom = 28;

  if (data.length === 0) {
    return (
      <div
        className="grid place-items-center rounded-xl border border-dashed border-line text-sm text-ink-faint"
        style={{ height }}
      >
        No data yet
      </div>
    );
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const innerW = W - padX * 2;
  const innerH = H - padTop - padBottom;

  const x = (i: number) =>
    padX + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => padTop + innerH - ((v - min) / range) * innerH;

  const linePath = data
    .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L ${x(data.length - 1).toFixed(1)} ${padTop + innerH} L ${x(0).toFixed(1)} ${padTop + innerH} Z`;

  const gradientId = `area-grad-${color.replace(/[^a-z]/gi, "")}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={height}
      preserveAspectRatio="none"
      role="img"
      aria-label="Trend chart"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* baseline gridlines */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padX}
          x2={W - padX}
          y1={padTop + innerH * f}
          y2={padTop + innerH * f}
          stroke="var(--color-line)"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
      ))}

      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* endpoint marker */}
      <circle
        cx={x(data.length - 1)}
        cy={y(data[data.length - 1])}
        r="4"
        fill={color}
      />

      {/* sparse x labels */}
      {labels &&
        labels.map((label, i) => {
          const show =
            i === 0 ||
            i === labels.length - 1 ||
            i === Math.floor(labels.length / 2);
          if (!show) return null;
          return (
            <text
              key={i}
              x={x(i)}
              y={H - 8}
              textAnchor={i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"}
              fontSize="12"
              fill="var(--color-ink-faint)"
            >
              {label}
            </text>
          );
        })}

      <title>{`${formatValue(min)} – ${formatValue(max)}`}</title>
    </svg>
  );
}
