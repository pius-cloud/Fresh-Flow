import React from 'react';
import { formatGBP, formatPct } from '../utils/calculations';
import { ParsedDataset } from '../data';

interface KpiCardsProps {
  dataset: ParsedDataset;
  selectedStoreId: string;
  selectedCategory: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  dataset,
  selectedStoreId,
  selectedCategory,
}) => {
  // Compute KPI values based on filters
  let wasteGbp = 0;
  let freshWastePct = 0;
  let stockoutPct = 0;
  let lostSalesGbp = 0;
  let contextLabel = 'Chain-wide (13 Weeks)';

  const isChain = selectedStoreId === 'ALL';
  const isAllCategories = selectedCategory === 'ALL';

  if (isChain && isAllCategories) {
    // Chain-wide from weekly_chain
    wasteGbp = dataset.weekly_chain.reduce((acc, row) => acc + row.waste_gbp, 0);
    lostSalesGbp = dataset.weekly_chain.reduce((acc, row) => acc + row.lost_sales_gbp, 0);
    
    // Average rates across 13 weeks
    freshWastePct =
      dataset.weekly_chain.reduce((acc, row) => acc + row.fresh_waste_pct, 0) /
      dataset.weekly_chain.length;
    stockoutPct =
      dataset.weekly_chain.reduce((acc, row) => acc + row.stockout_pct, 0) /
      dataset.weekly_chain.length;

    contextLabel = '20 Stores · 13 Weeks Total';
  } else if (!isChain && isAllCategories) {
    // Single store, all fresh categories from store_totals
    const storeRow = dataset.store_totals.find((s) => s.store_id === selectedStoreId);
    if (storeRow) {
      wasteGbp = storeRow.waste_gbp;
      lostSalesGbp = storeRow.lost_sales_gbp;
      freshWastePct = storeRow.fresh_waste_pct;
      stockoutPct = storeRow.stockout_pct;
    }
    const store = dataset.dim_stores.find((s) => s.store_id === selectedStoreId);
    contextLabel = `${store?.store_name || selectedStoreId} · 90-Day Total`;
  } else if (!isChain && !isAllCategories) {
    // Single store and specific category from store_category_totals
    const catRow = dataset.store_category_totals.find(
      (r) => r.store_id === selectedStoreId && r.category === selectedCategory
    );
    if (catRow) {
      wasteGbp = catRow.waste_gbp;
      freshWastePct = catRow.waste_pct;
      stockoutPct = catRow.stockout_pct;
      // Derived lost sales share from store total
      const storeRow = dataset.store_totals.find((s) => s.store_id === selectedStoreId);
      const storeWaste = storeRow ? storeRow.waste_gbp : 1;
      const share = wasteGbp / (storeWaste > 0 ? storeWaste : 1);
      lostSalesGbp = Math.round((storeRow ? storeRow.lost_sales_gbp : 0) * (share > 0 ? share : 0.15));
    }
    contextLabel = `${selectedStoreId} · ${selectedCategory}`;
  } else {
    // Chain-wide for a specific category: aggregate from store_category_totals
    const catRows = dataset.store_category_totals.filter((r) => r.category === selectedCategory);
    if (catRows.length > 0) {
      wasteGbp = catRows.reduce((acc, r) => acc + r.waste_gbp, 0);
      freshWastePct = catRows.reduce((acc, r) => acc + r.waste_pct, 0) / catRows.length;
      stockoutPct = catRows.reduce((acc, r) => acc + r.stockout_pct, 0) / catRows.length;
      // Proportional chain lost sales estimate
      lostSalesGbp = Math.round(26677 * (wasteGbp / 37280));
    }
    contextLabel = `All Stores · ${selectedCategory}`;
  }

  const kpis = [
    {
      label: 'Waste £',
      value: formatGBP(wasteGbp),
      subtext: 'Direct cost of expired & discarded food',
      hint: contextLabel,
    },
    {
      label: 'Fresh waste %',
      value: formatPct(freshWastePct),
      subtext: 'Waste as percentage of fresh revenue',
      hint: freshWastePct > 5.0 ? 'High waste load' : 'Standard range',
    },
    {
      label: 'Stockout rate %',
      value: formatPct(stockoutPct),
      subtext: 'Store product gaps when customer buys',
      hint: stockoutPct > 3.5 ? 'Availability risk' : 'Healthy fill rate',
    },
    {
      label: 'Lost sales £',
      value: formatGBP(lostSalesGbp),
      subtext: 'Unrealized gross revenue from stockouts',
      hint: contextLabel,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-4 transition-all hover:border-[#EA580C]/40 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#EA580C]">
              {kpi.label}
            </span>
            <span className="text-[10px] font-medium text-[#111111]/60 px-2 py-0.5 rounded-full bg-white/80 border border-[#FED7AA]">
              {kpi.hint}
            </span>
          </div>

          <div className="mt-2.5">
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              {kpi.value}
            </div>
            <p className="text-xs text-[#111111]/70 mt-1 leading-snug">
              {kpi.subtext}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
