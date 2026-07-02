import "server-only";
import { cookies } from "next/headers";
import type { SwiggyServerKey } from "@/lib/swiggy/auth";

const endpoints: Record<SwiggyServerKey, string | undefined> = {
  food: process.env.SWIGGY_MCP_FOOD_URL,
  instamart: process.env.SWIGGY_MCP_IM_URL,
  dineout: process.env.SWIGGY_MCP_DINEOUT_URL,
};

export function getSwiggyMcpEndpoint(server: SwiggyServerKey) {
  return endpoints[server];
}

export function hasSwiggyMcpConfig() {
  return Boolean(endpoints.food && endpoints.instamart && endpoints.dineout);
}

export async function callSwiggyMcpTool<T>(
  server: SwiggyServerKey,
  toolName: string,
  args: Record<string, unknown>,
): Promise<T> {
  const endpoint = getSwiggyMcpEndpoint(server);
  if (!endpoint) {
    throw new Error(`Missing Swiggy MCP endpoint for ${server}.`);
  }
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("swiggy_mcp_access_token")?.value;

  if (!accessToken) {
    throw new Error("Swiggy MCP is not authorized.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: crypto.randomUUID(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Swiggy MCP ${toolName} failed with ${response.status}.`);
  }

  return (await response.json()) as T;
}

export async function callSwiggyMcpToolRaw(
  server: SwiggyServerKey,
  toolName: string,
  args: Record<string, unknown>,
): Promise<unknown> {
  return callSwiggyMcpTool<unknown>(server, toolName, args);
}
