var derby = require('derby');
var store = derby.createStore();
var model = store.createModel();

model.subscribe('docs.*', function (err) {
  model.on('set', 'docs.*.name', function (id, name) {
    console.log(id, name);
  });
});

var server = require('net').createServer();
derby.use(require('racer-net'), {server: server, store: store})
server.listen(8888);
