export async function POST() {
  return Response.json(
    {
      error: "Recipe-to-cart mapping is not implemented until Stage 5.",
    },
    { status: 501 },
  );
}
