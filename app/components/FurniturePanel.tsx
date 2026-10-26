
"use client";

import {
  desks,
  chairs,
  accessories,
  type DeskId,
  type ChairId,
  type AccessoryId,
} from "../data/products";

type FurniturePanelProps = {
  selectedDesk: DeskId;
  selectedChair: ChairId;
  selectedAccessories: AccessoryId[];
  onDeskChange: (id: DeskId) => void;
  onChairChange: (id: ChairId) => void;
  onAccessoryToggle: (id: AccessoryId) => void;
};

export default function FurniturePanel({
  selectedDesk,
  selectedChair,
  selectedAccessories,
  onDeskChange,
  onChairChange,
  onAccessoryToggle,
}: FurniturePanelProps) {
  return (
    <aside className="w-full space-y-6 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm backdrop-blur-md">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">
          Build your workspace
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Choose the pieces that work for you.
        </p>
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-stone-800">
          Desks
        </h3>
        <div className="space-y-2">
          {desks.map((desk) => (
            <button
              key={desk.id}
              onClick={() => onDeskChange(desk.id as DeskId)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                selectedDesk === desk.id
                  ? "border-emerald-800 bg-emerald-50"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              <span className="block text-sm font-medium text-stone-900">
                {desk.name}
              </span>
              <span className="mt-1 block text-xs text-stone-500">
                {desk.description}
              </span>
              <span className="mt-2 block text-sm font-semibold text-stone-800">
                ${desk.pricePerMonth} / month
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-stone-800">
          Chairs
        </h3>
        <div className="space-y-2">
          {chairs.map((chair) => (
            <button
              key={chair.id}
              onClick={() => onChairChange(chair.id as ChairId)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                selectedChair === chair.id
                  ? "border-emerald-800 bg-emerald-50"
                  : "border-stone-200 hover:border-stone-400"
              }`}
            >
              <span className="block text-sm font-medium text-stone-900">
                {chair.name}
              </span>
              <span className="mt-1 block text-xs text-stone-500">
                {chair.description}
              </span>
              <span className="mt-2 block text-sm font-semibold text-stone-800">
                ${chair.pricePerMonth} / month
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-stone-800">
          Accessories
        </h3>
        <div className="space-y-3">
          {accessories.map((accessory) => {
            const checked = selectedAccessories.includes(
              accessory.id as AccessoryId
            );

            return (
              <label
                key={accessory.id}
                className="flex cursor-pointer items-start gap-3"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onAccessoryToggle(accessory.id as AccessoryId)
                  }
                  className="mt-1 accent-emerald-800"
                />
                <span className="flex-1">
                  <span className="block text-sm font-medium text-stone-800">
                    {accessory.name}
                  </span>
                  <span className="block text-xs text-stone-500">
                    {accessory.description}
                  </span>
                </span>
                <span className="text-sm text-stone-700">
                  ${accessory.pricePerMonth}/mo
                </span>
              </label>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
