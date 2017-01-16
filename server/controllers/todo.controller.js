import Todo from '../models/todo.model';

function load(req, res, next, id) {
  Todo.get(id)
    .then(todo => {
      req.todo = todo; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

function getTodos(req, res, next) {
  Todo.get()
    .then(todos => res.json(todos))
    .catch(err => next(err));
}

function getTodoById(req, res, next) {
  Todo.getById(req.params.id)
    .then(todo => res.json(todo))
    .catch(err => next(err));
}

function create(req, res, next) {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
  });

  todo.save()
    .then(todo => res.json(todo))
    .catch(err => next(err));
}

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

function remove(req, res, next) {
  const todo = req.todo;

  todo.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { getTodos, getTodoById, create, update, load, remove };
