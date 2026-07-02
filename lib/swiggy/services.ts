import "server-only";
import { callSwiggyMcpTool, hasSwiggyMcpConfig } from "@/lib/swiggy/mcp-client";
import {
  mockGetFoodMenu,
  mockSearchDineout,
  mockSearchInstamartItem,
} from "@/lib/swiggy/mock-services";
import type { InstamartProduct } from "@/types/cart";
import type { DeliveryAddress } from "@/contexts/cart-context";
import type { McpStatus } from "@/lib/swiggy/types";

export function getMcpStatus(): McpStatus {
  const mockEnabled = process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false";
  const configured = hasSwiggyMcpConfig();

  return {
    mode: configured && !mockEnabled ? "real" : "mock",
    mockEnabled,
    food: process.env.SWIGGY_MCP_FOOD_URL ? "configured" : "missing_env",
    instamart: process.env.SWIGGY_MCP_IM_URL ? "configured" : "missing_env",
    dineout: process.env.SWIGGY_MCP_DINEOUT_URL ? "configured" : "missing_env",
    authorized: false,
    user: null,
  };
}

export function getMcpStatusForToken(
  hasAccessToken: boolean,
  user: McpStatus["user"] = null,
): McpStatus {
  const status = getMcpStatus();

  return {
    ...status,
    authorized: hasAccessToken,
    mode: hasSwiggyMcpConfig() && hasAccessToken ? "real" : "mock",
    user,
  };
}

export async function searchInstamartItem(query: string) {
  if (hasSwiggyMcpConfig()) {
    try {
      return await callSwiggyMcpTool<InstamartProduct[]>(
        "instamart",
        "searchInstamartItem",
        {
          query,
        },
      );
    } catch {
      return mockSearchInstamartItem(query);
    }
  }

  return mockSearchInstamartItem(query);
}

export async function searchInstamartItemWithMode(query: string): Promise<{
  products: InstamartProduct[];
  mode: "real" | "mock";
}> {
  if (hasSwiggyMcpConfig()) {
    try {
      const addressId = await getFirstInstamartAddressId();
      const raw = await callSwiggyMcpTool<unknown>("instamart", "search_products", {
        addressId,
        query,
        offset: 0,
      });
      const products = mapInstamartProducts(raw);

      if (!products.length) {
        throw new Error("Swiggy MCP search returned an unsupported shape.");
      }

      return { products, mode: "real" };
    } catch {
      return { products: await mockSearchInstamartItem(query), mode: "mock" };
    }
  }

  return { products: await mockSearchInstamartItem(query), mode: "mock" };
}

async function getFirstInstamartAddressId() {
  const raw = await callSwiggyMcpTool<unknown>("instamart", "get_addresses", {});
  const addresses = getByPath(raw, ["result", "structuredContent", "addresses"]);

  if (!Array.isArray(addresses) || !addresses.length) {
    throw new Error("No saved Instamart address is available for search.");
  }

  const id = (addresses[0] as { id?: unknown }).id;
  if (typeof id !== "string") {
    throw new Error("Instamart address response did not include an id.");
  }

  return id;
}

function mapInstamartProducts(raw: unknown): InstamartProduct[] {
  const products = getByPath(raw, ["result", "structuredContent", "products"]);
  if (!Array.isArray(products)) {
    return [];
  }

  return products.flatMap((product) => {
    if (!product || typeof product !== "object") {
      return [];
    }

    const productRecord = product as Record<string, unknown>;
    const variations = Array.isArray(productRecord.variations)
      ? productRecord.variations
      : [];

    return variations.flatMap((variation) => {
      if (!variation || typeof variation !== "object") {
        return [];
      }

      const variationRecord = variation as Record<string, unknown>;
      const displaySize = getString(variationRecord.quantityDescription);
      const parsedSize = parsePackSize(displaySize);

      if (!parsedSize) {
        return [];
      }

      const price = normalizeInstamartPrice(
        getNumber(
        (variationRecord.price as { offerPrice?: unknown } | undefined)?.offerPrice,
        ),
      );
      const id = getString(variationRecord.spinId) || getString(productRecord.productId);
      const name =
        getString(variationRecord.displayName) ||
        getString(productRecord.displayName) ||
        querySafeName(productRecord);

      if (!id || !name || price <= 0) {
        return [];
      }

      return [
        {
          id,
          name,
          packSize: parsedSize.packSize,
          unit: parsedSize.unit,
          displaySize,
          price,
          image: getString(variationRecord.imageUrl),
          available:
            variationRecord.isInStockAndAvailable === true ||
            productRecord.inStock === true ||
            productRecord.isAvail === true,
        },
      ];
    });
  });
}

function parsePackSize(displaySize: string) {
  const packOfMatch = displaySize.match(/pack\s+of\s+(\d+)/i);
  if (packOfMatch) {
    return { packSize: Number(packOfMatch[1]), unit: "piece" };
  }

  const match = displaySize.match(/^([\d.]+)\s*([a-zA-Z]+)(?:\s*x\s*(\d+))?/);
  if (!match) {
    return null;
  }

  const multiplier = match[3] ? Number(match[3]) : 1;
  const quantity = Number(match[1]) * multiplier;
  const rawUnit = match[2].toLowerCase();
  if (!Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(multiplier)) {
    return null;
  }

  if (rawUnit === "kg") {
    return { packSize: quantity * 1000, unit: "g" };
  }

  if (rawUnit === "g" || rawUnit === "gm" || rawUnit === "grams") {
    return { packSize: quantity, unit: "g" };
  }

  if (rawUnit === "l" || rawUnit === "litre" || rawUnit === "liter") {
    return { packSize: quantity, unit: "l" };
  }

  if (rawUnit === "ml") {
    return { packSize: quantity, unit: "ml" };
  }

  if (rawUnit === "piece" || rawUnit === "pieces" || rawUnit === "pc" || rawUnit === "pcs") {
    return { packSize: quantity, unit: "piece" };
  }

  return null;
}

function getByPath(value: unknown, path: string[]) {
  return path.reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object") {
      return undefined;
    }

    return (current as Record<string, unknown>)[segment];
  }, value);
}

function getString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getNumber(value: unknown) {
  return typeof value === "number" ? value : 0;
}

function normalizeInstamartPrice(price: number) {
  if (!Number.isFinite(price) || price <= 0) {
    return 0;
  }

  return Math.round(price);
}

function querySafeName(product: Record<string, unknown>) {
  return getString(product.brand) || "Instamart product";
}

export async function getFoodMenu(query: string) {
  if (hasSwiggyMcpConfig()) {
    try {
      return await callSwiggyMcpTool("food", "getFoodMenu", { query });
    } catch {
      return mockGetFoodMenu();
    }
  }

  return mockGetFoodMenu();
}

export async function searchDineout(query: string) {
  if (hasSwiggyMcpConfig()) {
    try {
      return await callSwiggyMcpTool("dineout", "searchDineout", { query });
    } catch {
      return mockSearchDineout();
    }
  }

  return mockSearchDineout();
}

export async function getInstamartAddresses(): Promise<DeliveryAddress[]> {
  const raw = await callSwiggyMcpTool<unknown>("instamart", "get_addresses", {});
  const addresses = getByPath(raw, ["result", "structuredContent", "addresses"]);

  if (!Array.isArray(addresses)) {
    return [];
  }

  return addresses.flatMap((address) => {
    if (!address || typeof address !== "object") {
      return [];
    }

    const record = address as Record<string, unknown>;
    const id = getString(record.id);
    const addressLine = getString(record.addressLine);

    if (!id || !addressLine) {
      return [];
    }

    return [
      {
        id,
        addressLine,
        phoneNumber: getString(record.phoneNumber),
        addressCategory: getString(record.addressCategory),
        addressTag: getString(record.addressTag),
      },
    ];
  });
}
