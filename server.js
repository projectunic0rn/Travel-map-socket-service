var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var jwt = require('jsonwebtoken');
require('dotenv').config()



const port = process.env.PORT || 9500


app.get("/", (req, res) => {
    res.send("Welome to the travel map socket service!")
})


server.listen(port, () => {
    console.log("Server up on port " + port)
});


let currentConnections = {};
io.on('connection', async (socket) => {
    
    socket.on("user-connected", async (token) => {
        try {
            let decodedData = await jwt.verify(token, process.env.TOKEN_SECRET);
            currentConnections[socket.id] = decodedData.user_id;
        } catch (e) {
            return e
        }
    })

    socket.on("friend-request", (data) => {
        let sender = data.sender;
        let receiver = data.receiver;
        let friendRequestId = data.friendRequestId;
        let receiverIsOnline = Object.values(currentConnections).indexOf(receiver.id) >= 0;

        if (receiverIsOnline) {
            const clientId = Object.keys(currentConnections).find(key => currentConnections[key] === receiver.id);

            let frPayLoad = {
                senderData: {
                    username: sender.username,
                    id: sender.id
                },
                receiverData: {
                    username: receiver.username,
                    id: receiver.id

                },
                friendRequestId: friendRequestId
            }
            io.sockets.to(clientId).emit('new-friend-request', frPayLoad);

        }
    })

    socket.on("test", (data) => {
        console.log(data)
    })


    // remove the client from current connections when they disconnect
    socket.on('disconnect', (() => {
        delete currentConnections[socket.id];
    }))
})
