import { Server } from "socket.io";

let pythonAgentSocket = null;

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    },
    allowEIO3: true,        
    maxHttpBufferSize: 1e8, 
    pingTimeout: 60000,     
    pingInterval: 25000
  });

  io.on('connection', (socket) => {

    socket.on('identify_service', (data) => {
      if (data.type === 'ai_agent') {
        pythonAgentSocket = socket;
      }
    });

    socket.on('frontend_send', (data) => {
      if (pythonAgentSocket && pythonAgentSocket.connected) {
        pythonAgentSocket.emit('ask_agent', {
          question: data.text,
          activePage: data.activePage, 
          userSocketId: socket.id      
        });
      } else {
        socket.emit('frontend_receive', { reply: "🚨 Error: AI Agent microservice is offline." });
      }
    });
    
    socket.on('text_stream_chunk', (data) => {
      io.to(data.userSocketId).emit('text_stream_chunk', { 
        text: data.text, 
        page: data.page,
        triggerPageChange: data.triggerPageChange 
      });
    });

    socket.on('agent_status_change', (data) => {
      io.to(data.userSocketId).emit('frontend_status_receive', { status: data.status });
    });

    socket.on('file_system_sync', (data) => {
      io.to(data.userSocketId).emit('frontend_file_update', { filename: data.filename, content: data.content });
    });

    socket.on('terminal_update', (data) => {
      io.to(data.userSocketId).emit('frontend_terminal_receive', { log: data.log });
    });

    socket.on('audio_stream_ready', (data) => {
      io.to(data.userSocketId).emit('frontend_audio_ready', { audioData: data.audioData });
    });

    socket.on('agent_error', (data) => {
      io.to(data.userSocketId).emit('frontend_receive', { reply: `🚨 Error: ${data.msg}` });
    });

    socket.on('disconnect', (reason) => {
      if (pythonAgentSocket && socket.id === pythonAgentSocket.id) {
        pythonAgentSocket = null;
      }
    });

    socket.on('error', (err) => {});
  });
  return io;
};