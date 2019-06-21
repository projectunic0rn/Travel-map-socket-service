var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const port = process.env.PORT || 9500


app.get("/", (req, res) => {
    res.send("Welome to the travel map socket service!")
})


server.listen(port, () => {
    console.log("Server up on port " + port)
});

io.on('connection', (socket) => {
    var client = {
        clientId: socket.id
    }
    
    // send the client their ID to be used for direct communcation
    io.sockets.to(client.clientId).emit("client-id", client.clientId)



    io.on("friend-request", (data) => {
        let clientId = data.clientId;
        let sendingUser = data.sendingUser;

        // send friend request alert to receiving client id
        io.sockets.to(clientId).emit("new-friend-request", sendingUser);
    })
})
