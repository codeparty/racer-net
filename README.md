racer-net
=========

Create racer models over a node.js net connection


## Usage:

On the server...

```javascript
var racer = require('racer');
var server = require('net').createServer();
var store = racer.createStore();
var model = racer.createModel();

racer.use(require('racer-net'), {server: server, store: store})

model.subscribe('docs.*', function () {
  model.on('set', 'docs.*.name', function (id, name) {
    console.log(id, name);
  });
});

server.listen(8888)
```

On the client...

```javascript
var racer = require('racer');
racer.use(require('racer-net'), {client: true});
var model = racer.remoteModel(8888);
model.set('docs.1.name', 'rook');
```
