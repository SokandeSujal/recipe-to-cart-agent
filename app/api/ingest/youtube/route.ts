import { fetchTranscript } from "youtube-transcript";
import { extractRecipeWithGemini } from "@/lib/gemini/client";
import { isNonEmptyText } from "@/lib/utils/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string };
    const url = body.url ?? "";

    if (!isNonEmptyText(url)) {
      return Response.json(
        { error: "Paste a YouTube recipe URL first." },
        { status: 400 },
      );
    }

    const transcript = await fetchTranscript(url);
    const transcriptText = transcript
      .map((item) => item.text)
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (transcriptText.length < 100) {
      return Response.json(
        { error: "No usable recipe transcript was found for this video." },
        { status: 400 },
      );
    }

    const result = await extractRecipeWithGemini(
      `Extract only the recipe ingredients and method-relevant grocery items from this YouTube transcript. Do not include non-recipe narration.\n\n${transcriptText}`,
    );

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "YouTube ingestion failed.",
      },
      { status: 500 },
    );
  }
}
