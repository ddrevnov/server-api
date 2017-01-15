import express from 'express';
import todoCtrl from '../controllers/todo.controller';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/todos - return array of todos */
router.route('/')
  .get(todoCtrl.getTodos);


export default router;
