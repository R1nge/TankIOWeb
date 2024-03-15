import {createCallback} from "./engine.js";

let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

const player = {
    id: "0", //id.toString(), 
    name: "test",
    positionX: 0,
    positionY: 0
}

export function getPosition() {
    return player;
}

socket.onopen = function (e) {
    console.log(`Connected to server. Data sent: ${player}`);
    sendToServer(player, message_type.join);
    sendToServer(player, message_type.create);
};

socket.onmessage = function (event) {
    //trim everything before the {
    const data = event.data.substring(event.data.indexOf("{"));
    console.log(data);
    const parsedData = JSON.parse(data);

    if (event.data.startsWith("Create")) {
        console.log(`Create message received: ${parsedData.positionX} ${parsedData.positionY}`);
        createCallback(parsedData);
        return;
    }

    if (event.data.startsWith("Move")) {
        player.positionX = parsedData.positionX;
        player.positionY = parsedData.positionY;
        console.log(`Move message received: ${player.positionX} ${player.positionY}`);
        return;
    }

    console.log(`received a message: ${event.data}`);
}

export function sendToServer(dataStruct, messageType) {
    const json = JSON.stringify(dataStruct)
    console.log(`Send to server json sent: ${json}`);
    socket.send(messageType + json);
}

const message_type = {
    join: "Join",
    create: "Create",
    move: "Move",
    leave: "Leave"
}