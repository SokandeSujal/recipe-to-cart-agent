import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  for (const name of [
    "swiggy_mcp_access_token",
    "swiggy_mcp_refresh_token",
    "swiggy_mcp_state",
    "swiggy_mcp_verifier",
    "swiggy_mcp_client_id",
    "swiggy_mcp_origin",
  ]) {
    response.cookies.set(name, "", {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
  }

  return response;
}
