
export type DeskId = "oak" | "white";
export type ChairId = "taupe" | "black";
export type AccessoryId = "monitor" | "plant";

export type Product = {
  id: string;
  name: string;
  description: string;
  pricePerMonth: number;
};

export const desks: Product[] = [
  {
    id: "oak",
    name: "Natural Oak Desk",
    description:
      "A warm, light oak finish that brings a natural feel to your workspace.",
    pricePerMonth: 45,
  },
  {
    id: "white",
    name: "Warm White Desk",
    description:
      "A soft off-white finish for a bright, clean, minimalist workspace.",
    pricePerMonth: 40,
  },
];

export const chairs: Product[] = [
  {
    id: "taupe",
    name: "Warm Taupe Ergonomic Chair",
    description:
      "A warm, earthy grey-brown finish that brings a subtle, refined feel to your workspace.",
    pricePerMonth: 25,
  },
  {
    id: "black",
    name: "Graphite Grey Chair",
    description:
      "A versatile mid-grey finish with a modern, understated look.",
    pricePerMonth: 30,
  },
];

export const accessories: Product[] = [
  {
    id: "monitor",
    name: "Monitor",
    description: "A dedicated screen for focused work",
    pricePerMonth: 15,
  },
  {
    id: "plant",
    name: "Desk Plant",
    description: "A little greenery for your setup",
    pricePerMonth: 5,
  },
];
