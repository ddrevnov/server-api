import express from 'express';
import chatCtrl from '../controllers/chat.controller';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/chat/rooms - return array of rooms */
router.route('/rooms')
  .get(chatCtrl.getRooms);

/** GET /api/chat/messages/{roomName} - return array of messages of room  */
router.route('/messages/:roomName')
  .get(chatCtrl.getMessagesByRoom);

/** POST /api/chat/messages - return array of rooms */
router.route('/messages')
  .post(chatCtrl.createMessage);

export default router;
