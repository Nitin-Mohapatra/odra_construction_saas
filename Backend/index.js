const express = require('express')
const app = express();
const port = 8080;
const connectDb = require("./databaseConnect");
const cors = require('cors')
const helmet = require('helmet')
const {Server} = require('socket.io')
const {createServer} = require('http');
const http = require('http');
const reportRoute = require('./routes/reportsRoute');
const projectRoute = require('./routes/projectRoutes');
const attendanceRoute = require('./routes/attendanceRoute');
const chatRouter = require('./routes/chatRouter');
const workerRoutes = require('./routes/workerRoutes');
const ChatMessage = require("./models/chatMessage");
const Project = require("./models/project")
const inventoryRoute = require('./routes/inventoryRoutes');

// creating http server and mounting socket.io to it
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.set('io', io); // attaching io to app for easy access in routes

// listening for socket connection & client 
io.on('connection',(socket)=>{
    console.log('A user connected:', socket.id);

    // listen for joining room events
    socket.on('join',({contractorId , projectId, siteEngineerId}) => {
        console.log('Join event received:', { contractorId, projectId, siteEngineerId });
        if(contractorId) {
            socket.join(`contractor-${contractorId}`);
            console.log(`Socket ${socket.id} joined contractor-${contractorId}`);
        }
        if(projectId) {
            socket.join(`project-${projectId}`);
            console.log(`Socket ${socket.id} joined project-${projectId}`);
        }
        if(siteEngineerId) {
            socket.join(`siteEngineer-${siteEngineerId}`);
            console.log(`Socket ${socket.id} joined siteEngineer-${siteEngineerId}`);
        }
    })

    // if they leave the room
    socket.on('leave',({contractorId,projectId,siteEngineerId})=>{
        if(contractorId) socket.leave(`contractor-${contractorId}`);
        if(projectId) socket.leave(`project-${projectId}`);
        if(siteEngineerId) socket.leave(`siteEngineer-${siteEngineerId}`);
    })

    // listening for new messages
    socket.on("chat:new", async ({ projectId, senderId, message }) => {
      try {
        if (!projectId || !senderId || !message) return;

        // check if the project is completed
        const project = await Project.findById(projectId);
        if(!project || project.status === "Completed"){
            console.log("Project is completed");
            return;
        }

        const chat = await ChatMessage.create({
          projectId,
          senderId,
          message
        });

        io.to(`project-${projectId}`).emit("chat:new", chat);
      } catch (err) {
        console.error("Chat socket error:", err);
      }
    });

    socket.on('disconnect',()=>{
        console.log('A user disconnected');
    })
})


// requiring routes
const { signup, signin } = require('./routes/auth/createUser')
const { googleAuth } = require('./routes/auth/googleAuth');
const { messagePost } = require("./routes/message");

app.use(express.json())
httpServer.listen(port, () => {
    console.log("Connection to backend established")
})
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// requiring singup and signin
app.use('/auth', signup);
app.use('/auth', signin);

// requiring google auth
app.use('/auth', googleAuth);

// requiring message
app.use('/', messagePost);

// using the project and report routes
app.use('/projects',projectRoute);
app.use('/reports',reportRoute);
app.use('/attendance',attendanceRoute);
app.use('/chat',chatRouter);
app.use('/workers',workerRoutes);
app.use('/inventory',inventoryRoute);

// requiring tokenValidatorChecker
const tokenValidation = require('./routes/tokenValiditiCheaker');
const { Socket } = require('dgram');
app.use('/token', tokenValidation);

// connecting to database
connectDb()