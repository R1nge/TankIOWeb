let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

const player = {
        id: "0", //id.toString(), 
        name: "test",
        positionX: 0,
        positionY: 0
    }

socket.onopen = function (e) {

    const id = Math.floor(Math.random() * 1000)
    
    console.log(`Connected to server. Data sent: ${player}`);
    sendToServer(player, message_type.join);
};

export function getPlayerId() {
    return 0
} 


let position = {
    positionX: 0,
    positionY: 0
};

socket.onmessage = function (event) {
    
    if(event.data.startsWith("Move")) {
        //trim everything before the {
        const data = event.data.substring(event.data.indexOf("{"));
        const parsedData = JSON.parse(data);
        console.log(data)
        position.positionX += parsedData.positionX;
        position.positionY += parsedData.positionY;
        console.log(`Move message received: ${position.positionX} ${position.positionY}`);
    }
    
    console.log(`received a message: ${event.data}`);
}

export function getPosition() {
    console.log(`Position received: ${position.positionX} ${position.positionY}`);
    return position;
} 

export function sendToServer(dataStruct, messageType) {
    const json = JSON.stringify(dataStruct)
    console.log(`Send to server json sent: ${json}`);
    socket.send(messageType + json);
}

const message_type = {
    join: "Join",
    move: "Move",
    leave: "Leave"
}