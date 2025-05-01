import { NextRequest, NextResponse } from "next/server";

const PDFendpoints = ["https://latexonline.cc", "https://mmatex.fly.dev"];

const getRandomEndpoint = () => {
  const randomIndex = Math.floor(Math.random() * PDFendpoints.length);
  return PDFendpoints[randomIndex];
};

export async function POST(request: NextRequest) {
  const { content, isOptionOne, userId, typeShort, fileName } = await request.json();

  if (!content || typeof isOptionOne === "undefined" || !userId || !fileName) {
    return NextResponse.json(
      { error: "Faltan parámetros: content, isOptionOne, userId o fileName" },
      { status: 400 }
    );
  }

  const PDFendpoint = getRandomEndpoint();
  const contentL = content.replace(/°/g, "\\textdegree ").replace(/&/g, "and ").replace(/\\textit/g, "\\textbf ");

  const encodedText = encodeURIComponent(contentL);
  let latexUrl;

  try {
    if (isOptionOne && typeShort=="short" ) {
      latexUrl = `${PDFendpoint}/compile?text=${encodedText}`;
    } else {
      const credentialsGitHub = {
        owner: process.env.MMATEX_GITS_OWNER!,
        repo: process.env.MMATEX_GITS_REPO_v1!,
        path: `${userId}/${fileName}`,
        authToken: process.env.MMATEX_GITS_TOKEN!,
      };
      const fileGitHub =
        credentialsGitHub.owner +
        "/" +
        credentialsGitHub.repo +
        "&target=" +
        credentialsGitHub.path +
        "&force=true";
      latexUrl = `${PDFendpoint}/compile?git=https://${credentialsGitHub.authToken}@github.com/${fileGitHub}`;
    }
    return NextResponse.json({ latexUrl });
  } catch (error) {
    console.error("Error generating PDF URL:", error);
    return NextResponse.json({ error: "Error al generar la URL del PDF" }, { status: 500 });
  }
}
