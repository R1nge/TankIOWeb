let socket = new WebSocket("ws://localhost:8080", "echo-protocol");

socket.onopen = function(e) {
    alert("[open] Connection established");
    alert("Sending to server");
    socket.send("My name is John");
};