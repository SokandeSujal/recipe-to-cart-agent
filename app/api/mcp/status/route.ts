import { cookies } from "next/headers";
import { getMcpStatusForToken } from "@/lib/swiggy/services";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("swiggy_mcp_access_token")?.value;
  return Response.json(
    getMcpStatusForToken(Boolean(token), token ? getUserFromToken(token) : null),
  );
}

function getUserFromToken(token: string) {
  const payload = decodeJwtPayload(token);
  const label =
    payload.name ||
    payload.phone_number ||
    payload.phone ||
    payload.mobile ||
    payload.email ||
    payload.sub ||
    "Swiggy user";
  const initials = String(label)
    .split(/[^\dA-Za-z]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return {
    label: String(label),
    initials: initials || "S",
  };
}

function decodeJwtPayload(token: string): Record<string, string | undefined> {
  const [, payload] = token.split(".");
  if (!payload) {
    return {};
  }

  try {
    const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
    return JSON.parse(Buffer.from(padded, "base64url").toString("utf8")) as Record<
      string,
      string | undefined
    >;
  } catch {
    return {};
  }
}
