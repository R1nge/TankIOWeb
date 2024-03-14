let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

socket.onopen = function (e) {

    const id = Math.floor(Math.random() * 1000)
    const player = {
        id: id.toString(), 
        name: "test",
        positionX: 0,
        positionY: 0
    }
    
    console.log(`Connected to server. Data sent: ${player}`);
    sendToServer(player, message_type.join);
};


let position = {
    positionX: 0,
    positionY: 0
};

socket.onmessage = function (event) {
    
    if(event.data.startsWith("Move")) {
        //trim everything before the {
        const data = event.data.substring(event.data.indexOf("{"));
        const parsedData = JSON.parse(data);
        position.positionX = parsedData.horizontal;
        position.positionY = parsedData.vertical;
        console.log(`Move message received: ${event.data}`);
    }
    
    console.log(`received a message: ${event.data}`);
}

export function getPosition() {
    return position;
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