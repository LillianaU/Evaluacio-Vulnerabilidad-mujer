import { AssessmentResult } from '../types';
import { auth } from '../lib/firebase';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export async function saveAssessmentToDatabase(
  assessment: AssessmentResult,
  answers: Record<string, number>
) {
  const payload = {
    anonymousId: assessment.anonymousId || 'uuid-v4-anonimo-89f2',
    score: assessment.score,
    riskLevel: assessment.riskLevel,
    factors: assessment.factors,
    answers,
  };

  // 1. If user configured external Supabase, insert to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('evaluaciones').insert([
        {
          anonymous_id: payload.anonymousId,
          score: payload.score,
          risk_level: payload.riskLevel,
          factors: payload.factors,
          answers: payload.answers,
        },
      ]);
      if (error) {
        console.warn('Supabase insert warning:', error);
      } else {
        console.log('Saved to Supabase:', data);
      }
    } catch (e) {
      console.warn('Supabase connection error:', e);
    }
  }

  // 2. Insert to native PostgreSQL database via backend endpoint
  try {
    let token: string | undefined;
    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch('/api/evaluaciones', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn('Database save warning (operating in local fallback):', error);
    return null;
  }
}

export async function purgeAssessmentFromDatabase(anonymousId: string) {
  // 1. Purge from Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('evaluaciones').delete().eq('anonymous_id', anonymousId);
    } catch (e) {
      console.warn('Supabase purge error:', e);
    }
  }

  // 2. Purge from PostgreSQL database
  try {
    const response = await fetch('/api/evaluaciones/purge', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ anonymousId }),
    });

    return await response.json();
  } catch (error) {
    console.warn('Database purge warning:', error);
    return null;
  }
}

export async function checkDatabaseHealth() {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}
