import mongoose from 'mongoose';

/**
 * Todo Schema
 */
const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  completed: { type: Boolean, required: true }
});

TodoSchema.statics = {

  get() {
    return this.find({});
  }

};

export default mongoose.model('Todo', TodoSchema);
