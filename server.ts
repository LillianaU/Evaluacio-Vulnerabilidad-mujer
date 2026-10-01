import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { requireAuth, optionalAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { createEvaluacion, getEvaluaciones, purgeEvaluaciones } from './src/db/evaluaciones.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      engine: 'PostgreSQL / Cloud SQL',
      timestamp: new Date().toISOString(),
    });
  });

  // User synchronization endpoint
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.uid || !req.user.email) {
        return res.status(400).json({ error: 'Invalid user token payload' });
      }
      const user = await getOrCreateUser(req.user.uid, req.user.email);
      res.json({ success: true, user });
    } catch (error: any) {
      console.error('Error in /api/auth/sync:', error);
      res.status(500).json({ error: 'Failed to sync user' });
    }
  });

  // Save diagnostic assessment
  app.post('/api/evaluaciones', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const { anonymousId, score, riskLevel, factors, answers } = req.body;

      if (!anonymousId || score === undefined || !riskLevel) {
        return res.status(400).json({ error: 'Missing required assessment fields' });
      }

      const result = await createEvaluacion({
        anonymousId: String(anonymousId),
        userId: req.user?.uid,
        score: Number(score),
        riskLevel: String(riskLevel),
        factors: Array.isArray(factors) ? factors : [],
        answers: typeof answers === 'object' && answers !== null ? answers : {},
      });

      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      console.error('Error in POST /api/evaluaciones:', error);
      res.status(500).json({ error: 'Failed to record assessment' });
    }
  });

  // Retrieve evaluations
  app.get('/api/evaluaciones', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
      const anonymousId = req.query.anonymousId as string | undefined;
      const userId = req.user?.uid;

      if (!anonymousId && !userId) {
        return res.status(400).json({ error: 'Must provide anonymousId or authorization token' });
      }

      const list = await getEvaluaciones(anonymousId, userId);
      res.json({ success: true, data: list });
    } catch (error: any) {
      console.error('Error in GET /api/evaluaciones:', error);
      res.status(500).json({ error: 'Failed to fetch assessment records' });
    }
  });

  // Purge evaluations (Emergency 0-Trace wipe)
  app.delete('/api/evaluaciones/purge', async (req: Request, res: Response) => {
    try {
      const { anonymousId } = req.body;
      if (!anonymousId) {
        return res.status(400).json({ error: 'Missing anonymousId for purge sequence' });
      }

      const result = await purgeEvaluaciones(String(anonymousId));
      res.json(result);
    } catch (error: any) {
      console.error('Error in DELETE /api/evaluaciones/purge:', error);
      res.status(500).json({ error: 'Failed to purge assessment data' });
    }
  });

  // Frontend integration: Vite middleware in development, static in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Vitality Shield server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
