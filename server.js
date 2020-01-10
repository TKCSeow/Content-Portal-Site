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
var messagesTemp = [];

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

//Set Message model
var Message = mongoose.model("Messages",
{username: String, messageBody: String, dateTime: String});

//Read database for messages
//To disable loading old messages on server restart, comment out the next 12 lines (47 to 58)
Message.find(function(err, message) {

  for (let index = 0; index < message.length; index++) {
    //Format data into an object
    var tempMessage = {userName: message[index].username, message: message[index].messageBody, time: message[index].dateTime};
    console.log(tempMessage);

    //Add to array to be displayed on startup/load
    messagesTemp.push(tempMessage);
  }
    
});




//******************************* */
//Websockets
//******************************* */

io.on('connection', function(socket){
  //On Connect
  console.log('a user connected');
  userCount++;
  io.emit('user count', userCount);

  //Send Old Messages
  io.emit('load messages', messagesTemp); //Emits messages in temp array

  //Receiving a message from client
  socket.on('chat message', function(msg){
    messagesTemp.push(msg); //add to list

    //Save Message to database
    var newMessage = new Message({username: msg.userName,
      messageBody: msg.message, dateTime: msg.time});
      newMessage.save(function(err) {
        console.log("Message Saved");
        });
        
      console.log(newMessage);
      
    //Send message to everyone
    io.emit('chat message', msg); 
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