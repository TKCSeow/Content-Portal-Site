var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mongo = require('mongodb').MongoClient;

var database;
// var Message = mongoose.model('Message',{
//     msg:String
// });

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
})

// app.postMessage('/'), function (req,res){
//   console.log(req.body);
//   var message = new Message(req.body);

// message.save();

//   res.status(200);
// }

mongo.connect("mongodb://localhost:27017/test", { useNewUrlParser: true , useUnifiedTopology: true }), function(err, db){
  if(!err){
    console.log("we are connected to mongo");
    database = db;
   
  }
}

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('typing', function(data){
    // console.log('someone is typing');
    io.emit('typing', data);
});
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});