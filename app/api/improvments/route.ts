import { NextRequest } from "next/server";

import {
  writeImprovedReport,
} from "@/lib/deep-research/improvments";
import { createModel, type AIModel } from "@/lib/deep-research/ai/providers";

export async function POST(req: NextRequest) {
  try {
    const {
      query,
      breadth = 1,
      depth = 1,
      modelId = "gpt-4o-mini",
    } = await req.json();

    // Retrieve API keys from secure cookies
    const openaiKey = req.cookies.get("openai-key")?.value;

    // Add API key validation
    if (process.env.NEXT_PUBLIC_ENABLE_API_KEYS === "true") {
      if (!openaiKey) {
        return Response.json(
          { error: "API keys are required but not provided" },
          { status: 401 }
        );
      }
    }

    console.log("\n🔬 [IMPROVEMENT ROUTE] === IMPROVEMENT Started ===");
    //console.log("Query:", query);
    console.log("Model ID:", modelId);
    console.log("Configuration:", {
      breadth,
      depth,
    });
    console.log("API Keys Present:", {
      OpenAI: openaiKey ? "✅" : "❌"
    });

    try {
      const model = createModel(modelId as AIModel, openaiKey);
      console.log("\n🤖 [IMPROVEMENT ROUTE] === Model Created ===");
      console.log("Using Model:", modelId);

      const encoder = new TextEncoder();
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();

      (async () => {
        try {
          console.log("\n🚀 [IMPROVEMENT ROUTE] === IMPROVEMENT Started ===");

          const report = await writeImprovedReport({
            prompt: query,
            model,
          });

          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "result",
                report,
              })}\n\n`
            )
          );


	  console.log("Tokens en Improvements ============================");
	  // { promptTokens, completionTokens, totalTokens }
	  console.log(report.tokens);

	  console.log("Hola 2 ============================");
	  // { promptTokens, completionTokens, totalTokens }
	  //console.log(report.report);
	  


        } catch (error) {
          console.error("\n❌ [IMPROVEMENT ROUTE] === IMPROVEMENT Process Error ===");
          console.error("Error:", error);
          await writer.write(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                message: "IMPROVEMENT failed",
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
    } catch (error) {
      console.error("\n💥 [IMPROVEMENT ROUTE] === Route Error ===");
      console.error("Error:", error);
      return Response.json({ error: "Research failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("\n💥 [IMPROVEMENT ROUTE] === Parse Error ===");
    console.error("Error:", error);
    return Response.json({ error: "Research failed" }, { status: 500 });
  }
}
