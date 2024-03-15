import {createPlayer, moveCallback} from "./engine.js";

let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

const player = createPlayer(0);

socket.onopen = function (e) {
    console.log(`Connected to server. Data sent: ${player}`);
    
    const loginData = {
        id: 0,
        x: player.x,
        y: player.y,
        name: "R1nge"
    }
    
    sendToServer(loginData, message_type.join);
};

socket.onmessage = function (event) {
    //trim everything before the {
    const data = event.data.substring(event.data.indexOf("{"));
    console.log(data);
    const parsedData = JSON.parse(data);

    if (event.data.startsWith("Create")) {
        console.log(`Create message received: ${parsedData.id}`);
        return;
    }

    if (event.data.startsWith("Move")) {
        player.x = parsedData.x;
        player.y = parsedData.y;
        moveCallback(parsedData);
        console.log(`Move message received: ${parsedData.x} ${parsedData.y}`);
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