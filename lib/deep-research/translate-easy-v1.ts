import { generateObject } from 'ai';
import { z } from 'zod';
import { createModel } from './ai/providers';
import { systemPromptToTranslate } from './prompt_to_translate';



export async function translateEasyFunction({
  prompt,
  model,
}: {
  prompt: string;
  model: ReturnType<typeof createModel>;
}) {

  const res = await generateObject({
    model,
    system: systemPromptToTranslate(),
    prompt: `Given the following request, translate the text to English. 
    \n\n<prompt>${prompt}</prompt>\n\n`,
    schema: z.object({
      reportMarkdown: z
        .string()
        .describe('Translation to English'),
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
}
