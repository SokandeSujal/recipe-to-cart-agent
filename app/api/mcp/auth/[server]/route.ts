import { createAuthorizationRedirectAsync } from "@/lib/swiggy/auth";

export async function GET(request: Request, { params }: { params: Promise<{ server: string }> }) {
  const { server } = await params;
  return createAuthorizationRedirectAsync(request, server);
}
