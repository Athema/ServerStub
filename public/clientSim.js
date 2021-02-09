document.addEventListener('DOMContentLoaded', () => {

    //const socket = io('localhost:3000')
    const   socket = io('localhost:3000')
    // const socket = io('https://fast-spire-68417.herokuapp.com/')

    socket.on('salut', missatge => {
        console.log(missatge);
    })

    const actionButton = document.getElementById('actionButton');
    const chatButton = document.getElementById('chatButton');

    actionButton.addEventListener('click', clickActionButton);
    chatButton.addEventListener('click', clickChatButton);

    function clickActionButton() {
        console.log("event triggered action")
        socket.emit('gameAction', 'I have sent an action');
    }

    function clickChatButton() {
        console.log("event triggered chat ")
        socket.emit('chat', 'I have sent a chat message');
    }
})