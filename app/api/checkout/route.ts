export async function POST() {
  return Response.json(
    {
      error:
        "Checkout is not implemented until Stage 6 and will require explicit confirmation.",
    },
    { status: 501 },
  );
}
