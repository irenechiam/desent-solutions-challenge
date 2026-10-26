
export type DeskId = "oak" | "white";
export type ChairId = "sage" | "black";
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
    name: "Oak Studio Desk",
    description: "Warm oak finish",
    pricePerMonth: 45,
  },
  {
    id: "white",
    name: "Minimal White Desk",
    description: "Clean, contemporary finish",
    pricePerMonth: 40,
  },
];

export const chairs: Product[] = [
  {
    id: "sage",
    name: "Sage Task Chair",
    description: "Soft sage upholstery",
    pricePerMonth: 25,
  },
  {
    id: "black",
    name: "Graphite Task Chair",
    description: "Modern dark finish",
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
