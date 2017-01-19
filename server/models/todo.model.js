import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

/**
 * Todo Schema
 */
const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  completed: { type: Boolean, required: true }
});

TodoSchema.statics = {

  /**
   * Get todo's list
   * @returns {*|Query|T}
   */
  getTodos() {
    return this.find({});
  },

  /**
   * Get todo
   * @param id
   * @returns {Promise.<TResult>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  getById(id) {
    return this.findById(id);
  }

};

export default mongoose.model('Todo', TodoSchema);
