import mongoose from 'mongoose';

/**
 * ChatRoom Schema
 */
const ChatRoomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
});

ChatRoomSchema.statics = {

  getRooms() {
    return this.find({});
  },

};

export default mongoose.model('ChatRoom', ChatRoomSchema);
