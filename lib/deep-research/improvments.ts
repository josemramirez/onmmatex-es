import { generateObject } from 'ai';
import { compact } from 'lodash-es';
import { z } from 'zod';
import { createModel, trimPrompt } from './ai/providers';
import { systemPrompt } from './prompt';



export async function writeImprovedReport({
  prompt,
  model,
}: {
  prompt: string;
  model: ReturnType<typeof createModel>;
}) {

  const res = await generateObject({
    model,
    system: systemPrompt(),
    prompt: `Given the following already created document from the user, work out the parts instructed by the user, touching nothing else from the document. Write down these improvements and format it in proper LaTeX. Use LaTeX syntax (headings, formulas, lists, horizontal rules, etc.) to structure the document. \n\n<prompt>${prompt}</prompt>\n\n`,
    schema: z.object({
      reportMarkdown: z
        .string()
        .describe('Improvements on the report on the topic in LaTeX'),
    }),
  });


  // Extraer datos de uso (si están disponibles)
  const usage = res.usage || {};
  const promptTokens = usage.promptTokens || 'No disponible';
  const completionTokens = usage.completionTokens || 'No disponible';
  const totalTokens = usage.totalTokens || 'No disponible';

  // Devolver el reporte y los tokens
  return {
    report: res.object.reportMarkdown,
    tokens: {
      promptTokens,
      completionTokens,
      totalTokens,
    },
  };
  // Return improvements
  // return `${res.object.reportMarkdown}`;
}
