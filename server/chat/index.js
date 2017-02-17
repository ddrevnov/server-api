import ChatMessage from '../models/chat-messages.model';

export default class Chat {
  constructor(io) {
    this.io = io;
    this.defaultRoom = 'general';
  }

  init() {
    this.io.on('connection', (socket) => {

      socket.on('new message', (message) => {
        ChatMessage.create(message)
          .then(message => {
            this.io.in(message.room).emit('message created', message);
          })
          .catch(err => console.error('Message create error'));
      });

      socket.on('new user', ({ room }) => {
        if (!room) room = this.defaultRoom;
        socket.join(room);
        this.io.in(this.defaultRoom)
          .emit('user joined', {newRoom: room, oldRoom: null});
      });

      socket.on('switch room', (data) => {
        socket.leave(data.oldRoom);
        socket.join(data.newRoom);
        this.io.in(data.oldRoom).emit('user left', data);
        this.io.in(data.newRoom).emit('user joined', data);
      });

    });

  }
}
