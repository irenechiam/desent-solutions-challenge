
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

type CheckoutSummaryProps = {
  selectedDesk: DeskId;
  selectedChair: ChairId;
  selectedAccessories: AccessoryId[];
  monthlyTotal: number;
};

const rentalPeriods = [1, 3, 6, 12];

export default function CheckoutSummary({
  selectedDesk,
  selectedChair,
  selectedAccessories,
  monthlyTotal,
}: CheckoutSummaryProps) {
  const [rentalMonths, setRentalMonths] = useState(3);
  const [showReview, setShowReview] = useState(false);

  const selectedDeskProduct = desks.find(
    (item) => item.id === selectedDesk
  );

  const selectedChairProduct = chairs.find(
    (item) => item.id === selectedChair
  );

  const selectedAccessoryProducts = accessories.filter((item) =>
    selectedAccessories.includes(item.id as AccessoryId)
  );

  const rentalTotal = monthlyTotal * rentalMonths;

  return (
    <section className="mt-3 rounded-2xl border border-stone-200 bg-white/90 p-5 shadow-sm backdrop-blur-md">
      <div>
        <p className="text-sm font-semibold text-stone-900">
          Your rental plan
        </p>
        <p className="mt-1 text-sm text-stone-500">
          Choose how long you'd like your workspace.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {rentalPeriods.map((months) => {
          const isSelected = rentalMonths === months;

          return (
            <button
              key={months}
              type="button"
              aria-pressed={isSelected}
              onClick={() => setRentalMonths(months)}
              className={`rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-emerald-700 bg-emerald-50 text-emerald-900"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              {months} {months === 1 ? "month" : "months"}
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-stone-200 pt-4">
        <p className="text-sm text-stone-500">
          Estimated monthly cost
        </p>

        <p className="mt-1 text-2xl font-semibold text-stone-900">
          ${monthlyTotal}
          <span className="ml-1 text-sm font-normal text-stone-500">
            / month
          </span>
        </p>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-stone-500">
              Total for {rentalMonths}{" "}
              {rentalMonths === 1 ? "month" : "months"}
            </p>
            <p className="mt-1 text-3xl font-semibold text-stone-900">
              ${rentalTotal}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowReview((current) => !current)}
            aria-expanded={showReview}
            className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
          >
            {showReview ? "Hide review" : "Review setup"}
          </button>
        </div>
      </div>

      {showReview && (
        <div className="mt-5 rounded-xl bg-stone-50 p-4">
          <h3 className="font-semibold text-stone-900">
            Your workspace
          </h3>

          <div className="mt-3 space-y-3">
            {selectedDeskProduct && (
              <div className="flex justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-stone-800">
                    {selectedDeskProduct.name}
                  </p>
                  <p className="text-stone-500">
                    Desk
                  </p>
                </div>
                <p className="shrink-0 text-stone-700">
                  ${selectedDeskProduct.pricePerMonth}/mo
                </p>
              </div>
            )}

            {selectedChairProduct && (
              <div className="flex justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-stone-800">
                    {selectedChairProduct.name}
                  </p>
                  <p className="text-stone-500">
                    Chair
                  </p>
                </div>
                <p className="shrink-0 text-stone-700">
                  ${selectedChairProduct.pricePerMonth}/mo
                </p>
              </div>
            )}

            {selectedAccessoryProducts.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-3 text-sm"
              >
                <div>
                  <p className="font-medium text-stone-800">
                    {item.name}
                  </p>
                  <p className="text-stone-500">
                    Accessory
                  </p>
                </div>
                <p className="shrink-0 text-stone-700">
                  ${item.pricePerMonth}/mo
                </p>
              </div>
            ))}

            <div className="border-t border-stone-200 pt-3">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-stone-600">
                  Rental duration
                </span>
                <span className="font-medium text-stone-900">
                  {rentalMonths}{" "}
                  {rentalMonths === 1 ? "month" : "months"}
                </span>
              </div>

              <div className="mt-2 flex justify-between gap-3 text-sm">
                <span className="text-stone-600">
                  Monthly cost
                </span>
                <span className="font-medium text-stone-900">
                  ${monthlyTotal}
                </span>
              </div>

              <div className="mt-3 flex justify-between gap-3">
                <span className="font-semibold text-stone-900">
                  Estimated total
                </span>
                <span className="font-semibold text-stone-900">
                  ${rentalTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs leading-5 text-stone-500">
        Illustrative prototype pricing only. Final rental prices,
        availability, and terms would need to be confirmed by Monis.
      </p>
    </section>
  );
}
