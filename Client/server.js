let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

socket.onopen = function (e) {
    
    const input = {
        horizontal: 69,
        vertical: 1337
    }

    const json = JSON.stringify(input);
    console.log(json)
    sendToServer(json)
};

socket.onmessage = function (event) {
    console.log(event.data);
}

function sendToServer(data) {
    socket.send(data);
}