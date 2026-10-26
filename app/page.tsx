
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

type SelectedItem = "workspace" | "desk" | "chair" | "monitor" | "plant";

export default function Home() {
  const [selectedDesk, setSelectedDesk] = useState<DeskId>("oak");
  const [selectedChair, setSelectedChair] = useState<ChairId>("taupe");
  const [selectedAccessories, setSelectedAccessories] =
    useState<AccessoryId[]>(["monitor", "plant"]);

    const [selectedItem, setSelectedItem] =
    useState<SelectedItem>("workspace");

  function toggleAccessory(id: AccessoryId) {
    setSelectedAccessories((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
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
      <WorkspaceScene
        selectedDesk={selectedDesk}
        selectedChair={selectedChair}
        selectedAccessories={selectedAccessories}
        onItemSelect={setSelectedItem}
      />

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

      <div className="absolute bottom-3 right-3 top-24 z-20 w-[min(360px,calc(100%-1.5rem))] overflow-y-auto overscroll-contain sm:bottom-5 sm:right-6 sm:top-28">
        <FurniturePanel
          selectedItem={selectedItem}
          selectedDesk={selectedDesk}
          selectedChair={selectedChair}
          selectedAccessories={selectedAccessories}
          onDeskChange={setSelectedDesk}
          onChairChange={setSelectedChair}
          onAccessoryToggle={toggleAccessory}
        />

        <CheckoutSummary
          selectedDesk={selectedDesk}
          selectedChair={selectedChair}
          selectedAccessories={selectedAccessories}
          monthlyTotal={monthlyTotal}
        />
      </div>
    </main>
  );
}
