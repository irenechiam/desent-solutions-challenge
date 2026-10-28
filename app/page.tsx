
"use client";

import { useState } from "react";
import WorkspaceScene from "./components/WorkspaceScene";
import FurniturePanel from "./components/FurniturePanel";
import CheckoutSummary from "./components/CheckoutSummary";

import type {
  DeskId,
  ChairId,
  AccessoryId,
} from "./data/products";

import { desks, chairs, accessories } from "./data/products";

type SelectedItem =
  | "workspace"
  | "desk"
  | "chair"
  | "monitor"
  | "plant";

type SidebarTab = "products" | "checkout" | null;

export default function Home() {
  const [selectedDesk, setSelectedDesk] = useState<DeskId>("oak");
  const [selectedChair, setSelectedChair] = useState<ChairId>("taupe");

  const [selectedAccessories, setSelectedAccessories] =
    useState<AccessoryId[]>(["monitor", "plant"]);

  const [selectedItem, setSelectedItem] =
    useState<SelectedItem>("workspace");

  const [activeSidebar, setActiveSidebar] =
    useState<SidebarTab>(null);

  function toggleAccessory(id: AccessoryId) {
    setSelectedAccessories((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function handleItemSelect(item: SelectedItem) {
    setSelectedItem(item);
  
    if (item !== "workspace") {
      setActiveSidebar("products");
    }
  }

  function toggleSidebar(tab: Exclude<SidebarTab, null>) {
    setActiveSidebar((current) => (current === tab ? null : tab));
  }

  const deskPrice =
    desks.find((item) => item.id === selectedDesk)?.pricePerMonth ?? 0;

  const chairPrice =
    chairs.find((item) => item.id === selectedChair)?.pricePerMonth ?? 0;

  const accessoryPrice = accessories
    .filter((item) =>
      selectedAccessories.includes(item.id as AccessoryId)
    )
    .reduce((total, item) => total + item.pricePerMonth, 0);

  const monthlyTotal = deskPrice + chairPrice + accessoryPrice;

  return (
    <main className="relative h-screen min-h-[600px] overflow-hidden bg-[#F5F1E9]">
      {/* 3D room */}
      <WorkspaceScene
        selectedDesk={selectedDesk}
        selectedChair={selectedChair}
        selectedAccessories={selectedAccessories}
        onItemSelect={handleItemSelect}
      />

      {/* Page heading */}
      <header className="pointer-events-none absolute left-6 top-6 z-10 max-w-sm sm:left-10 sm:top-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          MONIS RENT · WORKSPACE STUDIO
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Make room for your best work.
        </h1>

        <p className="mt-3 max-w-xs text-sm leading-6 text-stone-600 sm:text-base">
          Build a workspace that feels like yours. Choose your furniture
          and create your perfect setup in Bali.
        </p>
      </header>

      {/* Sidebar switcher and active panel */}
      <div className="absolute right-3 top-24 z-30 flex max-h-[calc(100vh-7rem)] w-[min(360px,calc(100%-1.5rem))] flex-col gap-3 sm:right-6 sm:top-28 sm:max-h-[calc(100vh-9rem)]">
        {/* Tabs */}
        <div className="flex self-end rounded-xl border border-stone-200/80 bg-white/90 p-1 shadow-md backdrop-blur-md">
          <button
            type="button"
            onClick={() => toggleSidebar("products")}
            aria-pressed={activeSidebar === "products"}
            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              activeSidebar === "products"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <span aria-hidden="true">🪑</span>
            Products
          </button>

          <button
            type="button"
            onClick={() => toggleSidebar("checkout")}
            aria-pressed={activeSidebar === "checkout"}
            className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              activeSidebar === "checkout"
                ? "bg-stone-900 text-white"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <span aria-hidden="true">🛒</span>
            Checkout
          </button>
        </div>

        {/* Only the selected panel is rendered */}
        {activeSidebar && (
          <div className="min-h-0 overflow-y-auto overscroll-contain rounded-2xl">
            {activeSidebar === "products" && (
              <FurniturePanel
                selectedItem={selectedItem}
                selectedDesk={selectedDesk}
                selectedChair={selectedChair}
                selectedAccessories={selectedAccessories}
                onDeskChange={setSelectedDesk}
                onChairChange={setSelectedChair}
                onAccessoryToggle={toggleAccessory}
              />
            )}

            {activeSidebar === "checkout" && (
              <CheckoutSummary
                selectedDesk={selectedDesk}
                selectedChair={selectedChair}
                selectedAccessories={selectedAccessories}
                monthlyTotal={monthlyTotal}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
