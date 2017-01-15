import Todo from '../models/todo.model';

function getTodos(req, res, next) {
  Todo.get()
    .then(todos => res.json(todos))
    .catch(err => next(err));
}

export default { getTodos };
