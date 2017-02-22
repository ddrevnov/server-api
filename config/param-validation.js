import Joi from 'joi';

export default {
  // POST /api/users
  createUser: {
    body: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }
  },

  // UPDATE /api/users/:userId
  updateUser: {
    body: {
      email: Joi.string().email(),
      password: Joi.string(),
      providers: Joi.array(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    },
    params: {
      userId: Joi.string().hex().required()
    }
  },

  // POST /api/auth/login
  login: {
    body: {
      email: Joi.string().email(),
      password: Joi.string(),
      providers: Joi.array(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    }
  },

  // POST /api/todos
  createTodo: {
    text: Joi.string().required(),
    completed: Joi.boolean().required()
  },

  // UPDATE /api/todos/:id
  updateTodo: {
    body: {
      text: Joi.string().required(),
      completed: Joi.boolean().required()
    },
    params: {
      todoId: Joi.string().hex().required()
    }
  },
};
