// Import required modules
var express = require('express');
var PouchDB = require('pouchdb');

// Creating database on remote couchdb instance
var db = new PouchDB('http://192.168.1.142/todos');

// Create local database
//var db = new PouchDB('todos');

var ip = 'localhost';
var port = 8000;

// Create a HTTP server
var app = express();

// Example document
/*db.put({
    _id: 'todos',
    title: 'List of ToDos',
    completed: false
}).then(function (response) {
    console.log('Document Created!');
}).catch(function (err) {
    console.log(err);
});*/

// Message to user
app.get('/', function(req, res) {
    res.json({ message: 'PouchDB API - Working!' });
});

// Get all documents
app.get('/getdocs', function(req, res) {
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        return res.json(doc.rows);
    }).catch(function (err) {
        console.log(err);
    });
});

// Get document by id
app.get('/getdoc/:id', function(req, res){
	db.get(req.params.id).then(function (doc) {
        return res.json(doc);
    }).catch(function (err) {
        console.log(err);
    });
});

// Add document
app.get('/adddoc', function(req, res){
    db.put({
        _id: new Date().toISOString(),
        title: 'Heroes'
    }).then(function (response) {
        return res.json('Add Ok!');
    }).catch(function (err) {
        console.log(err);
    });
});

// Update document, get request /updatedoc?id=todos&title=example
app.get('/updatedoc', function(req, res){
    db.get(req.query.id).then(function(doc) {
        return db.put({
            _id: req.query.id,
            _rev: doc._rev,
            title: req.query.title
        });
    }).then(function(response) {
        return res.json('Update Ok!');
    }).catch(function (err) {
        console.log(err);
    });
});

// Delete document by id
app.get('/deldoc/:id', function(req, res){
    db.get(req.params.id).then(function(doc) {
        db.remove(doc);
    }).then(function (result) {
        return res.json('Delete Ok!');
    }).catch(function (err) {
        console.log(err);
    });
});

// Add a todo
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

// Display all documents
function showTodos() {
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
        console.log(doc.rows);
    });
}

// Set the 'completed' bool to true in doc
function completeTodo(todo) {
    todo.completed = true;
    db.put(todo);
}

// Delete document
function deleteTodo(todo) {
    db.remove(todo);
}

// Show database changes
/*db.changes({
    since: 'now',
    live: true
}).on('change', showTodos);*/

//addTodo("Clean dog");
//addTodo("Wash car");
//addTodo("Drink coffee");

// Timeout function delay
/*setTimeout(function(){
    showTodos();
},5000);*/

// Set ip, port of server
app.listen(port, ip);

// Display info of the server
console.log("Web Service running on IP: " + ip + " Port: " + port);