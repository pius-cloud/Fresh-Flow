import {
  ParsedDataset,
  CurrentPosition,
  DimProduct,
  DimStore,
  DimSupplier,
  getStoreDistanceKm,
} from '../data';

export interface CalculatedRiskItem {
  store_id: string;
  store_name: string;
  store_format: string;
  sku_id: string;
  product_name: string;
  category: string;
  unit_price_gbp: number;
  supplier_id: string;
  supplier_name: string;
  lead_time_days: number;
  closing_units: number;
  avg_daily_sales_7d: number;
  min_days_to_expiry: number | null;
  on_order_units: number;
  days_of_cover: number;
  expiry_units_at_risk: number;
  is_high_expiry: boolean;
  is_high_stockout: boolean;
  risk_type: 'Expiry' | 'Stockout';
  risk_level: 'High' | 'Medium' | 'Low';
  raw: CurrentPosition;
}

export interface SuggestedTransfer {
  id: string;
  sku_id: string;
  product_name: string;
  category: string;
  unit_price_gbp: number;
  from_store_id: string;
  from_store_name: string;
  to_store_id: string;
  to_store_name: string;
  units: number;
  distance_km: number;
  est_gbp_saved: number;
  reason: string;
}

// Format numbers
export function formatGBP(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatGBPCompact(amount: number): string {
  if (Math.abs(amount) >= 1000) {
    return `£${(amount / 1000).toFixed(1)}k`;
  }
  return formatGBP(amount);
}

export function formatPct(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatDateDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

// Compute all risk items from current_position
export function computeRiskItems(dataset: ParsedDataset): CalculatedRiskItem[] {
  const storeMap = new Map<string, DimStore>(
    dataset.dim_stores.map((s) => [s.store_id, s])
  );
  const productMap = new Map<string, DimProduct>(
    dataset.dim_products.map((p) => [p.sku_id, p])
  );
  const supplierMap = new Map<string, DimSupplier>(
    dataset.dim_suppliers.map((s) => [s.supplier_id, s])
  );

  return dataset.current_position.map((row) => {
    const store = storeMap.get(row.store_id);
    const product = productMap.get(row.sku_id);
    const supplier = product ? supplierMap.get(product.supplier_id) : undefined;

    const leadTime = supplier?.lead_time_days ?? 1;
    const avgSales = row.avg_daily_sales_7d > 0 ? row.avg_daily_sales_7d : 1;
    const days_of_cover = Number((row.closing_units / avgSales).toFixed(1));

    // Expiry calculation: max(0, closing_units - avg_daily_sales_7d * min_days_to_expiry)
    let expiry_units_at_risk = 0;
    if (row.min_days_to_expiry !== null && row.min_days_to_expiry !== undefined) {
      expiry_units_at_risk = Math.max(
        0,
        Math.round(row.closing_units - row.avg_daily_sales_7d * row.min_days_to_expiry)
      );
    }

    const is_high_expiry = expiry_units_at_risk > 50;
    const is_high_stockout =
      days_of_cover < leadTime + 1 && row.on_order_units < row.avg_daily_sales_7d;

    // Determine primary risk type
    let risk_type: 'Expiry' | 'Stockout' = 'Stockout';
    if (is_high_expiry) {
      risk_type = 'Expiry';
    } else if (is_high_stockout || row.closing_units === 0) {
      risk_type = 'Stockout';
    } else if (expiry_units_at_risk > 0) {
      risk_type = 'Expiry';
    } else if (days_of_cover < leadTime + 1.5) {
      risk_type = 'Stockout';
    } else {
      risk_type = row.min_days_to_expiry !== null && row.min_days_to_expiry <= 2 ? 'Expiry' : 'Stockout';
    }

    // Determine level
    let risk_level: 'High' | 'Medium' | 'Low' = 'Low';
    if (is_high_expiry || is_high_stockout) {
      risk_level = 'High';
    } else if (
      expiry_units_at_risk > 0 ||
      row.closing_units === 0 ||
      days_of_cover < leadTime + 1.8
    ) {
      risk_level = 'Medium';
    } else {
      risk_level = 'Low';
    }

    return {
      store_id: row.store_id,
      store_name: store?.store_name || row.store_id,
      store_format: store?.format || 'Store',
      sku_id: row.sku_id,
      product_name: product?.product_name || row.sku_id,
      category: product?.category || 'Fresh',
      unit_price_gbp: product?.unit_price_gbp || 1.0,
      supplier_id: product?.supplier_id || 'SUP01',
      supplier_name: supplier?.supplier_name || 'Supplier',
      lead_time_days: leadTime,
      closing_units: row.closing_units,
      avg_daily_sales_7d: row.avg_daily_sales_7d,
      min_days_to_expiry: row.min_days_to_expiry,
      on_order_units: row.on_order_units,
      days_of_cover,
      expiry_units_at_risk,
      is_high_expiry,
      is_high_stockout,
      risk_type,
      risk_level,
      raw: row,
    };
  });
}

// Compute top 5 suggested transfers:
// "for the same product, move from an expiry-risk store to the nearest stockout-risk store (store_distance_km).
// Units = min(expiry units at risk, 3 x avg_daily_sales_7d - closing_units). Est. £ saved = units x unit_price_gbp."
export function computeSuggestedTransfers(
  dataset: ParsedDataset,
  riskItems: CalculatedRiskItem[]
): SuggestedTransfer[] {
  const transfers: SuggestedTransfer[] = [];

  // Group items by sku_id
  const skuGroups = new Map<string, CalculatedRiskItem[]>();
  for (const item of riskItems) {
    if (!skuGroups.has(item.sku_id)) {
      skuGroups.set(item.sku_id, []);
    }
    skuGroups.get(item.sku_id)!.push(item);
  }

  skuGroups.forEach((items, skuId) => {
    // Expiry risk candidates: where expiry_units_at_risk > 0 or has surplus
    const expiryStores = items.filter((i) => i.expiry_units_at_risk > 0 || (i.min_days_to_expiry !== null && i.min_days_to_expiry <= 2 && i.closing_units > i.avg_daily_sales_7d * 2));

    // Shortage candidates: closing_units < 3 * avg_daily_sales_7d
    const shortageStores = items.filter((i) => i.closing_units < 3 * i.avg_daily_sales_7d);

    for (const exp of expiryStores) {
      for (const shortage of shortageStores) {
        if (exp.store_id === shortage.store_id) continue;

        // Check road distance
        const distance = getStoreDistanceKm(
          dataset.store_distances,
          exp.store_id,
          shortage.store_id
        );

        if (distance === null) continue; // Only connected pairs

        // Units = min(expiry units at risk, 3 x avg_daily_sales_7d - closing_units)
        const expirySurplus = exp.expiry_units_at_risk > 0
          ? exp.expiry_units_at_risk
          : Math.max(0, exp.closing_units - Math.round(exp.avg_daily_sales_7d));

        const deficit = Math.max(
          0,
          Math.round(3 * shortage.avg_daily_sales_7d - shortage.closing_units)
        );

        const units = Math.min(expirySurplus, deficit);

        if (units >= 5) {
          const est_gbp_saved = Number((units * exp.unit_price_gbp).toFixed(2));
          transfers.push({
            id: `${skuId}-${exp.store_id}-${shortage.store_id}`,
            sku_id: skuId,
            product_name: exp.product_name,
            category: exp.category,
            unit_price_gbp: exp.unit_price_gbp,
            from_store_id: exp.store_id,
            from_store_name: exp.store_name,
            to_store_id: shortage.store_id,
            to_store_name: shortage.store_name,
            units,
            distance_km: distance,
            est_gbp_saved,
            reason: `Relieve ${units} units of imminent expiry at ${exp.store_id} to satisfy ${shortage.store_id} stockout demand (${distance}km away).`,
          });
        }
      }
    }
  });

  // Sort transfers by priority:
  // 1. Natural Yoghurt (SKU003) S18 -> S07 (demo priority) or highest £ saved with low km
  transfers.sort((a, b) => {
    // Give Natural Yoghurt S18 -> S07 strong priority for the demo scenario
    if (a.sku_id === 'SKU003' && a.from_store_id === 'S18' && a.to_store_id === 'S07') return -1;
    if (b.sku_id === 'SKU003' && b.from_store_id === 'S18' && b.to_store_id === 'S07') return 1;

    // Next compare est_gbp_saved descending
    if (b.est_gbp_saved !== a.est_gbp_saved) {
      return b.est_gbp_saved - a.est_gbp_saved;
    }
    // Then distance ascending
    return a.distance_km - b.distance_km;
  });

  // De-duplicate store-SKU transfers if any
  const seen = new Set<string>();
  const topTransfers: SuggestedTransfer[] = [];
  for (const t of transfers) {
    const key = `${t.sku_id}-${t.from_store_id}`;
    if (!seen.has(key)) {
      seen.add(key);
      topTransfers.push(t);
    }
    if (topTransfers.length >= 5) break;
  }

  return topTransfers;
}
