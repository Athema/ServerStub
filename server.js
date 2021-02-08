const io = require('socket.io')() //doble parentesi instancia

io.on('connection', client => {
    console.log('client: ' + client.id);

    client.emit('salut', 'hola!'); //event, cos

    client.on('gameAction', actionObject => {

        console.log('rebut event1');
        console.log(actionObject);

    })

    client.on('chat', chatLine => {
        console.log('rebut event2');
        console.log(chatLine);
    })



})

io.listen(process.env.PORT || 3000)
    // 3000 en cas de que Heroku no la portés per defecte, 3000 és local