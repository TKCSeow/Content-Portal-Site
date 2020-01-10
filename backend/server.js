//******************************* */
//Node Server
//******************************* */

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const mongoose = require('mongoose')
const url = 'mongodb://127.0.0.1:27017/messages'
var database;

var userCount = 0;
var messages = [];

//******************************* */
//Express
//******************************* */
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
})

//******************************* */
//Mongo
//******************************* */
mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

//******************************* */
//Websockets
//******************************* */

io.on('connection', function(socket){
  //On Connect
  console.log('a user connected');
  userCount++;
  io.emit('user count', userCount);

  //Send Old Messages
  io.emit('load messages', messages);

  //Receive a message
  socket.on('chat message', function(msg){
    messages.push(msg); //add to list
    io.emit('chat message', msg); //send to everyone
  });

  //Typing Feedback
  socket.on('typing', function(data){
    // console.log('someone is typing');
    io.emit('typing', data);
});

  
  //On Disconnect
  socket.on('disconnect', function(){
    console.log('user disconnected');
    userCount--;
    io.emit('user count', userCount);
  });
  
});


http.listen(3000, function(){
  console.log('listening on :3000');
});