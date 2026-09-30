import React from 'react';
import { RefreshCw, Sparkles, MessageSquareText, HardDrive, Store, Tag } from 'lucide-react';
import { DimStore, FRESH_CATEGORIES } from '../data';

interface HeaderProps {
  stores: DimStore[];
  selectedStoreId: string;
  onSelectStoreId: (storeId: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onTriggerLiveDemo: () => void;
  onOpenChat: () => void;
  onOpenSync: () => void;
  lastSyncedText: string;
  isChatOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  stores,
  selectedStoreId,
  onSelectStoreId,
  selectedCategory,
  onSelectCategory,
  onTriggerLiveDemo,
  onOpenChat,
  onOpenSync,
  lastSyncedText,
  isChatOpen,
}) => {
  return (
    <header className="border-b border-[#DDD6FE]/60 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand Identity */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg bg-[#6D28D9] flex items-center justify-center text-white font-bold text-base shadow-xs">
                  F
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-[#4C1D95] font-heading">
                  FreshFlow
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3EEFF] text-[#4C1D95] font-medium border border-[#DDD6FE]">
                  FreshBasket UK · 20 Stores
                </span>
              </div>
              <p className="text-xs text-[#111111]/70 mt-0.5">
                Precision expiry prevention, stockout defense & store-to-store rebalancing
              </p>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-1.5">
              <button
                onClick={onTriggerLiveDemo}
                className="px-2.5 py-1.5 rounded-lg bg-[#6D28D9] text-white text-xs font-semibold flex items-center gap-1 shadow-xs hover:bg-[#5B21B6] transition-colors"
                title="Live Demo: Natural Yoghurt (SKU003)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Demo
              </button>
              <button
                onClick={onOpenChat}
                className={`p-2 rounded-lg border transition-colors ${
                  isChatOpen
                    ? 'bg-[#6D28D9] text-white border-[#6D28D9]'
                    : 'bg-white text-[#111111] border-[#111111]/20 hover:bg-[#F3EEFF]'
                }`}
                title="Ask FreshFlow AI"
              >
                <MessageSquareText className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Controls & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Store Filter */}
            <div className="relative flex items-center">
              <Store className="w-3.5 h-3.5 text-[#6D28D9] absolute left-2.5 pointer-events-none" />
              <select
                value={selectedStoreId}
                onChange={(e) => onSelectStoreId(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs font-medium rounded-lg border border-[#111111]/20 bg-white text-[#111111] hover:border-[#6D28D9] focus:outline-hidden focus:ring-1 focus:ring-[#6D28D9] transition-all cursor-pointer"
              >
                <option value="ALL">All Stores (Chain)</option>
                {stores.map((s) => (
                  <option key={s.store_id} value={s.store_id}>
                    {s.store_id}: {s.store_name.replace('FreshBasket ', '')}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative flex items-center">
              <Tag className="w-3.5 h-3.5 text-[#6D28D9] absolute left-2.5 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs font-medium rounded-lg border border-[#111111]/20 bg-white text-[#111111] hover:border-[#6D28D9] focus:outline-hidden focus:ring-1 focus:ring-[#6D28D9] transition-all cursor-pointer"
              >
                <option value="ALL">All Fresh Categories</option>
                {FRESH_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sync from Drive */}
            <button
              onClick={onOpenSync}
              className="px-2.5 py-1.5 rounded-lg border border-[#111111]/20 bg-white hover:bg-[#F3EEFF] text-[#111111] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sync CSVs from Google Drive"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#6D28D9]" />
              <span className="hidden sm:inline">Sync Drive</span>
              <span className="text-[10px] text-[#111111]/60 font-mono hidden lg:inline">
                ({lastSyncedText})
              </span>
            </button>

            {/* Live Demo Button */}
            <button
              onClick={onTriggerLiveDemo}
              className="px-3 py-1.5 rounded-lg bg-[#6D28D9] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs hover:bg-[#5B21B6] transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Live Demo</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-sm font-mono">
                SKU003
              </span>
            </button>

            {/* Ask FreshFlow Button */}
            <button
              onClick={onOpenChat}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isChatOpen
                  ? 'bg-[#4C1D95] text-white border-[#4C1D95]'
                  : 'bg-[#F3EEFF] text-[#4C1D95] border-[#DDD6FE] hover:bg-[#DDD6FE]'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>Ask FreshFlow</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
