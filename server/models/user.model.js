import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import bcrypt from 'bcrypt-nodejs';

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({

  local: {
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },

  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }

});

UserSchema.pre('save', function(next){
  var user = this;
  if(!user.isModified('local.password')) return next();

  bcrypt.hash(user.local.password, null, null, function(err, hash){
    if(err) return next(err);

    user.local.password = hash;
    next();
  });
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
UserSchema.method({
  comparePassword(password) {
    let user = this;
    return bcrypt.compareSync(password, user.local.password);
  }
});

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
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

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};

/**
 * @typedef User
 */
export default mongoose.model('User', UserSchema);
