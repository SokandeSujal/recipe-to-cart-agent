export async function GET(
  _request: Request,
  { params }: { params: Promise<{ server: string }> },
) {
  const { server } = await params;

  return Response.json(
    {
      server,
      error: "Swiggy MCP OAuth is not implemented until Stage 4.",
    },
    { status: 501 },
  );
}
