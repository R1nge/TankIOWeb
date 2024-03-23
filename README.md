# TankIOWeb

Websockets + GO - backend
Vanilla js - frontend

Get input from the browser in js
Send it to GO using web socket
Execute the input on the GO side
Send updated info to the js



Store map on the server as an array of `Item codes`
When player connects send it to him
Save it on the client and render


So I need a db with the images??
Like, a map of images and id's


Have a json db
+ Allow for a map editor
+ Easy to setup
+ Shared between server and client
- Possibly network heavy


TODO:

Handle close connection - send leave message

Use connection id from a socket connection
Tiled app
Server tickrate
Store the input and execute each tick
Send data of each player down at the end of each tick

Rendering
https://developer.ibm.com/tutorials/wa-canvashtml5layering/
https://web.dev/articles/canvas-performance
