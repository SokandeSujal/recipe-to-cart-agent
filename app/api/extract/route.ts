import { extractRecipeWithGemini } from "@/lib/gemini/client";
import { isNonEmptyText } from "@/lib/utils/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { recipeText?: string };
    const recipeText = body.recipeText ?? "";

    if (!isNonEmptyText(recipeText)) {
      return Response.json(
        { error: "Paste a recipe before extracting ingredients." },
        { status: 400 },
      );
    }

    if (recipeText.trim().length < 20) {
      return Response.json(
        { error: "Add a little more recipe detail so ingredients can be extracted." },
        { status: 400 },
      );
    }

    const result = await extractRecipeWithGemini(recipeText);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Ingredient extraction failed.",
      },
      { status: 500 },
    );
  }
}
