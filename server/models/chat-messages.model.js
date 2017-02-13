import mongoose from 'mongoose';

/**
 * ChatRoom Schema
 */
const ChatMessageSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  room: {type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom'},
});

ChatMessageSchema.statics = {

  getByRoom(roomId) {
    return this.find({room: roomId});
  },

};

export default mongoose.model('ChatMessage', ChatMessageSchema);
