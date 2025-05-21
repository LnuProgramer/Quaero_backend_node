export const setupSocketHandlers = (io) => {
    io.on('connection', (socket) => {
        console.log(`🟢 User connected: ${socket.id}`);
        socket.on('call-user', (data) => {
            io.to(data.target).emit('call-request', { from: socket.id });
        });
        socket.on('call-accepted', (data) => {
            io.to(data.from).emit('call-accepted', { answer: data.answer });
        });
        socket.on('ice-candidate', (data) => {
            io.to(data.target).emit('ice-candidate', { candidate: data.candidate });
        });
        socket.on('send-offer', (data) => {
            io.to(data.target).emit('offer-received', {
                offer: data.offer,
                from: socket.id,
            });
        });
        socket.on('send-answer', (data) => {
            io.to(data.target).emit('answer-received', {
                answer: data.answer,
            });
        });
        socket.on('end-call', (data) => {
            io.to(data.target).emit('call-ended');
        });
        socket.on('disconnect', () => {
            console.log(`🔴 User disconnected: ${socket.id}`);
        });
    });
};
//# sourceMappingURL=socket.controller.js.map