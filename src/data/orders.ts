import { products } from "./products";

export interface MockOrder {
  id: string;
  date: string;
  status: "En préparation" | "Expédiée" | "Livrée" | "Annulée";
  total: number;
  items: { productId: string; quantity: number }[];
}

export const mockOrders: MockOrder[] = [
  {
    id: "CMD-100234",
    date: "2026-08-05",
    status: "Livrée",
    total: 129.98,
    items: [
      { productId: products[0]?.id, quantity: 1 },
      { productId: products[5]?.id, quantity: 1 },
    ],
  },
  {
    id: "CMD-100198",
    date: "2026-07-22",
    status: "Expédiée",
    total: 59.9,
    items: [{ productId: products[10]?.id, quantity: 1 }],
  },
  {
    id: "CMD-100120",
    date: "2026-06-30",
    status: "Annulée",
    total: 34.5,
    items: [{ productId: products[20]?.id, quantity: 1 }],
  },
];
