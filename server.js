const express = require('express')
const http = require('http')
const path = require('path')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(path.join(__dirname, "public")))

server.listen(process.env.PORT || 3000, () => console.log(`Server up and running ${PORT}`))

const dbconfig = require('./database/dbconfig');

const userRoutes = require('./routes/routes')(app)

//LOOKING FOR GAME ATTRIBUTES
let gameQueue = {}

io.on('connection', client => {

    //CONNECTION & DISCONNECTION
    console.log('client: ' + client.id);

    client.on('disconnect', function() {
        console.log("Player disconnected");
    });

    //LOOKING FOR GAME / matchmaking
    client.on('lookingForGame', player => {
        console.log(player.nickName);

        gameQueue[player] = client.id



        if (Object.keys(gameQueue).length >= 2) {

            let game = {
                "player1": Object.keys(gameQueue)[0],
                "player2": Object.keys(gameQueue)[1],
                "gameCode": "1"
            }
            client.emit('initGame', game);
            client.broadcast('initGame', game);

        } else {
            console.log('waiting for Game');
            client.emit('waiting', 'waiting for Game');
        }

        //console.log(gameQueue);

    });

    //CHAT
    client.on('sendMessage', message => {
        console.log(message);

        client.broadcast.emit('serverResponse', message); //event, cos
        client.emit('serverResponse', message); //event, cos

    });

    //ui web
    client.on('gameAction', actionObject => {

        console.log('rebut event1');
        console.log(actionObject);

    })

    client.on('chat', chatLine => {
        console.log('rebut event2');
        console.log(chatLine);
    })
})

// 3000 en cas de que Heroku no la portés per defecte, 3000 és local

// const io = require('socket.io')() //doble parentesi instancia

// io.on('connection', client => {
//     console.log('client: ' + client.id);

//     client.emit('salut', 'hola!'); //event, cos

//     client.on('gameAction', actionObject => {

//         console.log('rebut event1');
//         console.log(actionObject);

//     })

//     client.on('chat', chatLine => {
//         console.log('rebut event2');
//         console.log(chatLine);
//     })



// })

// io.listen(process.env.PORT || 3000)
//     // 3000 en cas de que Heroku no la portés per defecte, 3000 és local