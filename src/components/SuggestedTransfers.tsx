import React from 'react';
import { SuggestedTransfer, formatGBP } from '../utils/calculations';
import { ArrowRight, Truck, Sparkles, ChevronRight } from 'lucide-react';

interface SuggestedTransfersProps {
  transfers: SuggestedTransfer[];
  selectedTransferId: string | null;
  onSelectTransfer: (transfer: SuggestedTransfer) => void;
  isLiveDemoActive: boolean;
}

export const SuggestedTransfers: React.FC<SuggestedTransfersProps> = ({
  transfers,
  selectedTransferId,
  onSelectTransfer,
  isLiveDemoActive,
}) => {
  return (
    <div className="bg-white border border-[#DDD6FE] rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-[#F3EEFF] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[#4C1D95] font-heading">
              Top 5 Suggested Transfers
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3EEFF] text-[#4C1D95] font-semibold border border-[#DDD6FE]">
              Store-to-Store Rebalancing
            </span>
          </div>
          <p className="text-xs text-[#111111]/70 mt-0.5">
            Relocate expiring surplus to the closest stockout store to prevent waste and save lost revenue.
          </p>
        </div>

        <div className="text-xs text-[#111111]/60 italic">
          Click any transfer to inspect stock trajectory
        </div>
      </div>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#DDD6FE]/60 text-[#111111]/70 uppercase tracking-wider text-[11px] bg-[#F3EEFF]/40">
              <th className="py-2.5 px-3 font-semibold">Product</th>
              <th className="py-2.5 px-3 font-semibold">From Store (Surplus)</th>
              <th className="py-2.5 px-3 font-semibold">To Store (Shortage)</th>
              <th className="py-2.5 px-3 font-semibold text-right">Transfer Units</th>
              <th className="py-2.5 px-3 font-semibold text-right">Distance (km)</th>
              <th className="py-2.5 px-3 font-semibold text-right">Est. £ Saved</th>
              <th className="py-2.5 px-2 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F3EEFF]">
            {transfers.map((t) => {
              const isSelected = selectedTransferId === t.id;
              const isDemoTarget =
                t.sku_id === 'SKU003' &&
                t.from_store_id === 'S18' &&
                t.to_store_id === 'S07';

              return (
                <tr
                  key={t.id}
                  onClick={() => onSelectTransfer(t)}
                  className={`cursor-pointer transition-all group ${
                    isDemoTarget && isLiveDemoActive
                      ? 'bg-[#F3EEFF] ring-2 ring-[#6D28D9] border-l-4 border-l-[#4C1D95]'
                      : isSelected
                      ? 'bg-[#F3EEFF] border-l-4 border-l-[#6D28D9]'
                      : 'hover:bg-[#F3EEFF]/60'
                  }`}
                >
                  {/* Product */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {isDemoTarget && (
                        <span className="p-0.5 rounded-sm bg-[#6D28D9] text-white">
                          <Sparkles className="w-3 h-3" />
                        </span>
                      )}
                      <div>
                        <div className="font-semibold text-[#111111] group-hover:text-[#4C1D95]">
                          {t.product_name}
                        </div>
                        <div className="text-[10px] text-[#111111]/60 font-mono">
                          {t.sku_id} · {formatGBP(t.unit_price_gbp)}/unit
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* From Store */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-[#111111]">
                      {t.from_store_id}: {t.from_store_name.replace('FreshBasket ', '')}
                    </div>
                    <div className="text-[10px] text-[#6D28D9] font-medium">
                      Surplus at risk
                    </div>
                  </td>

                  {/* To Store */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-[#111111]">
                      {t.to_store_id}: {t.to_store_name.replace('FreshBasket ', '')}
                    </div>
                    <div className="text-[10px] text-[#111111]/70">
                      Empty shelf / high demand
                    </div>
                  </td>

                  {/* Units */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono font-bold text-sm text-[#4C1D95]">
                      {t.units}
                    </span>
                    <span className="text-[10px] text-[#111111]/60 block">units</span>
                  </td>

                  {/* Distance */}
                  <td className="py-3 px-3 text-right font-mono text-[#111111]">
                    <div className="flex items-center justify-end gap-1">
                      <Truck className="w-3 h-3 text-[#6D28D9]" />
                      <span>{t.distance_km} km</span>
                    </div>
                  </td>

                  {/* Est £ Saved */}
                  <td className="py-3 px-3 text-right font-mono font-bold text-[#6D28D9]">
                    {formatGBP(t.est_gbp_saved)}
                  </td>

                  {/* Action Icon */}
                  <td className="py-3 px-2 text-center text-[#111111]/40 group-hover:text-[#6D28D9]">
                    <ChevronRight className="w-4 h-4 mx-auto" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
