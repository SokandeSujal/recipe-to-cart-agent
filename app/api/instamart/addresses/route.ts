import { getInstamartAddresses } from "@/lib/swiggy/services";

export async function GET() {
  try {
    return Response.json({
      addresses: await getInstamartAddresses(),
      mode: "real",
    });
  } catch (error) {
    return Response.json(
      {
        addresses: [],
        mode: "mock",
        error:
          error instanceof Error
            ? error.message
            : "Could not load Instamart addresses.",
      },
      { status: 200 },
    );
  }
}
