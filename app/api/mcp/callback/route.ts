export async function GET() {
  return Response.json(
    {
      error: "Swiggy MCP OAuth callback is not implemented until Stage 4.",
    },
    { status: 501 },
  );
}
