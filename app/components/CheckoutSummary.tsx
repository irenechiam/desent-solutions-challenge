
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
    <section className="rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">
            Your workspace
          </p>
          <h2 className="mt-1 text-lg font-semibold text-stone-900">
            Rental summary
          </h2>
        </div>

        <div className="text-right">
          <p className="text-2xl font-semibold text-stone-900">
            ${monthlyTotal}
          </p>
          <p className="text-xs text-stone-500">per month</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-stone-600">
          Rental duration
        </p>

        <div className="grid grid-cols-4 gap-2">
          {rentalPeriods.map((months) => {
            const isSelected = rentalMonths === months;

            return (
              <button
                key={months}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setRentalMonths(months)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? "border-emerald-800 bg-emerald-50 text-emerald-900"
                    : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
                }`}
              >
                {months} {months === 1 ? "mo" : "mos"}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3 border-t border-stone-200 pt-4">
        <div>
          <p className="text-xs text-stone-500">
            Estimated rental total
          </p>
          <p className="mt-1 text-2xl font-semibold text-stone-900">
            ${rentalTotal}
          </p>
          <p className="text-xs text-stone-500">
            Over {rentalMonths}{" "}
            {rentalMonths === 1 ? "month" : "months"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowReview((current) => !current)}
          aria-expanded={showReview}
          className="rounded-xl bg-stone-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          {showReview ? "Hide details" : "Review setup"}
        </button>
      </div>

      {showReview && (
        <div className="mt-4 max-h-48 overflow-y-auto rounded-xl bg-stone-50 p-3">
          <h3 className="text-sm font-semibold text-stone-900">
            Selected furniture
          </h3>

          <div className="mt-3 space-y-3">
            {selectedDeskProduct && (
              <div className="flex justify-between gap-3 text-sm">
                <div>
                  <p className="font-medium text-stone-800">
                    {selectedDeskProduct.name}
                  </p>
                  <p className="text-xs text-stone-500">Desk</p>
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
                  <p className="text-xs text-stone-500">Chair</p>
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
                  <p className="text-xs text-stone-500">Accessory</p>
                </div>
                <p className="shrink-0 text-stone-700">
                  ${item.pricePerMonth}/mo
                </p>
              </div>
            ))}

            <div className="border-t border-stone-200 pt-3">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-stone-600">Monthly cost</span>
                <span className="font-medium text-stone-900">
                  ${monthlyTotal}
                </span>
              </div>

              <div className="mt-2 flex justify-between gap-3 text-sm">
                <span className="text-stone-600">Rental duration</span>
                <span className="font-medium text-stone-900">
                  {rentalMonths}{" "}
                  {rentalMonths === 1 ? "month" : "months"}
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

      <p className="mt-3 text-[10px] leading-4 text-stone-500">
        Illustrative prototype pricing. Final rental prices,
        availability, and terms must be confirmed by Monis.
      </p>
    </section>
  );
}
