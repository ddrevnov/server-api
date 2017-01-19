import Todo from '../models/todo.model';

/**
 * Load todo and append to req.
 */
function load(req, res, next, id) {
  Todo.get(id)
    .then((todo) => {
      req.todo = todo; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function getTodos(req, res, next) {
  Todo.getTodos()
    .then(todos => res.json(todos))
    .catch(err => next(err));
}

/**
 *
 * @param req
 * @param res
 * @param next
 */
function getTodoById(req, res, next) {
  Todo.getById(req.params.id)
    .then(todo => res.json(todo))
    .catch(err => next(err));
}

/**
 * Create todo
 * @param req
 * @param res
 * @param next
 */
function create(req, res, next) {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
  });

  todo.save()
    .then(todo => res.json(todo))
    .catch(err => next(err));
}

/**
 * Update todo
 * @param req
 * @param res
 * @param next
 */
function update(req, res, next) {
  const todo = req.todo;
  const { text, completed } = req.body;

  if (text) {
    todo.text = text;
  }

  if (completed !== 'undefined') {
    todo.completed = completed;
  }

  todo.save()
    .then(savedTodo => res.json(savedTodo))
    .catch(e => next(e));
}

/**
 * Remove todo
 * @param req
 * @param res
 * @param next
 */
function remove(req, res, next) {
  const todo = req.todo;
  todo.remove()
    .then(deletedTodo => res.json(deletedTodo))
    .catch(e => next(e));
}

export default { getTodos, getTodoById, create, update, remove, load };
