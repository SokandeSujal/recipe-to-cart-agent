export async function POST() {
  return Response.json(
    {
      error: "YouTube ingestion is not implemented until Stage 7.",
    },
    { status: 501 },
  );
}
