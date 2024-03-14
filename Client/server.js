let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

socket.onopen = function (e) {

    const input = {
        horizontal: 69,
        vertical: 1337
    }
    
    console.log(`Connected to server. Data sent: ${input}`);
    sendToServer(input);
};

socket.onmessage = function (event) {
    console.log(`received a message: ${event.data}`);
}

export function sendToServer(dataStruct) {
    console.log(`Send to server data: ${dataStruct}`);
    const json = JSON.stringify(dataStruct);
    console.log(`Send to server json sent: ${json}`);
    socket.send(json);
}