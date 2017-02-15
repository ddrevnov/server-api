import ChatRoom from '../models/chat-room.model';
import ChatMessage from '../models/chat-messages.model';

function getRooms(req, res, next) {
  ChatRoom.getRooms()
    .then(rooms => res.json(rooms))
    .catch(err => next(err));
}

function getMessagesByRoom(req, res, next) {
  let roomName = req.params.roomName;

  ChatMessage.getByRoom(roomName)
    .then(messages => res.json(messages))
    .catch(err => next(err));
}

function createMessage(req, res, next) {
  let message = req.body;

  ChatMessage.create(message)
    .then(message => res.json(message))
    .catch(err => next(err));
}

export default { getRooms, getMessagesByRoom, createMessage };
