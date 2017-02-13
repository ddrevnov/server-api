import express from 'express';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import todoRoutes from './todo.route';
import chatRoutes from './chat.route';

const router = express.Router(); // eslint-disable-line new-cap

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/todos', todoRoutes);
router.use('/chat', chatRoutes);

export default router;
