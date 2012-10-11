var derby = require('derby');
derby.use(require('racer-net'), {client: true});

var model = derby.remoteModel(8888);
model.set('docs.1.name', 'rook');
