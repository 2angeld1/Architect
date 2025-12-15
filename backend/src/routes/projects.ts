import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// GET /api/projects - Obtener todos los proyectos
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: projects,
      total: projects.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Obtener un proyecto por ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw createError('Proyecto no encontrado', 404);
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/category/:category - Obtener proyectos por categoría
router.get('/category/:category', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;

    const projects = await prisma.project.findMany({
      where: { 
        category: category as any,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: projects,
      total: projects.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
