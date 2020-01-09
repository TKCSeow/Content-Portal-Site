var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://localhost:27017/";
// Set up a DB connection event handler.
MongoClient.connect(url, { useNewUrlParser: true , useUnifiedTopology: true },
function(err, db) {
// Connect to the right DB and create an object.
var dbo = db.db("studentdb");
var student = {name: "Jane Bloggs",
course: "Computer Science"};
// Insert the object as a document.
dbo.collection("students").insertOne(student,
function(err, res) {
console.log("Added student to the DB");
db.close();
});
});