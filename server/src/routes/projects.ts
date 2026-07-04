import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  listProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  updateProjectOrder,
} from '../controllers/projects';

const router = Router();

router.get('/', listProjects);
router.get('/:id', getProject);
router.post('/', authMiddleware, createProject);
router.put('/order', authMiddleware, updateProjectOrder);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

export default router;
