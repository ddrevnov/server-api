import express from 'express';
import validate from 'express-validation';
import paramValidation from '../../config/param-validation';
import todoCtrl from '../controllers/todo.controller';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/todos - return array of todos */
router.route('/')
  .get(todoCtrl.getTodos);

/** GET /api/todos/:id - return todo object */
router.route('/:id')
  .get(todoCtrl.getTodoById);

/** POST /api/todos- save todo */
router.route('/')
  .post(validate(paramValidation.createTodo), todoCtrl.create);


router.route('/:todoId')

    /** PUT /api/todos- update todo */
  .put(validate(paramValidation.updateTodo), todoCtrl.update)

  /** DELETE /api/todos/:todoId - Delete todo */
  .delete(todoCtrl.remove);

/** Load todo when API with todoId route parameter is hit */
router.param('todoId', todoCtrl.load);

export default router;
