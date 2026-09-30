/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { parseData, ParsedDataset } from './data';
import {
  computeRiskItems,
  computeSuggestedTransfers,
  CalculatedRiskItem,
  SuggestedTransfer,
} from './utils/calculations';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { WeeklyTrendChart } from './components/WeeklyTrendChart';
import { RiskList } from './components/RiskList';
import { SuggestedTransfers } from './components/SuggestedTransfers';
import { SidePanel } from './components/SidePanel';
import { ChatbotPanel } from './components/ChatbotPanel';
import { SyncDriveModal } from './components/SyncDriveModal';

export default function App() {
  // Main state initialized with static parsed CSV data
  const [dataset, setDataset] = useState<ParsedDataset>(() => parseData());
  const [selectedStoreId, setSelectedStoreId] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Interactive drawer and modal states
  const [activeSidePanel, setActiveSidePanel] = useState<{
    storeId: string;
    skuId: string;
  } | null>(null);

  const [selectedRiskItem, setSelectedRiskItem] = useState<CalculatedRiskItem | null>(null);
  const [selectedTransfer, setSelectedTransfer] = useState<SuggestedTransfer | null>(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialQuestion, setChatInitialQuestion] = useState<string | undefined>(undefined);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [lastSynced, setLastSynced] = useState('28/09/2026, 08:30 GMT');
  const [isLiveDemoActive, setIsLiveDemoActive] = useState(false);

  // Memoized computations
  const riskItems = useMemo(() => computeRiskItems(dataset), [dataset]);
  const suggestedTransfers = useMemo(
    () => computeSuggestedTransfers(dataset, riskItems),
    [dataset, riskItems]
  );

  // Row selection handler from Risk List
  const handleSelectRiskItem = (item: CalculatedRiskItem) => {
    setSelectedRiskItem(item);
    setSelectedTransfer(null);
    setActiveSidePanel({ storeId: item.store_id, skuId: item.sku_id });
  };

  // Row selection handler from Suggested Transfers
  const handleSelectTransfer = (transfer: SuggestedTransfer) => {
    setSelectedTransfer(transfer);
    setSelectedRiskItem(null);
    // Open side panel for the origin surplus store and SKU
    setActiveSidePanel({
      storeId: transfer.from_store_id,
      skuId: transfer.sku_id,
    });
  };

  // Live Demo trigger:
  // "A 'Live demo' button highlighting Natural Yoghurt 500g (SKU003): surplus at Slough Bath Road (S18)
  // expiring tomorrow, shortage at London Clapham Junction (S07). Show the recommended transfer and let the chatbot explain the cause."
  const handleTriggerLiveDemo = () => {
    setIsLiveDemoActive(true);
    setSelectedStoreId('ALL');
    setSelectedCategory('Dairy');

    // Highlight the SKU003 transfer
    const yoghurtTransfer = suggestedTransfers.find(
      (t) => t.sku_id === 'SKU003' && t.from_store_id === 'S18'
    );
    if (yoghurtTransfer) {
      setSelectedTransfer(yoghurtTransfer);
    }

    // Open side panel diagnostics for S18 SKU003
    setActiveSidePanel({
      storeId: 'S18',
      skuId: 'SKU003',
    });

    // Open chatbot panel with pre-filled targeted question
    setChatInitialQuestion(
      'Why is there a surplus of Natural Yoghurt 500g at Slough Bath Road and a shortage at London Clapham Junction, and what transfer should be executed?'
    );
    setIsChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans selection:bg-[#F3EEFF] selection:text-[#4C1D95]">
      {/* Header */}
      <Header
        stores={dataset.dim_stores}
        selectedStoreId={selectedStoreId}
        onSelectStoreId={(id) => {
          setSelectedStoreId(id);
          setIsLiveDemoActive(false);
        }}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setIsLiveDemoActive(false);
        }}
        onTriggerLiveDemo={handleTriggerLiveDemo}
        onOpenChat={() => {
          setChatInitialQuestion(undefined);
          setIsChatOpen((prev) => !prev);
        }}
        onOpenSync={() => setIsSyncModalOpen(true)}
        lastSyncedText={lastSynced}
        isChatOpen={isChatOpen}
      />

      {/* Main Single-Page Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Active Filter Bar Indicator if filtered */}
        {(selectedStoreId !== 'ALL' || selectedCategory !== 'ALL' || isLiveDemoActive) && (
          <div className="flex flex-wrap items-center justify-between p-3 rounded-xl bg-[#F3EEFF] border border-[#DDD6FE] text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#4C1D95]">Active Filter View:</span>
              <span className="font-mono text-[#111111]">
                Store: <strong>{selectedStoreId}</strong> · Category: <strong>{selectedCategory}</strong>
              </span>
              {isLiveDemoActive && (
                <span className="bg-[#6D28D9] text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  Live Demo Mode (SKU003)
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedStoreId('ALL');
                setSelectedCategory('ALL');
                setIsLiveDemoActive(false);
              }}
              className="text-[#6D28D9] hover:underline font-medium text-xs cursor-pointer"
            >
              Reset to Chain Overview
            </button>
          </div>
        )}

        {/* 1. Four KPI Cards */}
        <section aria-label="Key Performance Indicators">
          <KpiCards
            dataset={dataset}
            selectedStoreId={selectedStoreId}
            selectedCategory={selectedCategory}
          />
        </section>

        {/* 2. One Weekly Trend Chart */}
        <section aria-label="Weekly Trend">
          <WeeklyTrendChart data={dataset.weekly_chain} />
        </section>

        {/* Two-Column Grid: 3. Risk List (Top 10) & 4. Top 5 Suggested Transfers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 3. Risk List (Top 10) */}
          <section aria-label="Risk Priority List">
            <RiskList
              items={riskItems}
              selectedItem={selectedRiskItem}
              onSelectItem={handleSelectRiskItem}
              selectedStoreId={selectedStoreId}
              selectedCategory={selectedCategory}
            />
          </section>

          {/* 4. Top 5 Suggested Transfers */}
          <section aria-label="Suggested Transfers">
            <SuggestedTransfers
              transfers={suggestedTransfers}
              selectedTransferId={selectedTransfer?.id || null}
              onSelectTransfer={handleSelectTransfer}
              isLiveDemoActive={isLiveDemoActive}
            />
          </section>
        </div>
      </main>

      {/* Side Panel: 7-day stock chart, store waste by category, supplier stockout trend */}
      {activeSidePanel && (
        <SidePanel
          storeId={activeSidePanel.storeId}
          skuId={activeSidePanel.skuId}
          dataset={dataset}
          onClose={() => setActiveSidePanel(null)}
        />
      )}

      {/* Chatbot Panel: Ask FreshFlow */}
      <ChatbotPanel
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatInitialQuestion(undefined);
        }}
        selectedStoreId={selectedStoreId}
        selectedSkuId={activeSidePanel?.skuId}
        initialQuestion={chatInitialQuestion}
      />

      {/* Sync Drive Modal */}
      <SyncDriveModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        dataset={dataset}
        lastSynced={lastSynced}
        onUpdateDataset={(updated, timestamp) => {
          setDataset(updated);
          setLastSynced(timestamp);
        }}
      />
    </div>
  );
}
