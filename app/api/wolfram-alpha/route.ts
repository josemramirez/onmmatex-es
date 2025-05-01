// app/api/wolfram-alpha/route.ts
import { NextRequest } from "next/server";
import { fetchWolframAlpha } from "@/lib/deep-research/wolfram-alpha";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.toLowerCase();

  const appId = process.env.WOLFRAM_API_KEY || ""; // Asegúrate de que esta variable esté en Fly.io

  if (!appId) {
    return new Response(
      JSON.stringify({ error: "Wolfram Alpha API key is not configured" }),
      { status: 500 }
    );
  }

  console.log("\n🔬 [WOLFRAM-ALPHA ROUTE] === Request Started ===");
  console.log("Query:", query);

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  (async () => {
    try {
      console.log("\n🚀 [WOLFRAM-ALPHA ROUTE] === Fetching Wolfram Alpha ===");
      const wolframResponse = await fetchWolframAlpha({ query: query || "", appId });

      if (wolframResponse.error) {
        throw new Error(wolframResponse.error);
      }

      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "result",
            result: wolframResponse.result,
          })}\n\n`
        )
      );
    } catch (error) {
      console.error("\n❌ [WOLFRAM-ALPHA ROUTE] === Error ===");
      console.error("Error:", error);
      await writer.write(
        encoder.encode(
          `data: ${JSON.stringify({
            type: "error",
            message: error instanceof Error ? error.message : "Wolfram Alpha failed",
          })}\n\n`
        )
      );
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}