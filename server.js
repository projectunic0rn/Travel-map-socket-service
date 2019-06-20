var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const port = process.env.PORT || 9500


server.listen(port, () => {
    console.log("Server up on port " + port)
});

io.on('connection', (socket) => {
    console.log("USER CONNECTED")
})
