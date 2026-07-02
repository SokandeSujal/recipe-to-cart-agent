export async function GET() {
  return Response.json({
    mode: "mock",
    food: "not_configured",
    instamart: "not_configured",
    dineout: "not_configured",
  });
}
