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

        console.log(player);

        gameQueue[client.id] = player

        console.log(gameQueue);

        console.log(Object.keys(gameQueue).length);

        if (Object.keys(gameQueue).length >= 2) {

            let map = maps[Math.floor(Math.random() * maps.length)];

            console.log("Map ID: " + map);

            let players = [
                gameQueue[Object.keys(gameQueue)[0]],
                gameQueue[Object.keys(gameQueue)[1]]
            ]

            players = assignNetworkIds(players)
            players = assignSpawnLocations(players, map)

            console.log("PLAYERS")
            console.log(players)

            // players[0].networkItem.networkId = 0;
            // players[0].networkItem.character.networkId = 1;
            // players[0].networkItem.originSpawn = 0;
            // players[0].networkItem.originTileInSpawn = 0;

            // players[1].networkItem.networkId = 2;
            // players[1].networkItem.character.networkId = 3;
            // players[1].networkItem.originSpawn = 1;
            // players[1].networkItem.originTileInSpawn = 0;

            let game = {
                "players": shufflePlayers(players),
                "map": map
            }

            console.log("GAME: " + game);

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

        // console.log("interval ID");
        // console.log(client.id);
        // console.log(gameQueue);

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


function assignNetworkIds(players) {
    let networkId = 0
    for (let player of players) {
        player.networkItem.networkId = networkId++
            player.networkItem.character.networkId = networkId++
    }
    return players
}

/**
 * 
 * @param {Array<player>} players 
 * @param {Map<map>} map 
 */
function assignSpawnLocations(players, map) {
    for (let player of players) {

        let randomizedLocation = parseInt(Math.floor(Math.random() * map.spawnLocations.length))

        for (let spawnLocation in map.spawnLocations) {
            if (map.spawnLocations[spawnLocation].used === false && parseInt(spawnLocation) === randomizedLocation) {
                map.spawnLocations[spawnLocation].used = true

                //spawnLocation
                player.networkItem.originSpawn = spawnLocation;

                //tile
                let randomizedTile = parseInt(Math.floor(Math.random() * map.spawnLocations[spawnLocation].spawnTiles.length))

                player.networkItem.originTileInSpawn = randomizedTile;

                map.spawnLocations.splice(spawnLocation, 1)
                break
            }
        }
    }



    return players
}

function shufflePlayers(players) {
    return players.sort(() => Math.random() - 0.5);
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