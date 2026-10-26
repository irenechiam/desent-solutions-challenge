
"use client";

import {
  desks,
  chairs,
  accessories,
  type DeskId,
  type ChairId,
  type AccessoryId,
} from "../data/products";

type SelectedItem = "workspace" | "desk" | "chair" | "monitor" | "plant";

const deskSwatches: Record<DeskId, string> = {
    oak: "#B98B5E",
    white: "#F5F3EE",
  };
  
const chairSwatches: Record<ChairId, string> = {
    taupe: "#A69B8D",
    black: "#30312F",
};

type FurniturePanelProps = {
  selectedItem: SelectedItem;
  selectedDesk: DeskId;
  selectedChair: ChairId;
  selectedAccessories: AccessoryId[];
  onDeskChange: (id: DeskId) => void;
  onChairChange: (id: ChairId) => void;
  onAccessoryToggle: (id: AccessoryId) => void;
};

export default function FurniturePanel({
  selectedItem,
  selectedDesk,
  selectedChair,
  selectedAccessories,
  onDeskChange,
  onChairChange,
  onAccessoryToggle,
}: FurniturePanelProps) {
  const panelClass =
    "w-full space-y-6 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm backdrop-blur-md";

  const selectedDeskData = desks.find((item) => item.id === selectedDesk);
  const selectedChairData = chairs.find((item) => item.id === selectedChair);

  const selectedAccessoryData = accessories.find(
    (item) => item.id === selectedItem
  );

  // Show product details when a 3D object is clicked.
  if (selectedItem !== "workspace") {
    const isDesk = selectedItem === "desk";
    const isChair = selectedItem === "chair";
    const isAccessory = selectedItem === "monitor" || selectedItem === "plant";

    const product = isDesk
      ? selectedDeskData
      : isChair
        ? selectedChairData
        : selectedAccessoryData;

    if (!product) {
      return null;
    }

    const isAccessorySelected = selectedAccessories.includes(
      selectedItem as AccessoryId
    );

    return (
      <aside className={panelClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
            Furniture details
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-stone-900">
            {product.name}
          </h2>

          <p className="mt-2 text-sm leading-6 text-stone-600">
            {product.description}
          </p>

          <p className="mt-4 text-xl font-semibold text-stone-900">
            ${product.pricePerMonth}
            <span className="ml-1 text-sm font-normal text-stone-500">
              / month
            </span>
          </p>
        </div>

        {isDesk && (
          <section>
            <h3 className="mb-3 text-sm font-semibold text-stone-800">
              Choose a desk
            </h3>

            <div className="space-y-2">
              {desks.map((desk) => (
                <button
                  key={desk.id}
                  type="button"
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
                    ${desk.pricePerMonth} / month
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {isChair && (
          <section>
            <h3 className="mb-3 text-sm font-semibold text-stone-800">
              Choose a chair
            </h3>

            <div className="space-y-2">
              {chairs.map((chair) => (
                <button
                  key={chair.id}
                  type="button"
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
                    ${chair.pricePerMonth} / month
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {isAccessory && (
          <button
            type="button"
            onClick={() => onAccessoryToggle(selectedItem as AccessoryId)}
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isAccessorySelected
                ? "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                : "bg-emerald-800 text-white hover:bg-emerald-900"
            }`}
          >
            {isAccessorySelected ? "Remove from workspace" : "Add to workspace"}
          </button>
        )}

        <p className="text-xs leading-5 text-stone-500">
          Your monthly total updates automatically when you change your
          selection.
        </p>
      </aside>
    );
  }

  // Default view: the full workspace builder.
  return (
    <aside className={panelClass}>
      <div>
        <h2 className="text-lg font-semibold text-stone-900">
          Build your workspace
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Choose the pieces that work for you.
        </p>
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-stone-800">Desks</h3>

        <div className="space-y-2">
          {desks.map((desk) => (
            <button
              key={desk.id}
              type="button"
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
        <h3 className="mb-3 text-sm font-semibold text-stone-800">Chairs</h3>

        <div className="space-y-2">
          {chairs.map((chair) => (
            <button
              key={chair.id}
              type="button"
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
