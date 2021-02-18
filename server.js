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
const maps = require('./utils/maps')



app.use(express.static(path.join(__dirname, "public")))

server.listen(process.env.PORT || 3000, () => console.log(`Server up and running ${PORT}`))

const dbconfig = require('./database/dbconfig');

const userRoutes = require('./routes/routes')(app)

//LOOKING FOR GAME ATTRIBUTES
let gameQueue
gameQueue = {}

io.on('connection', client => {

    //CONNECTION & DISCONNECTION
    console.log('client: ' + client.id);

    client.on('disconnect', function() {
        console.log("Player disconnected");
    });

    //LOOKING FOR GAME / matchmaking
    client.on('lookingForGame', player => {





        //Random de 0 a 4, enviar numero com parametre "mapa"

        //Spawn Location i la tile a l'spawn location

        //int random spawn location, int random origin tile, passar a networkItem

        //network ID internes de unity - player i character -> 
        //exemple seria: player 1 - id 0, criatura player 1 - id 1, etc, etc
        //decidir quin jugador comença primer


        //player = JSON.parse(player);
        console.log(player);


        //gameQueue[client.id] = player.nickName
        //gameQueue[client.id] = {}
        gameQueue[client.id] = player

        console.log(gameQueue);

        //Mock Up
        //let playerMockup = player;
        //playerMockup.nickName = "Noktor"
        //gameQueue["pepet"] = playerMockup
        //end mockup

        console.log(Object.keys(gameQueue).length);

        if (Object.keys(gameQueue).length >= 2) {

            //MAP: Random pero amb mask / pasar un parametre de mapa

            let map = maps[Math.floor(Math.random() * maps.length)];


            let players = [
                Object.keys(gameQueue)[0],
                Object.keys(gameQueue)[1]
            ]

            for (let player of players) {

                let spawnLocation = Math.floor(Math.random() * map.spawnLocations.length)

                for (let location of map.spawnLocations) {

                    if (map.spawnLocations[spawnLocation].used === false) {
                        map.spawnLocations[spawnLocation].used = true;

                        let spawnTile = Math.floor(Math.random() * location.spawnTiles.length)

                        for (let tile of location.spawnTiles) {


                            if (map.spawnLocations[spawnLocation][spawnTile].used === false) {
                                map.spawnLocations[spawnLocation][spawnTile].used = true;


                            }
                        }
                    }
                }
            }

            let spawnTile

            console.log(map);

            //end map


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

    client.on('cancelSearch', message => {
        console.log(message);

        delete gameQueue[client.id]

        console.log(gameQueue);

    });


    //CHAT


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

            client.emit('waiting', 'waiting');

            currentWaitingTicks++;

        } else {
            clearInterval(intervalID);

            console.log("before: " + gameQueue)
            delete gameQueue[client.id]
            console.log("player removed: " + gameQueue)

            client.emit('waiting', 'cancelled');

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