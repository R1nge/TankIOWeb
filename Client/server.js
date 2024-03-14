let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

socket.onopen = function(e) {
    socket.send("Client connected");
};

socket.onmessage = function(event) {
    console.log(event.data);
}