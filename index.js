var PouchDB = require('pouchdb');
var db = new PouchDB('todos');

db.changes({
  since: 'now',
  live: true
}).on('change', showTodos);

//addTodo("Clean dog");
//addTodo("Wash car");
//addTodo("Drink coffee");

var varTodo = db.get('2015-11-02T16:39:06.752Z').then(function (doc) {
  console.log(doc);
  // handle doc
}).catch(function (err) {
  console.log(err);
});
console.log(varTodo);
//showTodos();
 
function addTodo(text) {

  var todo = {
    _id: new Date().toISOString(),
    title: text,
    completed: false
  };

  db.put(todo, function callback(err, result) {
    if (!err) {
      console.log('Successfully posted a todo!');
    }
  });

}

function showTodos() {
  db.allDocs({include_docs: true, descending: true}, function(err, doc) {
    console.log(doc.rows);
  });
}

function completeTodo(todo) {
  todo.completed = true;
  db.put(todo);
}

function deleteButtonPressed(todo) {
  db.remove(todo);
}