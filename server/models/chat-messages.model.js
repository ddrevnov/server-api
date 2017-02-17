import mongoose from 'mongoose';

/**
 * ChatRoom Schema
 */
const ChatMessageSchema = new mongoose.Schema({
  created: { type: Date, default: Date.now },
  text: { type: String, required: true, trim: true },
  chatName: { type: String, required: true, trim: true },
  room: {type: String, lowercase: true, trim: true, ref: 'ChatRoom'},
});

ChatMessageSchema.statics = {

  getByRoom(roomName) {
    return this.find({room: roomName}).sort('created');
  },

};

export default mongoose.model('ChatMessage', ChatMessageSchema);
