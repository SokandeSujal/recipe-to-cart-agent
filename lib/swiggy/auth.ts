import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { NextResponse } from "next/server";
import { getSwiggyMcpEndpoint } from "@/lib/swiggy/mcp-client";

export type SwiggyServerKey = "food" | "instamart" | "dineout";

const validServers = new Set(["food", "instamart", "dineout"]);

export function isSwiggyServerKey(value: string): value is SwiggyServerKey {
  return validServers.has(value);
}

export async function createAuthorizationRedirectAsync(request: Request, server: string) {
  if (!isSwiggyServerKey(server)) {
    return Response.json({ error: "Unknown Swiggy MCP server." }, { status: 400 });
  }

  const endpoint = getSwiggyMcpEndpoint(server);
  const redirectUri = process.env.SWIGGY_MCP_REDIRECT_URI;

  if (!endpoint || !redirectUri) {
    return Response.json(
      {
        error:
          "Swiggy MCP OAuth is in mock mode because endpoint or redirect URI is missing.",
      },
      { status: 501 },
    );
  }

  const clientId = await getClientId(redirectUri);
  const verifier = createPkceVerifier();
  const challenge = createPkceChallenge(verifier);
  const state = `${server}:${crypto.randomUUID()}`;
  const authUrl = new URL("https://mcp.swiggy.com/auth/authorize");
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("scope", "mcp:tools mcp:resources mcp:prompts");

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("swiggy_mcp_state", state, { httpOnly: true, sameSite: "lax" });
  response.cookies.set("swiggy_mcp_verifier", verifier, { httpOnly: true, sameSite: "lax" });
  response.cookies.set("swiggy_mcp_client_id", clientId, { httpOnly: true, sameSite: "lax" });
  response.cookies.set("swiggy_mcp_origin", new URL(request.url).origin, {
    httpOnly: true,
    sameSite: "lax",
  });
  return response;
}

export async function handleAuthorizationCallback(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return Response.json({ error: "Missing OAuth code or state." }, { status: 400 });
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((part) => {
      const [key, ...value] = part.trim().split("=");
      return [key, decodeURIComponent(value.join("="))];
    }),
  );
  const clientId = cookies.swiggy_mcp_client_id || process.env.SWIGGY_MCP_CLIENT_ID;
  const verifier = cookies.swiggy_mcp_verifier;
  const expectedState = cookies.swiggy_mcp_state;
  const redirectUri = process.env.SWIGGY_MCP_REDIRECT_URI;

  if (!clientId || !verifier || !redirectUri || expectedState !== state) {
    return Response.json(
      { error: "OAuth callback state or PKCE verifier is missing." },
      { status: 400 },
    );
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: clientId,
    code_verifier: verifier,
  });

  const tokenResponse = await fetch("https://mcp.swiggy.com/auth/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!tokenResponse.ok) {
    return Response.json(
      { error: `Swiggy token exchange failed with ${tokenResponse.status}.` },
      { status: 502 },
    );
  }

  const token = (await tokenResponse.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };

  const response = NextResponse.redirect(new URL("/?swiggy=connected", request.url));
  response.cookies.set("swiggy_mcp_access_token", token.access_token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: token.expires_in || 3600,
  });
  if (token.refresh_token) {
    response.cookies.set("swiggy_mcp_refresh_token", token.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}

function createPkceVerifier() {
  return randomBytes(32)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function createPkceChallenge(verifier: string) {
  return createHash("sha256")
    .update(verifier)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getClientId(redirectUri: string) {
  if (process.env.SWIGGY_MCP_CLIENT_ID) {
    return process.env.SWIGGY_MCP_CLIENT_ID;
  }

  const registrationPath = ".swiggy-mcp-registration.local.json";
  if (existsSync(registrationPath)) {
    const cached = JSON.parse(readFileSync(registrationPath, "utf8")) as {
      client_id?: string;
    };
    if (cached.client_id) {
      return cached.client_id;
    }
  }

  const registrationResponse = await fetch("https://mcp.swiggy.com/auth/register", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      client_name: "RecipeCart Local Dev",
      redirect_uris: [redirectUri],
      grant_types: ["authorization_code", "refresh_token"],
      response_types: ["code"],
      token_endpoint_auth_method: "none",
      scope: "mcp:tools mcp:resources mcp:prompts",
    }),
  });

  if (!registrationResponse.ok) {
    throw new Error(`Swiggy dynamic registration failed with ${registrationResponse.status}.`);
  }

  const registration = (await registrationResponse.json()) as { client_id: string };
  writeFileSync(registrationPath, JSON.stringify(registration, null, 2));
  return registration.client_id;
}
