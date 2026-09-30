import React from 'react';
import { X, Calendar, AlertTriangle } from 'lucide-react';
import {
  ParsedDataset,
  InventoryDaily,
  StoreCategoryTotal,
} from '../data';
import { formatGBP, formatPct, formatDateDDMMYYYY } from '../utils/calculations';

interface SidePanelProps {
  storeId: string;
  skuId: string;
  dataset: ParsedDataset;
  onClose: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  storeId,
  skuId,
  dataset,
  onClose,
}) => {
  // 1. Resolve store, product, and supplier
  const store = dataset.dim_stores.find((s) => s.store_id === storeId);
  const product = dataset.dim_products.find((p) => p.sku_id === skuId);
  const supplier = product
    ? dataset.dim_suppliers.find((s) => s.supplier_id === product.supplier_id)
    : undefined;

  // 2. Fetch inventory_daily for this store and product
  const dailyRecords: InventoryDaily[] = dataset.inventory_daily
    .filter((r) => r.store_id === storeId && r.sku_id === skuId)
    .sort((a, b) => a.date.localeCompare(b.date));

  // 3. Fetch store waste by category from store_category_totals
  const storeCategoryWaste: StoreCategoryTotal[] = dataset.store_category_totals
    .filter((c) => c.store_id === storeId)
    .sort((a, b) => b.waste_gbp - a.waste_gbp);

  // 4. Fetch supplier stockout trend (weeks 1-13)
  const supplierKey = product?.supplier_id as keyof (typeof dataset.weekly_supplier_stockout_pct)[0] | undefined;
  const supplierTrend = dataset.weekly_supplier_stockout_pct.map((w) => ({
    week: w.week,
    stockout_pct: supplierKey && supplierKey in w ? (w[supplierKey] as number) : 0,
  }));

  // Calculations for daily stock chart
  const maxStock = dailyRecords.reduce(
    (max, r) => Math.max(max, r.opening, r.delivered, r.sold, r.closing, 10),
    0
  );

  return (
    <aside className="fixed inset-y-0 right-0 z-40 w-full sm:w-[480px] bg-white border-l border-[#DDD6FE] shadow-2xl flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-[#DDD6FE] bg-[#F3EEFF]/50 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#6D28D9] font-semibold uppercase tracking-wider">
            <span>Store Diagnostics</span>
            <span>•</span>
            <span>{storeId}</span>
          </div>
          <h2 className="text-xl font-bold text-[#4C1D95] font-heading mt-0.5">
            {product?.product_name || skuId}
          </h2>
          <p className="text-xs text-[#111111]/70">
            {store?.store_name} ({store?.format}) · {product?.category}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg border border-[#111111]/20 hover:bg-[#F3EEFF] text-[#111111] transition-colors"
          title="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5 space-y-6">
        {/* SECTION 1: 7-DAY STOCK CHART */}
        <section className="bg-white border border-[#DDD6FE] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3EEFF]">
            <h3 className="text-sm font-bold text-[#4C1D95] font-heading">
              7-Day Stock Chart (22–28 Sep 2026)
            </h3>
            <span className="text-[10px] text-[#111111]/60 font-mono">
              inventory_daily
            </span>
          </div>

          {dailyRecords.length > 0 ? (
            <div className="mt-3">
              {/* Daily metric bar visualizer */}
              <div className="space-y-2.5">
                {dailyRecords.map((day) => (
                  <div key={day.date} className="p-2 rounded-lg bg-[#F3EEFF]/40 border border-[#DDD6FE]/40 text-xs">
                    <div className="flex items-center justify-between font-mono font-medium text-[#111111]">
                      <span className="text-[11px] text-[#4C1D95] font-bold">
                        {formatDateDDMMYYYY(day.date)}
                      </span>
                      <div className="flex items-center gap-2 text-[11px]">
                        <span>Del: <strong className="text-[#6D28D9]">+{day.delivered}</strong></span>
                        <span>Sold: <strong>-{day.sold}</strong></span>
                        {day.waste > 0 && (
                          <span className="text-[#4C1D95] font-bold">
                            Waste: {day.waste}
                          </span>
                        )}
                        <span>End: <strong className="text-[#111111]">{day.closing}</strong></span>
                      </div>
                    </div>

                    {/* Proportional visual bar */}
                    <div className="mt-1.5 flex h-2 rounded-full overflow-hidden bg-white border border-[#DDD6FE]">
                      <div
                        style={{ width: `${Math.min(100, (day.sold / maxStock) * 100)}%` }}
                        className="bg-[#111111]"
                        title={`Sold: ${day.sold}`}
                      />
                      <div
                        style={{ width: `${Math.min(100, (day.delivered / maxStock) * 100)}%` }}
                        className="bg-[#6D28D9]"
                        title={`Delivered: ${day.delivered}`}
                      />
                      {day.waste > 0 && (
                        <div
                          style={{ width: `${Math.min(100, (day.waste / maxStock) * 100)}%` }}
                          className="bg-[#4C1D95]"
                          title={`Waste: ${day.waste}`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend for 7-day chart */}
              <div className="mt-3 pt-2 border-t border-[#F3EEFF] flex items-center justify-between text-[11px] text-[#111111]/70">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#6D28D9]"></span>
                    <span>Delivered</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#111111]"></span>
                    <span>Sold</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-[#4C1D95]"></span>
                    <span>Waste</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-[#111111]/60">
              Pair tracked in current positions with active closing units. Daily logs available for top risk priority pairs.
            </div>
          )}
        </section>

        {/* SECTION 2: STORE WASTE BY CATEGORY */}
        <section className="bg-white border border-[#DDD6FE] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3EEFF]">
            <h3 className="text-sm font-bold text-[#4C1D95] font-heading">
              Store Waste by Category
            </h3>
            <span className="text-[10px] text-[#111111]/60 font-mono">
              90-day total
            </span>
          </div>

          <div className="mt-3 space-y-2.5">
            {storeCategoryWaste.map((cat) => {
              const maxWasteCategory = 2500;
              const barWidth = Math.min(100, (cat.waste_gbp / maxWasteCategory) * 100);

              return (
                <div key={cat.category} className="text-xs">
                  <div className="flex items-center justify-between text-[#111111] mb-1">
                    <span className="font-medium">{cat.category}</span>
                    <span className="font-mono font-semibold">
                      {formatGBP(cat.waste_gbp)}{' '}
                      <span className="text-[#6D28D9] font-normal text-[11px]">
                        ({formatPct(cat.waste_pct)})
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-[#F3EEFF] h-2 rounded-full overflow-hidden border border-[#DDD6FE]">
                    <div
                      className="bg-[#6D28D9] h-full rounded-full transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 3: SUPPLIER STOCKOUT TREND */}
        <section className="bg-white border border-[#DDD6FE] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-[#F3EEFF]">
            <div>
              <h3 className="text-sm font-bold text-[#4C1D95] font-heading">
                Supplier Stockout Trend
              </h3>
              <p className="text-[11px] text-[#111111]/70">
                {supplier?.supplier_id}: {supplier?.supplier_name} (Lead time: {supplier?.lead_time_days}d)
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#4C1D95]">
              {supplier?.on_time_delivery_pct}% OTD
            </span>
          </div>

          <div className="mt-4">
            {/* SVG Sparkline for Weeks 1-13 */}
            <div className="h-28 w-full">
              <svg viewBox="0 0 380 90" className="w-full h-full overflow-visible">
                {/* Horizontal reference lines */}
                {[0, 10, 20].map((level) => {
                  const y = 80 - (level / 22) * 70;
                  return (
                    <g key={level}>
                      <line
                        x1="25"
                        y1={y}
                        x2="375"
                        y2={y}
                        stroke="#F3EEFF"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      <text
                        x="20"
                        y={y + 3}
                        textAnchor="end"
                        className="text-[9px] font-mono fill-[#111111]/50"
                      >
                        {level}%
                      </text>
                    </g>
                  );
                })}

                {/* Plot line */}
                {(() => {
                  const points = supplierTrend.map((d, i) => {
                    const x = 30 + (i / 12) * 340;
                    const y = 80 - (Math.min(22, d.stockout_pct) / 22) * 70;
                    return `${x},${y}`;
                  });
                  return (
                    <>
                      <path
                        d={`M ${points.join(' L ')}`}
                        fill="none"
                        stroke="#6D28D9"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {supplierTrend.map((d, i) => {
                        const x = 30 + (i / 12) * 340;
                        const y = 80 - (Math.min(22, d.stockout_pct) / 22) * 70;
                        return (
                          <circle
                            key={d.week}
                            cx={x}
                            cy={y}
                            r={d.stockout_pct > 10 ? 3.5 : 2.5}
                            fill={d.stockout_pct > 10 ? '#4C1D95' : '#111111'}
                            stroke="#ffffff"
                            strokeWidth="1"
                          />
                        );
                      })}
                    </>
                  );
                })()}

                {/* X-axis week indicators */}
                <text x="30" y="90" textAnchor="middle" className="text-[9px] fill-[#111111]/60 font-mono">
                  W1
                </text>
                <text x="200" y="90" textAnchor="middle" className="text-[9px] fill-[#111111]/60 font-mono">
                  W7
                </text>
                <text x="370" y="90" textAnchor="middle" className="text-[9px] fill-[#111111]/60 font-mono">
                  W13
                </text>
              </svg>
            </div>

            <div className="mt-2 text-[11px] text-[#111111]/70 flex items-center justify-between">
              <span>Avg stockout rate: <strong>{(supplierTrend.reduce((a, b) => a + b.stockout_pct, 0) / 13).toFixed(1)}%</strong></span>
              <span>Latest week (W13): <strong className="text-[#6D28D9]">{supplierTrend[12]?.stockout_pct}%</strong></span>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};
