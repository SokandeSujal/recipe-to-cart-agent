export async function POST() {
  return Response.json(
    {
      error: "Gemini ingredient extraction is not implemented until Stage 3.",
    },
    { status: 501 },
  );
}
