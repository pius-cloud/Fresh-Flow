import React from 'react';
import { CalculatedRiskItem } from '../utils/calculations';
import { ChevronRight } from 'lucide-react';

interface RiskListProps {
  items: CalculatedRiskItem[];
  selectedItem: CalculatedRiskItem | null;
  onSelectItem: (item: CalculatedRiskItem) => void;
  selectedStoreId: string;
  selectedCategory: string;
}

export const RiskList: React.FC<RiskListProps> = ({
  items,
  selectedItem,
  onSelectItem,
  selectedStoreId,
  selectedCategory,
}) => {
  // Filter by selectedStore and selectedCategory if chosen
  let filtered = [...items];
  if (selectedStoreId !== 'ALL') {
    filtered = filtered.filter((i) => i.store_id === selectedStoreId);
  }
  if (selectedCategory !== 'ALL') {
    filtered = filtered.filter((i) => i.category === selectedCategory);
  }

  // Rank / Sort logic: High risk first, then highest expiry units or lowest days of cover
  filtered.sort((a, b) => {
    const levelWeight = { High: 3, Medium: 2, Low: 1 };
    const diff = levelWeight[b.risk_level] - levelWeight[a.risk_level];
    if (diff !== 0) return diff;

    // Next compare absolute expiry risk or stockout severity
    if (b.expiry_units_at_risk !== a.expiry_units_at_risk) {
      return b.expiry_units_at_risk - a.expiry_units_at_risk;
    }
    return a.days_of_cover - b.days_of_cover;
  });

  // Top 10 items as specified in brief
  const top10 = filtered.slice(0, 10);

  return (
    <div className="bg-white border border-[#FED7AA] rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#FFF7ED] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#9A3412] font-heading">
              Risk Priority List (Top 10)
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#9A3412] font-semibold border border-[#FED7AA]">
              As of 28/09/2026
            </span>
          </div>
          <p className="text-xs text-[#111111]/70 mt-0.5">
            Store x fresh product pairs with imminent expiry surplus or stockout vulnerabilities.
          </p>
        </div>

        <div className="text-xs text-[#111111]/60 italic">
          Click any row to open 7-day stock diagnostics
        </div>
      </div>

      {top10.length === 0 ? (
        <div className="text-center py-12 text-sm text-[#111111]/60">
          No high-risk items matching the active filter criteria.
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#FED7AA]/60 text-[#111111]/70 uppercase tracking-wider text-[11px] bg-[#FFF7ED]/50">
                <th className="py-2.5 px-3 font-semibold">Risk Level</th>
                <th className="py-2.5 px-3 font-semibold">Type</th>
                <th className="py-2.5 px-3 font-semibold">Product</th>
                <th className="py-2.5 px-3 font-semibold">Store</th>
                <th className="py-2.5 px-3 font-semibold text-right">Days Cover</th>
                <th className="py-2.5 px-3 font-semibold text-right">Expiry Window</th>
                <th className="py-2.5 px-3 font-semibold text-right">Units / Sales</th>
                <th className="py-2.5 px-2 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFF7ED]">
              {top10.map((item) => {
                const isSelected =
                  selectedItem &&
                  selectedItem.store_id === item.store_id &&
                  selectedItem.sku_id === item.sku_id;

                // Risk badge styling rules:
                // High = solid orange (#EA580C) with white text
                // Medium = light orange (#FFEDD5) with deep orange text (#9A3412)
                // Low = white with black outline
                let badgeClass = 'bg-[#EA580C] text-white';
                if (item.risk_level === 'Medium') {
                  badgeClass = 'bg-[#FFEDD5] text-[#9A3412]';
                } else if (item.risk_level === 'Low') {
                  badgeClass = 'bg-white border border-[#111111] text-[#111111]';
                }

                return (
                  <tr
                    key={`${item.store_id}-${item.sku_id}`}
                    onClick={() => onSelectItem(item)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected
                        ? 'bg-[#FFF7ED] border-l-4 border-l-[#EA580C]'
                        : 'hover:bg-[#FFF7ED]/60'
                    }`}
                  >
                    {/* Risk Badge */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[11px] rounded-md uppercase tracking-wide font-semibold ${badgeClass}`}
                      >
                        {item.risk_level}
                      </span>
                    </td>

                    {/* Risk Type */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-[#111111]">
                        {item.risk_type}
                      </span>
                      {item.is_high_expiry && item.expiry_units_at_risk > 0 && (
                        <span className="block text-[10px] text-[#EA580C] font-medium">
                          {item.expiry_units_at_risk} units risk
                        </span>
                      )}
                      {item.is_high_stockout && (
                        <span className="block text-[10px] text-[#111111]/70">
                          Order &lt; sales
                        </span>
                      )}
                    </td>

                    {/* Product */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#111111] group-hover:text-[#9A3412]">
                        {item.product_name}
                      </div>
                      <div className="text-[10px] text-[#111111]/60 font-mono">
                        {item.sku_id} · {item.category}
                      </div>
                    </td>

                    {/* Store */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#111111]">
                        {item.store_id}: {item.store_name.replace('FreshBasket ', '')}
                      </div>
                      <div className="text-[10px] text-[#111111]/60">
                        {item.store_format}
                      </div>
                    </td>

                    {/* Days of Cover */}
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono font-semibold text-[#111111]">
                        {item.days_of_cover.toFixed(1)}d
                      </span>
                    </td>

                    {/* Days to Expiry */}
                    <td className="py-3 px-3 text-right">
                      {item.min_days_to_expiry !== null ? (
                        <span
                          className={`font-mono font-semibold ${
                            item.min_days_to_expiry <= 1
                              ? 'text-[#EA580C]'
                              : 'text-[#111111]'
                          }`}
                        >
                          {item.min_days_to_expiry}d
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#111111]/50 font-mono">
                          0d (Stockout)
                        </span>
                      )}
                    </td>

                    {/* Units vs Daily Sales */}
                    <td className="py-3 px-3 text-right">
                      <div className="font-mono text-[#111111]">
                        {item.closing_units} units
                      </div>
                      <div className="text-[10px] text-[#111111]/60 font-mono">
                        avg {item.avg_daily_sales_7d}/d
                      </div>
                    </td>

                    {/* Action Icon */}
                    <td className="py-3 px-2 text-center text-[#111111]/40 group-hover:text-[#EA580C]">
                      <ChevronRight className="w-4 h-4 mx-auto" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
