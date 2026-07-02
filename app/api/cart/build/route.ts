import { buildCartFromRecipe } from "@/lib/cart/build-cart";
import type { ExtractedRecipe } from "@/types/recipe";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      recipe?: ExtractedRecipe;
      servings?: number;
    };

    if (!body.recipe?.ingredients?.length) {
      return Response.json(
        { error: "Extract ingredients before building a cart." },
        { status: 400 },
      );
    }

    const cart = await buildCartFromRecipe(body.recipe, body.servings ?? 1);
    return Response.json({ cart });
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Cart build failed.",
      },
      { status: 500 },
    );
  }
}
