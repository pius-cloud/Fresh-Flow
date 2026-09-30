import React, { useState } from 'react';
import { WeeklyChain } from '../data';
import { formatGBP, formatPct } from '../utils/calculations';

interface WeeklyTrendChartProps {
  data: WeeklyChain[];
}

export const WeeklyTrendChart: React.FC<WeeklyTrendChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Dimensions
  const width = 800;
  const height = 280;
  const padding = { top: 30, right: 55, bottom: 40, left: 60 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Max bounds
  const maxWaste = 6000;
  const maxStockout = 7.0;

  // Scale generators
  const getX = (index: number) => {
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getYWaste = (val: number) => {
    return padding.top + chartHeight - (val / maxWaste) * chartHeight;
  };

  const getYStockout = (val: number) => {
    return padding.top + chartHeight - (val / maxStockout) * chartHeight;
  };

  // Generate SVG paths
  const wastePoints = data.map((d, i) => `${getX(i)},${getYWaste(d.waste_gbp)}`);
  const wastePath = `M ${wastePoints.join(' L ')}`;
  const wasteAreaPath = `${wastePath} L ${getX(data.length - 1)},${padding.top + chartHeight} L ${getX(0)},${padding.top + chartHeight} Z`;

  const stockoutPoints = data.map((d, i) => `${getX(i)},${getYStockout(d.stockout_pct)}`);
  const stockoutPath = `M ${stockoutPoints.join(' L ')}`;

  const activeData = hoveredIndex !== null ? data[hoveredIndex] : data[data.length - 1];

  return (
    <div className="bg-white border border-[#DDD6FE] rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#F3EEFF]">
        <div>
          <h2 className="text-lg font-bold text-[#4C1D95] font-heading">
            Weekly Trend: Waste £ vs. Stockout %
          </h2>
          <p className="text-xs text-[#111111]/70">
            Chain-wide trajectory across Weeks 1–13 (July–September 2026)
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#6D28D9]"></span>
            <span className="font-medium text-[#111111]">Waste (£)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-[#111111] rounded-full"></span>
            <span className="font-medium text-[#111111]">Stockout (%)</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="mt-4 relative overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ minHeight: '220px' }}
        >
          <defs>
            {/* Soft purple gradient for waste area */}
            <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#6D28D9" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 1500, 3000, 4500, 6000].map((val) => {
            const y = getYWaste(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#F3EEFF"
                  strokeWidth="1.5"
                  strokeDasharray={val === 0 ? '0' : '4 4'}
                />
                {/* Left Y Axis Label (Waste £) */}
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[10px] font-mono fill-[#111111]/60"
                >
                  £{val}
                </text>
              </g>
            );
          })}

          {/* Right Y Axis Labels (Stockout %) */}
          {[0, 1.75, 3.5, 5.25, 7.0].map((val) => {
            const y = getYStockout(val);
            return (
              <text
                key={val}
                x={width - padding.right + 10}
                y={y + 4}
                textAnchor="start"
                className="text-[10px] font-mono fill-[#111111]/70"
              >
                {val.toFixed(1)}%
              </text>
            );
          })}

          {/* Waste Area Fill */}
          <path d={wasteAreaPath} fill="url(#wasteGradient)" />

          {/* Waste Line (Purple) */}
          <path
            d={wastePath}
            fill="none"
            stroke="#6D28D9"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Stockout Line (Black) */}
          <path
            d={stockoutPath}
            fill="none"
            stroke="#111111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="5 3"
          />

          {/* X Axis Weeks and hover columns */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cyWaste = getYWaste(d.waste_gbp);
            const cyStockout = getYStockout(d.stockout_pct);
            const isHovered = hoveredIndex === i;

            return (
              <g key={d.week}>
                {/* Vertical hover indicator */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={padding.top}
                    x2={cx}
                    y2={padding.top + chartHeight}
                    stroke="#4C1D95"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* X label */}
                <text
                  x={cx}
                  y={padding.top + chartHeight + 20}
                  textAnchor="middle"
                  className={`text-[11px] font-medium transition-colors ${
                    isHovered ? 'fill-[#4C1D95] font-bold' : 'fill-[#111111]/70'
                  }`}
                >
                  W{d.week}
                </text>

                {/* Waste dot */}
                <circle
                  cx={cx}
                  cy={cyWaste}
                  r={isHovered ? 5.5 : 3.5}
                  fill="#6D28D9"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all"
                />

                {/* Stockout dot */}
                <circle
                  cx={cx}
                  cy={cyStockout}
                  r={isHovered ? 4.5 : 3}
                  fill="#111111"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="transition-all"
                />

                {/* Interactive transparent overlay rect for hover */}
                <rect
                  x={cx - chartWidth / (data.length * 2)}
                  y={padding.top}
                  width={chartWidth / data.length}
                  height={chartHeight + 30}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Summary Strip below chart */}
        <div className="mt-2 pt-2 border-t border-[#F3EEFF] flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#4C1D95] font-mono">
              Week {activeData.week}:
            </span>
            <span className="text-[#111111]">
              Waste: <strong className="text-[#6D28D9]">{formatGBP(activeData.waste_gbp)}</strong> ({formatPct(activeData.fresh_waste_pct)} fresh)
            </span>
            <span className="text-[#111111]/40">•</span>
            <span className="text-[#111111]">
              Stockouts: <strong>{formatPct(activeData.stockout_pct)}</strong>
            </span>
            <span className="text-[#111111]/40">•</span>
            <span className="text-[#111111]/80">
              Lost Sales: {formatGBP(activeData.lost_sales_gbp)}
            </span>
          </div>
          <div className="text-[11px] text-[#111111]/60 italic">
            *Hover over points to inspect specific weeks
          </div>
        </div>
      </div>
    </div>
  );
};
