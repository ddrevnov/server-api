import mongoose from 'mongoose';
import util from 'util';
import config from './config/env';
import app from './config/express';
import http from 'http';
import socketIo from 'socket.io';
import Chat from './server/chat';
import passport from 'passport';
import passportModule from './server/passport';

const server = http.Server(app);
const io = socketIo(server);

passportModule(passport);

const chat = new Chat(io);
chat.init();

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
mongoose.connect(config.db, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`);
});

// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  server.listen(config.port, () => {
    debug(`server started on port ${config.port} (${config.env})`);
  });
}

export default app;
