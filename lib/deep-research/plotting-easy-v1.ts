import { generateObject } from 'ai';
import { z } from 'zod';
import { createModel } from './ai/providers';
import { systemPromptToPlot } from './prompt_to_plot';



export async function writePlottingFunction({
  prompt,
  model,
}: {
  prompt: string;
  model: ReturnType<typeof createModel>;
}) {

  const res = await generateObject({
    model,
    system: systemPromptToPlot(),
    prompt: `Given the following request about a mathematical function,
    or array of data points to be produced 
    from the user, work out the parts instructed by the user. 
    Write down the points and format it in proper JSON format. 
    Use JSON syntax ([] for the whole array, {} por each point, "key":"value" etc.) 
    to structure the data array. \n\n<prompt>${prompt}</prompt>\n\n`,
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
}
