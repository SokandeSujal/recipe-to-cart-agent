import type { InstamartProduct } from "@/types/cart";

export const mockServiceMode = "mock";

const products: Record<string, InstamartProduct[]> = {
  milk: [
    {
      id: "mock-milk-1l",
      name: "Amul Taaza Milk",
      packSize: 1,
      unit: "l",
      displaySize: "1 L",
      price: 64,
      available: true,
      image:
        "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=120&q=80",
    },
  ],
  bread: [
    {
      id: "mock-bread-500",
      name: "Britannia Brown Bread",
      packSize: 20,
      unit: "piece",
      displaySize: "20 slices",
      price: 45,
      available: true,
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=120&q=80",
    },
  ],
  eggs: [
    {
      id: "mock-eggs-6",
      name: "Farm Fresh Eggs",
      packSize: 6,
      unit: "piece",
      displaySize: "Pack of 6",
      price: 54,
      available: true,
      image:
        "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=120&q=80",
    },
  ],
  butter: [
    {
      id: "mock-butter-100",
      name: "Amul Butter",
      packSize: 100,
      unit: "g",
      displaySize: "100 g",
      price: 58,
      available: true,
      image:
        "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=120&q=80",
    },
  ],
  garlic: [
    {
      id: "mock-garlic-100",
      name: "Fresh Garlic",
      packSize: 100,
      unit: "g",
      displaySize: "100 g",
      price: 35,
      available: true,
    },
  ],
  cheese: [
    {
      id: "mock-cheese-100",
      name: "Amul Cheese Slices",
      packSize: 100,
      unit: "g",
      displaySize: "100 g",
      price: 72,
      available: true,
    },
  ],
  capsicum: [
    {
      id: "mock-capsicum-1",
      name: "Green Capsicum",
      packSize: 1,
      unit: "piece",
      displaySize: "1 piece",
      price: 28,
      available: true,
    },
  ],
  "red bell pepper": [
    {
      id: "mock-red-bell-pepper-1",
      name: "Red Bell Pepper",
      packSize: 1,
      unit: "piece",
      displaySize: "1 piece",
      price: 45,
      available: true,
    },
  ],
  pepper: [
    {
      id: "mock-red-pepper-1",
      name: "Red Bell Pepper",
      packSize: 1,
      unit: "piece",
      displaySize: "1 piece",
      price: 45,
      available: true,
    },
  ],
  onion: [
    {
      id: "mock-onion-500",
      name: "Fresh Onion",
      packSize: 500,
      unit: "g",
      displaySize: "500 g",
      price: 32,
      available: true,
    },
  ],
  coriander: [
    {
      id: "mock-coriander-1",
      name: "Fresh Coriander",
      packSize: 1,
      unit: "piece",
      displaySize: "1 bunch",
      price: 15,
      available: true,
    },
  ],
  chilli: [
    {
      id: "mock-chilli-100",
      name: "Green Chilli",
      packSize: 100,
      unit: "g",
      displaySize: "100 g",
      price: 20,
      available: true,
    },
  ],
  "red chilli powder": [
    {
      id: "mock-red-chilli-powder-100",
      name: "Red Chilli Powder",
      packSize: 100,
      unit: "g",
      displaySize: "100 g",
      price: 35,
      available: true,
    },
  ],
  carrot: [
    {
      id: "mock-carrot-500",
      name: "Fresh Carrot",
      packSize: 500,
      unit: "g",
      displaySize: "500 g",
      price: 35,
      available: true,
    },
  ],
  salt: [
    {
      id: "mock-salt-1000",
      name: "Tata Salt",
      packSize: 1000,
      unit: "g",
      displaySize: "1 kg",
      price: 28,
      available: true,
    },
  ],
  flour: [
    {
      id: "mock-atta-1000",
      name: "Aashirvaad Atta",
      packSize: 1000,
      unit: "g",
      displaySize: "1 kg",
      price: 72,
      available: true,
    },
    {
      id: "mock-atta-5000",
      name: "Aashirvaad Atta",
      packSize: 5000,
      unit: "g",
      displaySize: "5 kg",
      price: 299,
      available: true,
    },
  ],
  sugar: [
    {
      id: "mock-sugar-1000",
      name: "Madhur Sugar",
      packSize: 1000,
      unit: "g",
      displaySize: "1 kg",
      price: 58,
      available: true,
    },
  ],
};

export async function mockSearchInstamartItem(query: string) {
  const normalized = query.toLowerCase();
  const key = Object.keys(products)
    .sort((a, b) => b.length - a.length)
    .find((candidate) => normalized.includes(candidate));
  return products[key || "flour"];
}

export async function mockGetFoodMenu() {
  return { restaurants: [], mode: "mock" };
}

export async function mockSearchDineout() {
  return { venues: [], mode: "mock", bookingType: "free_only" };
}
