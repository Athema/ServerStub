//const socket = io('localhost:3000')

const socket = io('https://fast-spire-68417.herokuapp.com/')

socket.on('salut', missatge => {

    console.log(missatge);

})