import { generateObject } from 'ai';
import { z } from 'zod';
import { createModel, type AIModel } from './ai/providers';
import { systemPrompt } from './prompt';

export async function generateFeedback({
  query,
  numQuestions = 3,
  modelId = 'gpt-4o-mini',
  apiKey,
}: {
  query: string;
  numQuestions?: number;
  modelId?: AIModel;
  apiKey?: string;
}) {
  const model = createModel(modelId, apiKey);

  const userFeedback = await generateObject({
    model,
    system: systemPrompt(),
    prompt: `Given the following query from the user, ask some follow up questions to clarify the research direction. Return a maximum of ${numQuestions} questions, but feel free to return less if the original query is clear: <query>${query}</query>
    . Realiza las preguntas en el idioma del usuario.`,
    schema: z.object({
      questions: z
        .array(z.string())
        .describe(
          `Follow up questions to clarify the research direction, max of ${numQuestions}`,
        ),
    }),
  });

  // Extraer datos de uso (si están disponibles)
  const usage = userFeedback.usage || {};
  const promptTokens = usage.promptTokens || 'No disponible';
  const completionTokens = usage.completionTokens || 'No disponible';
  const totalTokens = usage.totalTokens || 'No disponible';

  // Devolver el reporte y los tokens
  return {
    questions: userFeedback.object.questions.slice(0, numQuestions),
    tokens: {
      promptTokens,
      completionTokens,
      totalTokens,
    },
  };
}