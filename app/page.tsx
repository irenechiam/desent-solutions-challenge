
"use client";

import { useState } from "react";
import WorkspaceScene from "./components/WorkspaceScene";
import FurniturePanel from "./components/FurniturePanel";
import type {
  DeskId,
  ChairId,
  AccessoryId,
} from "./data/products";
import { desks, chairs, accessories } from "./data/products";

export default function Home() {
  const [selectedDesk, setSelectedDesk] = useState<DeskId>("oak");
  const [selectedChair, setSelectedChair] = useState<ChairId>("sage");
  const [selectedAccessories, setSelectedAccessories] =
    useState<AccessoryId[]>(["monitor", "plant"]);

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
      />

      <header className="pointer-events-none absolute left-6 top-6 z-10 max-w-sm sm:left-10 sm:top-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          MONIS RENT · WORKSPACE STUDIO
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl">
          Make room for your best work.
        </h1>

        <p className="mt-3 max-w-xs text-sm leading-6 text-stone-600 sm:text-base">
          Build a workspace that feels like yours.
          Choose your furniture and create your perfect setup in Bali.
        </p>
      </header>

      <div className="absolute bottom-5 right-5 top-36 z-20 w-[min(340px,calc(100%-2.5rem))] overflow-y-auto sm:bottom-8 sm:right-8 sm:top-40">
        <FurniturePanel
          selectedDesk={selectedDesk}
          selectedChair={selectedChair}
          selectedAccessories={selectedAccessories}
          onDeskChange={setSelectedDesk}
          onChairChange={setSelectedChair}
          onAccessoryToggle={toggleAccessory}
        />

        <div className="mt-3 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm backdrop-blur-md">
          <p className="text-sm text-stone-500">Estimated monthly total</p>
          <p className="mt-1 text-3xl font-semibold text-stone-900">
            ${monthlyTotal}
            <span className="ml-1 text-sm font-normal text-stone-500">
              / month
            </span>
          </p>
          <p className="mt-2 text-xs text-stone-500">
            Illustrative pricing for the challenge prototype.
          </p>
        </div>
      </div>
    </main>
  );
}
