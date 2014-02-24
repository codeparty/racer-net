racer-net
=========

## Do not use for new projects

This project was intended for use with Racer 0.3, before Racer had multi-process support. The current version of Racer built on top of ShareJS works across multiple servers out of the box. There is no need for this project any more.


## Usage:

Create racer models over a node.js net connection

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
