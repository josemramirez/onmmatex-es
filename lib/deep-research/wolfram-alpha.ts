// lib/deep-research/wolfram-alpha.ts
export async function fetchWolframAlpha({
  query,
  appId,
}: {
  query: string;
  appId: string;
}) {
  if (!query) {
    throw new Error("Query parameter is required");
  }

  const url = `http://api.wolframalpha.com/v2/query?appid=${appId}&input=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const xmlData = await response.text(); // Obtener el XML como texto
    return {
      result: xmlData,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching Wolfram Alpha API:", error);
    return {
      result: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
