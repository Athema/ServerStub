const io = require('socket.io')() //doble parentesi instancia

io.on('connection', client => {
    console.log("client: " + client.id);
})

io.listen(process.env.PORT || 3000)
    // 3000 en cas de que Heroku no la portés per defecte, 3000 és local