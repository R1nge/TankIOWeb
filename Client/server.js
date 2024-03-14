let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

socket.onopen = function (e) {

    const id = Math.floor(Math.random() * 1000)
    const input = {id: id.toString(), name: "test"}
    
    console.log(`Connected to server. Data sent: ${input}`);
    sendToServer(input, message_type.join);
};

socket.onmessage = function (event) {
    
    if(event.data.startsWith("Move")) {
        console.log(`Move message received: ${event.data}`);
        return;
    }
    
    console.log(`received a message: ${event.data}`);
}

export function sendToServer(dataStruct, messageType) {
    const json = JSON.stringify(dataStruct);
    console.log(`Send to server json sent: ${json}`);
    socket.send(messageType + json);
}

const message_type = {
    join: "Join",
    move: "Move",
    leave: "Leave"
}