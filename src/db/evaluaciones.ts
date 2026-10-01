import { db } from './index.ts';
import { evaluaciones } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export interface EvaluacionInput {
  anonymousId: string;
  userId?: string;
  score: number;
  riskLevel: string;
  factors: string[];
  answers: Record<string, number>;
}

export async function createEvaluacion(data: EvaluacionInput) {
  try {
    const result = await db.insert(evaluaciones)
      .values({
        anonymousId: data.anonymousId,
        userId: data.userId || null,
        score: data.score,
        riskLevel: data.riskLevel,
        factors: JSON.stringify(data.factors),
        answers: JSON.stringify(data.answers),
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error inserting evaluacion:', error);
    throw new Error('Failed to save assessment.', { cause: error });
  }
}

export async function getEvaluaciones(anonymousId?: string, userId?: string) {
  try {
    if (userId) {
      return await db.select()
        .from(evaluaciones)
        .where(eq(evaluaciones.userId, userId))
        .orderBy(desc(evaluaciones.createdAt));
    }
    if (anonymousId) {
      return await db.select()
        .from(evaluaciones)
        .where(eq(evaluaciones.anonymousId, anonymousId))
        .orderBy(desc(evaluaciones.createdAt));
    }
    return [];
  } catch (error) {
    console.error('Error fetching evaluaciones:', error);
    throw new Error('Failed to fetch assessments.', { cause: error });
  }
}

export async function purgeEvaluaciones(anonymousId: string) {
  try {
    await db.delete(evaluaciones)
      .where(eq(evaluaciones.anonymousId, anonymousId));
    return { success: true, message: 'All assessment records purged successfully' };
  } catch (error) {
    console.error('Error purging evaluaciones:', error);
    throw new Error('Failed to purge assessments.', { cause: error });
  }
}
