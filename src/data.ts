// FreshFlow UK Grocery Chain Data Engine
// Exact CSV definitions from FreshBasket specification

export interface DimStore {
  store_id: string;
  store_name: string;
  format: string;
}

export interface DimProduct {
  sku_id: string;
  product_name: string;
  category: string;
  shelf_life_days: number;
  unit_price_gbp: number;
  supplier_id: string;
}

export interface DimSupplier {
  supplier_id: string;
  supplier_name: string;
  lead_time_days: number;
  on_time_delivery_pct: number;
}

export interface StoreDistanceKm {
  store_a: string;
  store_b: string;
  road_distance_km: number;
}

export interface WeeklyChain {
  week: number;
  waste_gbp: number;
  lost_sales_gbp: number;
  stockout_pct: number;
  fresh_waste_pct: number;
}

export interface StoreTotal {
  store_id: string;
  waste_gbp: number;
  lost_sales_gbp: number;
  stockout_pct: number;
  fresh_waste_pct: number;
}

export interface StoreCategoryTotal {
  store_id: string;
  category: string;
  waste_gbp: number;
  waste_pct: number;
  stockout_pct: number;
}

export interface WeeklySupplierStockoutPct {
  week: number;
  SUP01: number;
  SUP02: number;
  SUP03: number;
  SUP04: number;
  SUP05: number;
  SUP06: number;
  SUP07: number;
  SUP08: number;
}

export interface CurrentPosition {
  store_id: string;
  sku_id: string;
  closing_units: number;
  avg_daily_sales_7d: number;
  min_days_to_expiry: number | null;
  on_order_units: number;
}

export interface InventoryDaily {
  date: string;
  store_id: string;
  sku_id: string;
  opening: number;
  delivered: number;
  sold: number;
  waste: number;
  closing: number;
  stockout_flag: number;
}

export const FRESH_CATEGORIES = [
  'Dairy',
  'Fresh Produce',
  'Bakery',
  'Meat & Fish',
  'Ready Meals',
  'Chilled Drinks',
] as const;

export const RAW_CSV = {
  dim_store: `store_id,store_name,format
S01,FreshBasket Manchester Trafford,Superstore
S02,FreshBasket Birmingham Selly Oak,Superstore
S03,FreshBasket Leeds Crossgates,Superstore
S04,FreshBasket Glasgow Silverburn,Superstore
S05,FreshBasket Bristol Cribbs Causeway,Superstore
S06,FreshBasket Edinburgh Fort Kinnaird,Superstore
S07,FreshBasket London Clapham Junction,Supermarket
S08,FreshBasket London Kensington,Supermarket
S09,FreshBasket London Islington,Convenience
S10,FreshBasket London Stratford,Supermarket
S11,FreshBasket Cardiff Bay,Supermarket
S12,FreshBasket Newcastle Gosforth,Supermarket
S13,FreshBasket Liverpool Aintree,Superstore
S14,FreshBasket Sheffield Meadowhall,Superstore
S15,FreshBasket Nottingham Beeston,Supermarket
S16,FreshBasket Leicester Fosse Park,Supermarket
S17,FreshBasket Reading Oracle,Supermarket
S18,FreshBasket Slough Bath Road,Supermarket
S19,FreshBasket Carlisle,Convenience
S20,FreshBasket Truro,Convenience`,

  dim_product: `sku_id,product_name,category,shelf_life_days,unit_price_gbp,supplier_id
SKU001,Whole Milk 4 pints,Dairy,7,1.65,SUP01
SKU002,Semi-Skimmed Milk 4 pints,Dairy,7,1.65,SUP01
SKU003,Natural Yoghurt 500g,Dairy,14,1.1,SUP01
SKU004,Strawberry Yoghurt 4x125g,Dairy,14,1.25,SUP01
SKU005,Greek Style Yoghurt 500g,Dairy,14,1.6,SUP01
SKU006,Salted Butter 250g,Dairy,45,2.05,SUP01
SKU007,Mature Cheddar 350g,Dairy,45,3.5,SUP01
SKU008,Double Cream 300ml,Dairy,10,1.6,SUP01
SKU009,Free Range Eggs 12pk,Dairy,21,2.75,SUP01
SKU010,Oat Drink Chilled 1L,Dairy,10,1.35,SUP01
SKU011,Salad Tomatoes 6pk,Fresh Produce,5,1.2,SUP02
SKU012,Brown Onions 1kg,Fresh Produce,14,1.1,SUP02
SKU013,Red Peppers 3pk,Fresh Produce,5,1.6,SUP02
SKU014,Baby Spinach 240g,Fresh Produce,3,1.5,SUP02
SKU015,Bananas 6pk,Fresh Produce,5,0.85,SUP02
SKU016,Pineapple Each,Fresh Produce,7,1.6,SUP02
SKU017,Carrots 1kg,Fresh Produce,10,0.8,SUP02
SKU018,Cucumber Each,Fresh Produce,7,0.85,SUP02
SKU019,Easy Peelers 600g,Fresh Produce,10,2.0,SUP02
SKU020,Ripe Avocados 2pk,Fresh Produce,5,1.6,SUP02
SKU021,Broccoli 350g,Fresh Produce,7,0.9,SUP02
SKU022,Strawberries 400g,Fresh Produce,5,2.5,SUP02
SKU023,White Sliced Bread 800g,Bakery,4,1.25,SUP03
SKU024,Wholemeal Bread 800g,Bakery,4,1.3,SUP03
SKU025,Butter Croissants 4pk,Bakery,3,1.8,SUP03
SKU026,Sausage Roll Each,Bakery,2,1.0,SUP03
SKU027,Jam Doughnuts 4pk,Bakery,2,1.5,SUP03
SKU028,Crumpets 6pk,Bakery,5,0.9,SUP03
SKU029,Whole Chicken 1.6kg,Meat & Fish,6,4.5,SUP04
SKU030,Chicken Breast Fillets 650g,Meat & Fish,6,4.5,SUP04
SKU031,Chicken Thighs 1kg,Meat & Fish,6,3.8,SUP04
SKU032,Beef Mince 500g,Meat & Fish,5,3.5,SUP04
SKU033,Salmon Fillets 2pk,Meat & Fish,4,4.25,SUP04
SKU034,Cod Fillets 2pk,Meat & Fish,4,4.5,SUP04
SKU035,Pork Sausages 8pk,Meat & Fish,14,2.2,SUP04
SKU036,Smoked Bacon 8 rashers,Meat & Fish,14,2.0,SUP04
SKU037,Lamb Mince 500g,Meat & Fish,5,4.0,SUP04
SKU038,King Prawns 200g,Meat & Fish,4,3.5,SUP04
SKU039,Chicken Tikka Masala & Rice,Ready Meals,3,3.5,SUP05
SKU040,Beef Lasagne 400g,Ready Meals,4,3.0,SUP05
SKU041,Chicken Caesar Salad,Ready Meals,3,2.75,SUP05
SKU042,BLT Sandwich,Ready Meals,3,2.2,SUP05
SKU043,Sushi Selection Box,Ready Meals,2,3.5,SUP05
SKU044,Fruit Pot,Ready Meals,3,1.5,SUP05
SKU045,Fresh Orange Juice 1L,Chilled Drinks,8,2.4,SUP06
SKU046,Apple Juice 1L,Chilled Drinks,8,1.8,SUP06
SKU047,Fruit Smoothie 750ml,Chilled Drinks,5,2.5,SUP06
SKU048,Probiotic Yoghurt Drink 6pk,Chilled Drinks,14,2.0,SUP06
SKU049,Iced Coffee 1L,Chilled Drinks,10,1.8,SUP06
SKU050,Fresh Lemonade 1L,Chilled Drinks,8,1.6,SUP06
SKU051,Fish Fingers 10pk,Frozen,180,2.5,SUP07
SKU052,Chicken Nuggets 400g,Frozen,120,2.75,SUP07
SKU053,Vanilla Ice Cream 900ml,Frozen,180,3.0,SUP07
SKU054,Garden Peas 1kg,Frozen,180,1.6,SUP07
SKU055,Oven Chips 1.5kg,Frozen,150,2.2,SUP07
SKU056,Long Grain Rice 1kg,Dry Staples,365,1.8,SUP08
SKU057,Penne Pasta 500g,Dry Staples,365,0.95,SUP08
SKU058,Sunflower Oil 1L,Dry Staples,300,2.2,SUP08
SKU059,Granulated Sugar 1kg,Dry Staples,365,1.3,SUP08
SKU060,Tea Bags 80pk,Dry Staples,365,2.0,SUP08`,

  dim_supplier: `supplier_id,supplier_name,lead_time_days,on_time_delivery_pct
SUP01,Cotswold Dairy Co-op,1,96
SUP02,Vale Growers Collective,1,92
SUP03,Hearthstone Bakeries,1,96
SUP04,Prime British Meats,1,90
SUP05,Fresh Kitchen Foods,1,95
SUP06,Orchard & Press Drinks,1,97
SUP07,Arctic Harvest Frozen,2,96
SUP08,Kingsway Ambient Foods,3,98`,

  store_distance_km: `store_a,store_b,road_distance_km
S01,S13,54.2
S01,S14,84.1
S01,S03,94.4
S01,S15,130.3
S02,S16,76.1
S02,S15,98.2
S02,S05,149.9
S02,S14,154.2
S03,S14,58.4
S03,S15,133.5
S03,S13,142.7
S04,S06,105.7
S04,S19,183.9
S04,S12,262.8
S04,S13,372.9
S05,S11,54.3
S05,S17,151.8
S05,S18,186.6
S06,S19,158.0
S06,S12,189.1
S03,S06,351.1
S07,S08,5.5
S07,S09,12.5
S07,S10,19.4
S07,S18,40.3
S08,S09,10.2
S08,S10,18.9
S08,S18,37.6
S09,S10,9.4
S09,S18,46.1
S10,S18,55.5
S02,S11,185.2
S11,S17,205.1
S11,S18,240.4
S12,S19,115.7
S03,S12,180.9
S12,S14,239.2
S13,S14,138.3
S13,S15,176.8
S14,S15,75.6
S14,S16,119.9
S15,S16,44.5
S01,S16,164.8
S17,S18,36.3
S08,S17,73.2
S07,S17,75.1
S09,S17,82.2
S03,S19,209.2
S11,S20,253.8
S05,S20,300.1
S17,S20,425.7
S02,S20,437.9`,

  weekly_chain: `week,waste_gbp,lost_sales_gbp,stockout_pct,fresh_waste_pct
1,814,3051,5.2,0.8
2,2293,1312,2.6,2.4
3,2676,1331,2.7,3.3
4,1927,2109,3.5,1.8
5,2458,1338,2.7,3.0
6,4130,1108,2.2,5.5
7,3509,1928,3.3,3.6
8,3014,2108,3.4,4.1
9,989,6131,6.0,0.8
10,5075,1284,2.3,6.1
11,3669,1782,2.6,3.8
12,3594,1274,2.1,5.4
13,2712,1757,3.4,3.2`,

  store_totals: `store_id,waste_gbp,lost_sales_gbp,stockout_pct,fresh_waste_pct
S01,1927,1334,3.0,2.9
S02,2352,1182,2.8,3.6
S03,1098,1838,3.8,1.6
S04,1153,1308,3.2,1.8
S05,1646,1582,3.4,2.7
S06,2216,934,2.5,3.8
S07,1267,2214,4.4,1.6
S08,2174,1790,3.2,3.2
S09,2764,1230,2.8,4.3
S10,881,1574,3.9,1.3
S11,1075,1531,3.7,2.0
S12,1304,1278,3.4,2.4
S13,1160,1288,3.3,2.1
S14,1981,1204,3.1,3.5
S15,1626,868,3.0,3.2
S16,983,1602,4.0,2.0
S17,1900,1366,3.3,3.6
S18,6282,569,1.3,14.9
S19,1811,861,3.0,4.6
S20,1263,961,3.3,3.8`,

  store_category_totals: `store_id,category,waste_gbp,waste_pct,stockout_pct
S01,Bakery,231,3.7,13.7
S01,Chilled Drinks,129,1.5,0.6
S01,Dairy,0,0.0,0.1
S01,Fresh Produce,623,5.0,0.5
S01,Meat & Fish,505,2.6,2.2
S01,Ready Meals,439,4.8,8.3
S02,Bakery,301,4.9,14.6
S02,Chilled Drinks,155,2.0,0.0
S02,Dairy,26,0.2,0.1
S02,Fresh Produce,669,5.7,0.4
S02,Meat & Fish,731,4.1,1.8
S02,Ready Meals,470,5.4,6.5
S03,Bakery,73,1.4,18.0
S03,Chilled Drinks,104,1.3,0.6
S03,Dairy,0,0.0,0.1
S03,Fresh Produce,252,2.3,1.0
S03,Meat & Fish,421,2.5,3.2
S03,Ready Meals,249,3.2,9.6
S04,Bakery,75,1.5,15.2
S04,Chilled Drinks,118,1.6,0.6
S04,Dairy,0,0.0,0.1
S04,Fresh Produce,327,2.9,1.2
S04,Meat & Fish,341,2.1,2.0
S04,Ready Meals,291,3.4,8.0
S05,Bakery,201,3.8,17.2
S05,Chilled Drinks,127,1.7,1.1
S05,Dairy,42,0.4,0.2
S05,Fresh Produce,478,4.1,0.2
S05,Meat & Fish,498,3.1,1.8
S05,Ready Meals,300,4.0,10.0
S06,Bakery,248,4.5,11.7
S06,Chilled Drinks,217,2.9,0.2
S06,Dairy,0,0.0,0.4
S06,Fresh Produce,668,6.1,0.5
S06,Meat & Fish,609,3.9,1.8
S06,Ready Meals,473,6.1,6.5
S07,Bakery,112,1.7,17.4
S07,Chilled Drinks,129,1.4,0.6
S07,Dairy,0,0.0,2.2
S07,Fresh Produce,311,2.4,1.0
S07,Meat & Fish,410,2.1,2.0
S07,Ready Meals,304,3.2,13.7
S08,Bakery,309,4.9,14.4
S08,Chilled Drinks,155,1.8,0.2
S08,Dairy,18,0.1,0.1
S08,Fresh Produce,605,4.7,0.6
S08,Meat & Fish,610,3.3,2.7
S08,Ready Meals,477,5.3,9.4
S09,Bakery,287,4.8,12.8
S09,Chilled Drinks,192,2.5,0.4
S09,Dairy,27,0.2,0.4
S09,Fresh Produce,790,6.8,0.5
S09,Meat & Fish,938,5.5,1.9
S09,Ready Meals,530,6.7,7.2
S10,Bakery,86,1.4,17.2
S10,Chilled Drinks,87,1.1,0.9
S10,Dairy,0,0.0,0.3
S10,Fresh Produce,215,1.9,0.5
S10,Meat & Fish,301,1.7,2.3
S10,Ready Meals,190,2.4,12.4
S11,Bakery,122,2.8,16.1
S11,Chilled Drinks,116,1.9,0.6
S11,Dairy,0,0.0,0.1
S11,Fresh Produce,222,2.5,1.2
S11,Meat & Fish,380,2.8,2.4
S11,Ready Meals,234,3.8,11.9
S12,Bakery,93,2.1,15.9
S12,Chilled Drinks,118,1.9,0.4
S12,Dairy,8,0.1,0.2
S12,Fresh Produce,317,3.3,0.9
S12,Meat & Fish,486,3.6,2.6
S12,Ready Meals,282,4.6,8.7
S13,Bakery,108,2.5,15.7
S13,Chilled Drinks,55,0.8,0.4
S13,Dairy,4,0.0,0.1
S13,Fresh Produce,305,3.3,0.7
S13,Meat & Fish,480,3.4,2.0
S13,Ready Meals,208,3.1,9.8
S14,Bakery,233,4.7,13.5
S14,Chilled Drinks,142,2.0,0.6
S14,Dairy,29,0.3,0.2
S14,Fresh Produce,522,5.0,0.7
S14,Meat & Fish,664,4.2,2.3
S14,Ready Meals,391,5.5,7.8
S15,Bakery,175,3.8,13.7
S15,Chilled Drinks,107,1.8,0.6
S15,Dairy,8,0.1,0.1
S15,Fresh Produce,434,4.7,1.0
S15,Meat & Fish,583,4.5,2.2
S15,Ready Meals,318,5.2,6.9
S16,Bakery,62,1.7,15.7
S16,Chilled Drinks,96,1.7,1.1
S16,Dairy,0,0.0,0.2
S16,Fresh Produce,228,2.9,1.2
S16,Meat & Fish,356,2.9,4.3
S16,Ready Meals,241,4.1,11.9
S17,Bakery,250,5.3,14.1
S17,Chilled Drinks,113,1.7,0.2
S17,Dairy,1,0.0,0.0
S17,Fresh Produce,540,5.5,1.2
S17,Meat & Fish,636,4.3,2.7
S17,Ready Meals,361,5.6,9.4
S18,Bakery,775,19.1,4.1
S18,Chilled Drinks,462,10.0,0.0
S18,Dairy,248,3.4,0.0
S18,Fresh Produce,1447,18.9,0.0
S18,Meat & Fish,2140,17.9,1.7
S18,Ready Meals,1210,21.7,3.7
S19,Bakery,209,6.3,12.4
S19,Chilled Drinks,142,3.0,1.1
S19,Dairy,1,0.0,0.6
S19,Fresh Produce,379,5.9,0.9
S19,Meat & Fish,708,6.9,1.8
S19,Ready Meals,372,8.0,7.4
S20,Bakery,132,4.5,14.8
S20,Chilled Drinks,76,1.8,0.4
S20,Dairy,3,0.1,0.6
S20,Fresh Produce,363,5.9,0.9
S20,Meat & Fish,405,4.5,2.4
S20,Ready Meals,283,6.9,8.5`,

  weekly_supplier_stockout_pct: `week,SUP01,SUP02,SUP03,SUP04,SUP05,SUP06,SUP07,SUP08
1,0.9,1.1,13.0,1.3,6.1,2.1,10.0,20.1
2,0.3,0.8,12.7,0.5,10.4,0.1,0.0,0.3
3,0.1,1.8,13.9,0.2,8.5,0.2,0.1,0.0
4,0.1,0.7,15.8,1.1,14.0,0.2,0.6,0.7
5,0.6,0.5,15.8,0.5,7.0,0.4,0.3,0.4
6,0.0,0.2,14.0,0.5,6.1,0.0,0.1,0.0
7,0.1,0.7,13.8,5.5,6.8,0.7,0.6,0.1
8,0.2,0.3,13.3,4.9,9.8,1.0,1.0,0.0
9,0.4,2.0,20.2,10.2,15.2,1.2,1.0,0.9
10,0.0,0.4,13.0,2.6,4.6,0.1,0.1,0.0
11,0.4,0.2,17.5,0.3,6.3,0.2,0.1,0.0
12,0.1,0.4,8.0,1.2,9.2,0.0,0.1,0.7
13,0.8,0.8,16.5,1.0,11.9,0.3,0.0,0.8`,

  current_position: `store_id,sku_id,closing_units,avg_daily_sales_7d,min_days_to_expiry,on_order_units
S07,SKU001,0,22.0,,61
S18,SKU001,179,10.8,2,0
S18,SKU002,36,7.7,1,14
S07,SKU003,0,14.2,,40
S18,SKU003,205,7.0,1,0
S18,SKU011,38,7.0,1,7
S06,SKU013,45,11.7,2,6
S18,SKU013,42,6.3,2,2
S19,SKU013,28,6.2,1,1
S03,SKU014,17,12.0,2,7
S07,SKU014,16,10.3,2,8
S10,SKU014,10,9.7,2,8
S11,SKU014,10,8.5,2,6
S02,SKU022,27,6.7,1,1
S06,SKU022,30,6.7,2,1
S12,SKU022,19,5.5,1,3
S17,SKU022,25,6.3,1,0
S18,SKU022,21,4.5,1,8
S10,SKU023,45,23.3,2,18
S01,SKU025,19,10.0,2,2
S02,SKU025,10,8.5,1,7
S07,SKU025,11,9.3,1,6
S03,SKU026,7,9.5,1,5
S05,SKU026,6,11.5,1,8
S09,SKU026,9,11.3,1,7
S13,SKU026,4,9.3,1,8
S14,SKU026,5,10.7,1,8
S15,SKU026,2,10.7,1,10
S01,SKU027,3,5.3,1,4
S04,SKU027,2,4.7,1,4
S08,SKU027,4,6.3,1,4
S01,SKU029,60,16.7,3,4
S02,SKU029,57,14.7,3,3
S03,SKU029,52,12.8,3,0
S06,SKU029,55,12.5,3,0
S07,SKU029,55,16.0,3,2
S08,SKU029,69,15.7,3,0
S09,SKU029,65,14.3,2,0
S15,SKU029,49,13.3,3,0
S16,SKU029,31,8.8,1,0
S18,SKU029,32,6.0,1,4
S19,SKU029,29,6.3,3,0
S02,SKU030,42,10.8,3,3
S06,SKU030,40,9.5,3,0
S08,SKU030,46,12.0,3,0
S18,SKU030,36,6.0,1,0
S17,SKU031,17,4.3,2,1
S18,SKU031,23,4.0,3,0
S01,SKU032,25,7.5,2,10
S05,SKU032,31,9.5,2,7
S08,SKU032,33,9.0,2,3
S13,SKU032,21,4.8,2,0
S17,SKU032,29,7.7,2,1
S18,SKU032,25,4.8,1,2
S08,SKU033,19,5.2,2,0
S14,SKU033,10,5.3,2,5
S09,SKU034,12,3.5,1,0
S04,SKU037,12,2.7,1,0
S06,SKU037,15,2.7,1,0
S08,SKU037,22,4.5,2,0
S18,SKU037,15,2.8,2,3
S01,SKU039,19,10.0,2,1
S02,SKU039,18,9.2,1,3
S03,SKU039,11,9.7,1,7
S05,SKU039,11,6.3,1,3
S07,SKU039,12,10.3,1,7
S08,SKU039,14,9.5,1,4
S10,SKU039,11,10.8,2,8
S14,SKU039,13,9.7,2,6
S15,SKU039,9,6.0,1,4
S16,SKU039,7,7.0,2,5
S17,SKU039,10,8.5,1,7
S19,SKU039,7,5.0,1,4
S01,SKU040,20,7.2,1,6
S06,SKU040,24,6.7,1,1
S03,SKU041,8,5.3,1,3
S08,SKU041,12,6.8,2,2
S15,SKU041,6,5.5,2,5
S01,SKU042,20,13.8,1,10
S02,SKU042,20,12.2,1,6
S03,SKU042,15,12.3,1,6
S04,SKU042,15,11.8,1,7
S05,SKU042,16,12.0,2,9
S08,SKU042,19,15.8,2,12
S09,SKU042,19,12.2,1,7
S12,SKU042,11,9.8,1,8
S14,SKU042,16,11.7,2,8
S15,SKU042,12,8.5,1,5
S09,SKU043,3,3.3,1,2
S01,SKU044,11,9.5,2,8
S01,SKU047,25,5.2,1,0
S18,SKU047,16,2.3,1,1`,

  inventory_daily: `date,store_id,sku_id,opening,delivered,sold,waste,closing,stockout_flag
2026-09-23,S01,SKU042,18,9,11,0,16,0
2026-09-24,S01,SKU042,16,10,8,0,18,0
2026-09-25,S01,SKU042,18,0,16,0,2,0
2026-09-26,S01,SKU042,2,18,20,0,0,1
2026-09-27,S01,SKU042,0,31,16,0,15,0
2026-09-28,S01,SKU042,15,17,12,0,20,0
2026-09-23,S02,SKU029,35,15,11,0,39,0
2026-09-24,S02,SKU029,39,11,14,0,36,0
2026-09-25,S02,SKU029,36,16,21,0,31,0
2026-09-26,S02,SKU029,31,29,18,0,42,0
2026-09-27,S02,SKU029,42,22,16,0,48,0
2026-09-28,S02,SKU029,48,17,8,0,57,0
2026-09-23,S03,SKU029,30,19,10,0,39,0
2026-09-24,S03,SKU029,39,8,13,0,34,0
2026-09-25,S03,SKU029,34,13,14,0,33,0
2026-09-26,S03,SKU029,33,15,27,0,21,0
2026-09-27,S03,SKU029,21,38,10,0,49,0
2026-09-28,S03,SKU029,49,6,3,0,52,0
2026-09-23,S03,SKU039,1,12,12,0,1,0
2026-09-24,S03,SKU039,1,14,12,0,3,0
2026-09-25,S03,SKU039,3,13,8,0,8,0
2026-09-26,S03,SKU039,8,8,16,0,0,1
2026-09-27,S03,SKU039,0,21,8,0,13,0
2026-09-28,S03,SKU039,13,0,2,0,11,0
2026-09-23,S03,SKU042,14,4,18,0,0,1
2026-09-24,S03,SKU042,0,23,13,0,10,0
2026-09-25,S03,SKU042,10,0,9,0,1,0
2026-09-26,S03,SKU042,1,21,15,0,7,0
2026-09-27,S03,SKU042,7,16,11,0,12,0
2026-09-28,S03,SKU042,12,11,8,0,15,0
2026-09-23,S04,SKU042,5,16,11,0,10,0
2026-09-24,S04,SKU042,10,11,9,0,12,0
2026-09-25,S04,SKU042,12,8,10,0,10,0
2026-09-26,S04,SKU042,10,10,20,0,0,0
2026-09-27,S04,SKU042,0,24,12,0,12,0
2026-09-28,S04,SKU042,12,12,9,0,15,0
2026-09-23,S06,SKU029,24,21,12,0,33,0
2026-09-24,S06,SKU029,33,13,11,0,35,0
2026-09-25,S06,SKU029,35,12,20,0,27,0
2026-09-26,S06,SKU029,27,28,19,0,36,0
2026-09-27,S06,SKU029,36,25,10,0,51,0
2026-09-28,S06,SKU029,51,7,3,0,55,0
2026-09-23,S07,SKU001,54,3,17,0,40,0
2026-09-24,S07,SKU001,40,14,20,0,34,0
2026-09-25,S07,SKU001,34,0,28,0,6,0
2026-09-26,S07,SKU001,6,32,37,0,1,0
2026-09-27,S07,SKU001,1,65,24,0,42,0
2026-09-28,S07,SKU001,6,0,6,0,0,1
2026-09-23,S07,SKU003,26,12,13,0,25,0
2026-09-24,S07,SKU003,25,12,17,0,20,0
2026-09-25,S07,SKU003,20,19,13,0,26,0
2026-09-26,S07,SKU003,26,12,19,0,19,0
2026-09-27,S07,SKU003,19,21,17,0,23,0
2026-09-28,S07,SKU003,6,0,6,0,0,1
2026-09-23,S07,SKU039,8,10,12,0,6,0
2026-09-24,S07,SKU039,6,13,9,0,10,0
2026-09-25,S07,SKU039,10,9,7,0,12,0
2026-09-26,S07,SKU039,12,6,16,0,2,0
2026-09-27,S07,SKU039,2,18,10,0,10,0
2026-09-28,S07,SKU039,10,10,8,0,12,0
2026-09-23,S08,SKU029,47,7,10,0,44,0
2026-09-24,S08,SKU029,44,7,8,0,43,0
2026-09-25,S08,SKU029,43,4,22,0,25,0
2026-09-26,S08,SKU029,25,31,33,0,23,0
2026-09-27,S08,SKU029,23,49,18,0,54,0
2026-09-28,S08,SKU029,54,18,3,0,69,0
2026-09-23,S08,SKU032,23,7,5,0,25,0
2026-09-24,S08,SKU032,25,3,8,4,16,0
2026-09-25,S08,SKU032,16,0,11,0,5,0
2026-09-26,S08,SKU032,5,27,10,0,22,0
2026-09-27,S08,SKU032,22,12,14,0,20,0
2026-09-28,S08,SKU032,20,19,6,0,33,0
2026-09-23,S08,SKU039,9,5,6,0,8,0
2026-09-24,S08,SKU039,8,6,8,0,6,0
2026-09-25,S08,SKU039,6,9,12,0,3,0
2026-09-26,S08,SKU039,3,14,16,0,1,0
2026-09-27,S08,SKU039,1,19,9,0,11,0
2026-09-28,S08,SKU039,11,9,6,0,14,0
2026-09-23,S08,SKU042,17,7,9,0,15,0
2026-09-24,S08,SKU042,15,8,11,0,12,0
2026-09-25,S08,SKU042,12,11,21,0,2,0
2026-09-26,S08,SKU042,2,25,22,0,5,0
2026-09-27,S08,SKU042,5,25,19,0,11,0
2026-09-28,S08,SKU042,11,21,13,0,19,0
2026-09-23,S09,SKU029,23,31,14,0,40,0
2026-09-24,S09,SKU029,40,16,16,0,40,0
2026-09-25,S09,SKU029,40,19,16,0,43,0
2026-09-26,S09,SKU029,43,18,30,0,31,0
2026-09-27,S09,SKU029,31,44,5,0,70,0
2026-09-28,S09,SKU029,70,0,5,0,65,0
2026-09-23,S10,SKU039,6,9,10,0,5,0
2026-09-24,S10,SKU039,5,11,7,0,9,0
2026-09-25,S10,SKU039,9,6,12,0,3,0
2026-09-26,S10,SKU039,3,14,13,0,4,0
2026-09-27,S10,SKU039,4,14,14,0,4,0
2026-09-28,S10,SKU039,4,16,9,0,11,0
2026-09-23,S14,SKU039,3,9,4,0,8,0
2026-09-24,S14,SKU039,8,3,10,0,1,0
2026-09-25,S14,SKU039,1,12,10,0,3,0
2026-09-26,S14,SKU039,3,12,13,0,2,0
2026-09-27,S14,SKU039,2,16,14,0,4,0
2026-09-28,S14,SKU039,4,16,7,0,13,0
2026-09-23,S15,SKU026,2,9,9,0,2,0
2026-09-24,S15,SKU026,2,8,10,0,0,1
2026-09-25,S15,SKU026,0,11,11,0,0,1
2026-09-26,S15,SKU026,0,12,12,0,0,1
2026-09-27,S15,SKU026,0,13,11,0,2,0
2026-09-28,S15,SKU026,2,11,11,0,2,0
2026-09-23,S16,SKU029,27,8,15,0,20,0
2026-09-24,S16,SKU029,20,19,6,0,33,0
2026-09-25,S16,SKU029,33,3,11,0,25,0
2026-09-26,S16,SKU029,25,12,13,0,24,0
2026-09-27,S16,SKU029,24,15,4,0,35,0
2026-09-28,S16,SKU029,35,0,4,0,31,0
2026-09-23,S16,SKU039,3,8,7,0,4,0
2026-09-24,S16,SKU039,4,7,8,0,3,0
2026-09-25,S16,SKU039,3,9,8,0,4,0
2026-09-26,S16,SKU039,4,9,5,0,8,0
2026-09-27,S16,SKU039,8,4,8,0,4,0
2026-09-28,S16,SKU039,4,9,6,0,7,0
2026-09-23,S17,SKU039,8,5,9,0,4,0
2026-09-24,S17,SKU039,4,10,9,0,5,0
2026-09-25,S17,SKU039,5,10,5,0,10,0
2026-09-26,S17,SKU039,10,4,14,0,0,1
2026-09-27,S17,SKU039,0,18,7,0,11,0
2026-09-28,S17,SKU039,11,6,7,0,10,0
2026-09-23,S18,SKU001,58,9,7,0,60,0
2026-09-24,S18,SKU001,60,2,8,0,54,0
2026-09-25,S18,SKU001,54,6,9,0,51,0
2026-09-26,S18,SKU001,51,8,19,0,40,0
2026-09-27,S18,SKU001,40,31,17,0,54,0
2026-09-28,S18,SKU001,160,24,5,0,179,0
2026-09-23,S18,SKU003,34,1,8,0,27,0
2026-09-24,S18,SKU003,27,11,5,0,33,0
2026-09-25,S18,SKU003,33,4,8,0,29,0
2026-09-26,S18,SKU003,29,10,8,0,31,0
2026-09-27,S18,SKU003,31,11,5,0,37,0
2026-09-28,S18,SKU003,210,3,8,0,205,0
2026-09-23,S18,SKU029,33,10,10,0,33,0
2026-09-24,S18,SKU029,33,14,5,0,42,0
2026-09-25,S18,SKU029,42,2,8,0,36,0
2026-09-26,S18,SKU029,36,9,7,0,38,0
2026-09-27,S18,SKU029,38,7,2,1,42,0
2026-09-28,S18,SKU029,42,0,4,6,32,0
2026-09-23,S18,SKU030,30,0,9,0,21,0
2026-09-24,S18,SKU030,21,16,6,0,31,0
2026-09-25,S18,SKU030,31,6,5,9,23,0
2026-09-26,S18,SKU030,23,0,10,0,13,0
2026-09-27,S18,SKU030,13,29,4,0,38,0
2026-09-28,S18,SKU030,38,0,2,0,36,0
2026-09-23,S18,SKU032,9,12,6,0,15,0
2026-09-24,S18,SKU032,15,9,5,0,19,0
2026-09-25,S18,SKU032,19,7,4,0,22,0
2026-09-26,S18,SKU032,22,4,7,0,19,0
2026-09-27,S18,SKU032,19,10,4,0,25,0
2026-09-28,S18,SKU032,25,4,3,1,25,0`,
};

// CSV parsing utilities
export function parseCSVLines(csv: string): string[][] {
  return csv
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line) => line.split(',').map((cell) => cell.trim()));
}

export function parseData() {
  const storesLines = parseCSVLines(RAW_CSV.dim_store);
  const storesHeader = storesLines[0];
  const dim_stores: DimStore[] = storesLines.slice(1).map((row) => ({
    store_id: row[0],
    store_name: row[1],
    format: row[2],
  }));

  const productsLines = parseCSVLines(RAW_CSV.dim_product);
  const dim_products: DimProduct[] = productsLines.slice(1).map((row) => ({
    sku_id: row[0],
    product_name: row[1],
    category: row[2],
    shelf_life_days: Number(row[3]),
    unit_price_gbp: Number(row[4]),
    supplier_id: row[5],
  }));

  const suppliersLines = parseCSVLines(RAW_CSV.dim_supplier);
  const dim_suppliers: DimSupplier[] = suppliersLines.slice(1).map((row) => ({
    supplier_id: row[0],
    supplier_name: row[1],
    lead_time_days: Number(row[2]),
    on_time_delivery_pct: Number(row[3]),
  }));

  const distanceLines = parseCSVLines(RAW_CSV.store_distance_km);
  const store_distances: StoreDistanceKm[] = distanceLines.slice(1).map((row) => ({
    store_a: row[0],
    store_b: row[1],
    road_distance_km: Number(row[2]),
  }));

  const weeklyChainLines = parseCSVLines(RAW_CSV.weekly_chain);
  const weekly_chain: WeeklyChain[] = weeklyChainLines.slice(1).map((row) => ({
    week: Number(row[0]),
    waste_gbp: Number(row[1]),
    lost_sales_gbp: Number(row[2]),
    stockout_pct: Number(row[3]),
    fresh_waste_pct: Number(row[4]),
  }));

  const storeTotalsLines = parseCSVLines(RAW_CSV.store_totals);
  const store_totals: StoreTotal[] = storeTotalsLines.slice(1).map((row) => ({
    store_id: row[0],
    waste_gbp: Number(row[1]),
    lost_sales_gbp: Number(row[2]),
    stockout_pct: Number(row[3]),
    fresh_waste_pct: Number(row[4]),
  }));

  const storeCategoryTotalsLines = parseCSVLines(RAW_CSV.store_category_totals);
  const store_category_totals: StoreCategoryTotal[] = storeCategoryTotalsLines.slice(1).map((row) => ({
    store_id: row[0],
    category: row[1],
    waste_gbp: Number(row[2]),
    waste_pct: Number(row[3]),
    stockout_pct: Number(row[4]),
  }));

  const supplierStockoutLines = parseCSVLines(RAW_CSV.weekly_supplier_stockout_pct);
  const weekly_supplier_stockout_pct: WeeklySupplierStockoutPct[] = supplierStockoutLines.slice(1).map((row) => ({
    week: Number(row[0]),
    SUP01: Number(row[1]),
    SUP02: Number(row[2]),
    SUP03: Number(row[3]),
    SUP04: Number(row[4]),
    SUP05: Number(row[5]),
    SUP06: Number(row[6]),
    SUP07: Number(row[7]),
    SUP08: Number(row[8]),
  }));

  const currentPositionLines = parseCSVLines(RAW_CSV.current_position);
  const current_position: CurrentPosition[] = currentPositionLines.slice(1).map((row) => ({
    store_id: row[0],
    sku_id: row[1],
    closing_units: Number(row[2]),
    avg_daily_sales_7d: Number(row[3]),
    min_days_to_expiry: row[4] !== '' && !isNaN(Number(row[4])) ? Number(row[4]) : null,
    on_order_units: Number(row[5]),
  }));

  const inventoryDailyLines = parseCSVLines(RAW_CSV.inventory_daily);
  const inventory_daily: InventoryDaily[] = inventoryDailyLines.slice(1).map((row) => ({
    date: row[0],
    store_id: row[1],
    sku_id: row[2],
    opening: Number(row[3]),
    delivered: Number(row[4]),
    sold: Number(row[5]),
    waste: Number(row[6]),
    closing: Number(row[7]),
    stockout_flag: Number(row[8]),
  }));

  return {
    dim_stores,
    dim_products,
    dim_suppliers,
    store_distances,
    weekly_chain,
    store_totals,
    store_category_totals,
    weekly_supplier_stockout_pct,
    current_position,
    inventory_daily,
  };
}

export type ParsedDataset = ReturnType<typeof parseData>;

// Distance lookup helper (symmetric)
export function getStoreDistanceKm(
  distances: StoreDistanceKm[],
  storeA: string,
  storeB: string
): number | null {
  if (storeA === storeB) return 0;
  const match = distances.find(
    (d) =>
      (d.store_a === storeA && d.store_b === storeB) ||
      (d.store_a === storeB && d.store_b === storeA)
  );
  return match ? match.road_distance_km : null;
}
