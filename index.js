var emitStream = require('emit-stream');
var JSONStream = require('JSONStream');
var EventEmitter = require('events').EventEmitter;
var net = require('net');

exports = module.exports = plugin;
exports.decorate = 'racer';
exports.useWith = {server: true, browser: true};

function plugin (racer, opts) {
  var Model = racer.protected.Model;
  var server = opts.server;

  if (server) {
    var store = opts.store;
    server.on('connection', function (c) {
      var localEmitter = new EventEmitter;
      emitStream(localEmitter).pipe(JSONStream.stringify()).pipe(c);
      var remoteEmitter = emitStream( c.pipe( JSONStream.parse([true]) ) );
      var fakeSocket = {
        emit: function (ev) {
          if (ev === 'resyncWithStore') return;
          localEmitter.emit.apply(localEmitter, arguments);
        }
      , on: remoteEmitter.on.bind(remoteEmitter)
      , once: remoteEmitter.once.bind(remoteEmitter)
      , disconnect: c.end.bind(c)
      , clientId: racer.uuid()
      , handshake: {}
      };
      var startId = -1;
      localEmitter.emit('_ids_', fakeSocket.clientId, startId);
      store.mixinEmit('socket', store, fakeSocket, fakeSocket.clientId);
    });
  } else if (opts.client) {
    racer.util.isServer = false;
    racer.remoteModel = function (endpoint) {
      var model = new Model;
      var stream = net.connect(endpoint);

      var connected = false;
      stream.on('connect', function () {
        connected = true;
      });

      // Better ideal is:
      // model.pipe(stream).pipe(model)
      var localEmitter = new EventEmitter;
      emitStream(localEmitter).pipe(JSONStream.stringify()).pipe(stream);

      var remoteEmitter = emitStream( stream.pipe( JSONStream.parse([true]) ) );
      remoteEmitter.on('_ids_', function (clientId, startId) {
        model._startId = startId;
        model._clientId = clientId;
      });

      var fakeSocket = {
        emit: localEmitter.emit.bind(localEmitter)
      , on: remoteEmitter.on.bind(remoteEmitter)
      , once: remoteEmitter.once.bind(remoteEmitter)
      , disconnect: stream.end.bind(stream)
      };

      model.mixinEmit('socket', model, fakeSocket);

      return model
    };
  }
}
