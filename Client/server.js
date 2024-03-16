﻿import {createPlayer, getPlayers, moveCallback} from "./engine.js";
import {Utils} from "./utils.js";
import {Constants} from "./constants.js";

let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

const id = Utils.randomInt(0, 1000);
    
export function getLocalId(){
    return id;
}

const localPlayer = createPlayer(getLocalId());

socket.onopen = function (e) {
    console.log(`Connected to server. Data sent: ${localPlayer}`);
    
    const loginData = {
        id: getLocalId(),
        x: localPlayer.x,
        y: localPlayer.y,
        name: "R1nge"
    }

    console.log(`Login data sent: ${loginData.id} ${loginData.x} ${loginData.y} ${loginData.name}`);
    
    sendToServer(loginData, Constants.commands.join);
};

socket.onmessage = function (event) {
    //trim everything before the {
    const data = event.data.substring(event.data.indexOf("{"));
    console.log(`Message received: ${data}`);
    const parsedData = JSON.parse(data);
    
    if (event.data.startsWith(Constants.commands.join)) {
        if(parsedData.id === getLocalId()) {
            console.log("Already joined");
            return;
        }
        console.log("Join message received: " + parsedData.id);
        createPlayer(parsedData.id);
        return;
    }

    if (event.data.startsWith(Constants.commands.create)) {
        console.log(`Create message received: ${parsedData.id}`);
        return;
    }

    if (event.data.startsWith(Constants.commands.move)) {
        const player = getPlayers().get(parsedData.id);
        if (!player) {
            console.log(`Player ${parsedData.id} not found`);
            return;
        }
        moveCallback(parsedData);
        player.x = parsedData.x;
        player.y = parsedData.y;
        console.log(`Move message received: ${parsedData.id} ${parsedData.x} ${parsedData.y}`);
        return;
    }
    
    if (event.data.startsWith(Constants.commands.sync)) {
        console.log(`Sync message received: ${parsedData}`);

        console.log(`Player ${parsedData.id} ${parsedData.x} ${parsedData.y}`);


        createPlayer(parsedData.id);


        const player = getPlayers().get(parsedData.id);
        if (!player) {
            console.log(`Player ${parsedData.id} not found`);
            return;

        }
        player.x = parsedData.x;
        
        player.y = parsedData.y;
        
        // for (const player of getPlayers().values()) {
        //     sendToServer({
        //         id: player.id,
        //         x: player.x,
        //         y: player.y
        //     }, Constants.commands.sync);
        // }
        
        return;
    }

    console.log(`received a message: ${event.data}`);
}

export function sendToServer(dataStruct, messageType) {
    const json = JSON.stringify(dataStruct)
    console.log(`Send to server json sent: ${json}`);
    socket.send(messageType + json);
}