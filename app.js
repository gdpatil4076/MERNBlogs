// $env:PORT = 5500; node index.js
require("dotenv").config();

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express(); 
// const server = http.createServer(app);
// const io = socketIo(server);
const path = require('path');

const UserRouter = require("./routes/user");
const {ConnectMongoDB} = require('./connection');
const cookieParser = require('cookie-parser'); 
const {CheckForAuthentication} = require("./middleware/restrictor");
const BlogRouter = require('./routes/blog'); 
const BLOG = require('./models/blog'); 
const USER = require('./models/user'); 
const { getEventListeners } = require("events");
const cors=require("cors")
const PORT = process.env.PORT || 7000;

console.log("MongoUrl is " , process.env.MONGO_URL);

// Making Connection 
ConnectMongoDB(process.env.MONGO_URL) 
.then(()=>{ 
    console.log("MongoDB connected");  
})  
.catch((err)=>{   
    console.log(`Error : ${err}`)   
}); 
//    



// app.set("view engine" , "ejs");

app.use(express.json());
app.set("views" , path.resolve('./views'));

// app.use(cors({
//     origin : "https://blog-frontend-9ry6.vercel.app",
//     credentials : true,
// }));

// Enable CORS for all origins
app.use(cors());


app.use(express.urlencoded({extended : false})); 
app.use(cookieParser({
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
    signed: true,
})); 

app.use(CheckForAuthentication("token"));  
app.use(express.static(path.resolve("./public")));


//real time chat
// io.on('connection', (socket) => {
//     console.log('A user connected');
//     // Handle events from the client
//     socket.on('chat message', (msg) => {
//       // Broadcast the message to all connected clients
//       io.emit('chat message', msg);
//     });
  
//     socket.on('disconnect', () => {
//       console.log('User disconnected');
//     });

//   });
// real time chat

app.get('/b' , async (req,res)=>{ 
    const blogData = await BLOG.find({});
    return res.send(blogData); 
});   
    
app.use('/user' , UserRouter);  
app.use('/blog', BlogRouter ); 
  
app.listen(PORT,()=>{
    console.log(`Server started at port : ${PORT}`);  
});                



