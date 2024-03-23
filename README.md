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


Tiled app
Store the input and execute each tick
Send data of each player down at the end of each tick

DOCS:
Client/Socket connection id is generated on the server
From 1 to 1000 CAN CAUSE COLLISIONS
Client always connects with the ID of 0
And gets the ID from the server
Probably should make user db, for now it's overkill

For bullets spawn can use a list of objects
Check the index and allow only bullets id or something


Rendering
https://developer.ibm.com/tutorials/wa-canvashtml5layering/
https://web.dev/articles/canvas-performance
