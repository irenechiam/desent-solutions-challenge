
"use client";

import { useState } from "react";

import {
  desks,
  chairs,
  accessories,
  type DeskId,
  type ChairId,
  type AccessoryId,
} from "../data/products";

type SelectedItem = "workspace" | "desk" | "chair" | "monitor" | "plant";

type CategoryName =
  | "Desks"
  | "Chairs"
  | "Plants"
  | "Office Equipment";

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
  const [openCategories, setOpenCategories] = useState<CategoryName[]>([]);

  const panelClass =
    "w-full space-y-5 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm backdrop-blur-md";

  const selectedDeskData = desks.find(
    (item) => item.id === selectedDesk
  );

  const selectedChairData = chairs.find(
    (item) => item.id === selectedChair
  );

  const selectedAccessoryData = accessories.find(
    (item) => item.id === selectedItem
  );

  function toggleCategory(category: CategoryName) {
    setOpenCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category]
    );
  }

  function renderCategoryHeader(
    category: CategoryName,
    description?: string
  ) {
    const isOpen = openCategories.includes(category);

    return (
      <button
        type="button"
        onClick={() => toggleCategory(category)}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 py-1 text-left"
      >
        <span>
          <span className="block text-sm font-semibold text-stone-800">
            {category}
          </span>
          {description && (
            <span className="mt-1 block text-xs text-stone-500">
              {description}
            </span>
          )}
        </span>

        <svg
          className={`h-4 w-4 shrink-0 text-stone-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }

  function renderProductCard(
    product: {
      id: string;
      name: string;
      description: string;
      pricePerMonth: number;
    },
    selected: boolean,
    onSelect: () => void
  ) {
    return (
      <button
        key={product.id}
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className={`w-full rounded-xl border p-3 text-left transition ${
          selected
            ? "border-emerald-800 bg-emerald-50"
            : "border-stone-200 hover:border-stone-400"
        }`}
      >
        <span className="block text-sm font-medium text-stone-900">
          {product.name}
        </span>

        <span className="mt-1 block text-xs leading-5 text-stone-500">
          {product.description}
        </span>

        <span className="mt-2 block text-sm font-semibold text-stone-800">
          ${product.pricePerMonth} / month
        </span>
      </button>
    );
  }

  // Detail view when a 3D object is selected.
  if (selectedItem !== "workspace") {
    const isDesk = selectedItem === "desk";
    const isChair = selectedItem === "chair";
    const isAccessory =
      selectedItem === "monitor" || selectedItem === "plant";

    const product = isDesk
      ? selectedDeskData
      : isChair
        ? selectedChairData
        : selectedAccessoryData;

    if (!product) return null;

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
          <section className="space-y-3">
            {renderCategoryHeader("Desks", "Choose a desk finish")}

            {openCategories.includes("Desks") && (
              <div className="space-y-2">
                {desks.map((desk) =>
                  renderProductCard(
                    desk,
                    selectedDesk === desk.id,
                    () => onDeskChange(desk.id as DeskId)
                  )
                )}
              </div>
            )}
          </section>
        )}

        {isChair && (
          <section className="space-y-3">
            {renderCategoryHeader("Chairs", "Choose a chair finish")}

            {openCategories.includes("Chairs") && (
              <div className="space-y-2">
                {chairs.map((chair) =>
                  renderProductCard(
                    chair,
                    selectedChair === chair.id,
                    () => onChairChange(chair.id as ChairId)
                  )
                )}
              </div>
            )}
          </section>
        )}

        {isAccessory && (
          <button
            type="button"
            onClick={() =>
              onAccessoryToggle(selectedItem as AccessoryId)
            }
            className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
              isAccessorySelected
                ? "border border-stone-300 bg-white text-stone-700 hover:bg-stone-50"
                : "bg-emerald-800 text-white hover:bg-emerald-900"
            }`}
          >
            {isAccessorySelected
              ? "Remove from workspace"
              : "Add to workspace"}
          </button>
        )}

        <p className="text-xs leading-5 text-stone-500">
          Your monthly total updates automatically when you change your
          selection.
        </p>
      </aside>
    );
  }

  // Workspace builder with collapsible product categories.
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

      {/* Desks */}
      <section className="space-y-3">
        {renderCategoryHeader("Desks")}

        {openCategories.includes("Desks") && (
          <div className="space-y-2">
            {desks.map((desk) =>
              renderProductCard(
                desk,
                selectedDesk === desk.id,
                () => onDeskChange(desk.id as DeskId)
              )
            )}
          </div>
        )}
      </section>

      <div className="border-t border-stone-100" />

      {/* Chairs */}
      <section className="space-y-3">
        {renderCategoryHeader("Chairs")}

        {openCategories.includes("Chairs") && (
          <div className="space-y-2">
            {chairs.map((chair) =>
              renderProductCard(
                chair,
                selectedChair === chair.id,
                () => onChairChange(chair.id as ChairId)
              )
            )}
          </div>
        )}
      </section>

      <div className="border-t border-stone-100" />

      {/* Plants */}
      <section className="space-y-3">
        {renderCategoryHeader("Plants")}

        {openCategories.includes("Plants") && (
          <div className="space-y-3">
            {accessories
              .filter((item) => item.id === "plant")
              .map((plant) => {
                const checked = selectedAccessories.includes(
                  plant.id as AccessoryId
                );

                return (
                  <label
                    key={plant.id}
                    className="flex cursor-pointer items-start gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        onAccessoryToggle(plant.id as AccessoryId)
                      }
                      className="mt-1 accent-emerald-800"
                    />

                    <span className="flex-1">
                      <span className="block text-sm font-medium text-stone-800">
                        {plant.name}
                      </span>
                      <span className="block text-xs leading-5 text-stone-500">
                        {plant.description}
                      </span>
                    </span>

                    <span className="whitespace-nowrap text-sm text-stone-700">
                      ${plant.pricePerMonth}/mo
                    </span>
                  </label>
                );
              })}
          </div>
        )}
      </section>

      <div className="border-t border-stone-100" />

      {/* Office Equipment */}
      <section className="space-y-3">
        {renderCategoryHeader("Office Equipment")}

        {openCategories.includes("Office Equipment") && (
          <div className="space-y-3">
            {accessories
              .filter((item) => item.id !== "plant")
              .map((accessory) => {
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
                      <span className="block text-xs leading-5 text-stone-500">
                        {accessory.description}
                      </span>
                    </span>

                    <span className="whitespace-nowrap text-sm text-stone-700">
                      ${accessory.pricePerMonth}/mo
                    </span>
                  </label>
                );
              })}
          </div>
        )}
      </section>
    </aside>
  );
}
