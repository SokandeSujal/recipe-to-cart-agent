import { handleAuthorizationCallback } from "@/lib/swiggy/auth";

export async function GET(request: Request) {
  return handleAuthorizationCallback(request);
}
