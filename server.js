const express = require('express')
const http = require('http')
const path = require('path')
const PORT = process.env.PORT || 3000
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const {
    TOTAL_WAITING_TICKS,
    TICK
} = require('./utils/constants')

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

        gameQueue[player.nickName] = client.id

        console.log(gameQueue);
        console.log(Object.keys(gameQueue).length);

        if (Object.keys(gameQueue).length >= 2) {

            let game = {
                "player1": Object.keys(gameQueue)[0],
                "player2": Object.keys(gameQueue)[1],
                "gameCode": "1"
            }
            client.emit('initGame', game); //self
            client.broadcast.emit('initGame', game); //the rest

        } else {
            checkGameReady(client)
        }

        //console.log(gameQueue);

    });

    //CHAT
    client.on('sendMessage', message => {
        console.log(message);

        client.broadcast.emit('serverResponse', message); //event, cos
        //client.emit('serverResponse', message); //event, cos

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

//looking for game period interval
function checkGameReady(client) {

    let currentWaitingTicks = 0;

    const intervalID = setInterval(() => {

        console.log("interval ID");
        console.log(client.id);
        console.log(gameQueue);

        if (Object.keys(gameQueue).length < 2 && currentWaitingTicks < TOTAL_WAITING_TICKS) { //game players

            client.emit('waiting', 'waiting for Game');

            currentWaitingTicks++;

        } else {
            clearInterval(intervalID);

            console.log("before: " + gameQueue)
            delete gameQueue[Object.keys(gameQueue)[0]]
            console.log("p1 removed: " + gameQueue)

            delete gameQueue[Object.keys(gameQueue)[1]]
            console.log("p2 removed: " + gameQueue)

        }

    }, TICK)
}

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