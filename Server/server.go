package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"math"
	"math/rand"
	"net/http"
	"server/m/v2/utils"
	"strings"
	"time"
)

var tickrate = 60
var connections = make(map[*structs.Connection]bool)

func main() {
	fmt.Println("Starting server...")

	var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		websocket, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}
		log.Println("Websocket Connected!")
		listen(websocket)
	})
	http.ListenAndServe(":8080", nil)
}

var players = make(map[int]*structs.Player)

func addPlayer(player structs.Player) {
	fmt.Println("Adding player:", player)
	players[player.ID] = &player

	for k, v := range players {
		fmt.Println(k, v)
	}
}

func removePlayer(id int) {
	if players[id] == nil {
		fmt.Println("Player not found:", id)
		return
	}
	fmt.Println("Removing player:", id)
	delete(players, id)
}

func getPlayer(id int) *structs.Player {
	return players[id]
}

var objects = make(map[int]*structs.Object)

func addObject(object structs.Object) {
	fmt.Println("Adding object:", object)
	objects[object.ID] = &object

	for k, v := range objects {
		fmt.Println(k, v)
	}
}



func removeObject(id int) {
	delete(objects, id)
}

func getObject(id int) *structs.Object {
	return objects[id]
}

var boundary = structs.Boundaries{10, 10, 1910, 1070}

func listen(conn *websocket.Conn) {
    connection := &structs.Connection{
        Socket: conn,
        ID:     randInt(1, 1000),
    }

    fmt.Println("Connection ID:", connection.ID)

    connections[connection] = true
    disconnectChan := make(chan *structs.Connection)
    messageChan := make(chan string)

    // Goroutine to handle incoming messages
    go func() {
        for {
            messageType, messageContent, err := conn.ReadMessage()
            if err != nil {
                log.Println(err)
                disconnectChan <- connection
                break
            }

            // Process the message and send a response to the messageChan
            processMessage(messageType, messageContent, connection, messageChan)
        }
    }()

    // Goroutine to handle disconnects and broadcast messages
    go func() {
        for {
            select {
            case <-disconnectChan:
                removePlayer(connection.ID)
                connections[connection] = false
                delete(connections, connection)
                broadcastMessage(fmt.Sprintf("Player leaved with ID: %d", connection.ID))
                return // Ends the goroutine
            case msg := <-messageChan:
                broadcastMessage(msg)
            }
        }
    }()
}

func broadcastMessage(message string) {
    for connection := range connections {
        if err := connection.Socket.WriteMessage(1, []byte(message)); err != nil {
            log.Println(err)
        }
    }
}

func processMessage(messageType int, messageContent []byte, connection *structs.Connection, messageChan chan string) {
    fmt.Println("Received message:", string(messageContent))
    commandType := strings.Split(string(messageContent), "{")[0]
    command := "{" + strings.SplitN(string(messageContent), "{", 2)[1]

    switch commandType {
    case "Join":
        join(command, connection)
    case "Create":
        create(command, messageType, connection.Socket)
    case "Move":
        move(command, messageType, connection)
    case "Leave":
        leave(command, messageType, connection)
    case "Shoot":
        shoot(command, messageType, connection.Socket)
    default:
        fmt.Println("Unknown command type:", commandType)
    }

    sync(messageType, connection)
    messageChan <- "Processed message for connection ID: " + fmt.Sprintf("%d", connection.ID)
}

func leave(command string, messageType int, conn *structs.Connection) {
	var data structs.Player
	json.Unmarshal([]byte(string(command)), &data)
	fmt.Println("Player leaved with ID:", data.ID)

	dataJson, _ := json.Marshal(players[data.ID])

	messageResponse := fmt.Sprintf("Leave: %s", string(dataJson))

	fmt.Println("Sending message: %s", string(dataJson))

	for connection := range connections {
		if err := connection.Socket.WriteMessage(messageType, []byte(messageResponse)); err != nil {
			log.Println(err)
			return
		}
	}

	removePlayer(data.ID)
	connections[conn] = false
	delete(connections, conn)
	//conn.Socket.Close()
}

func sync(messageType int, conn *structs.Connection) {

	if len(players) == 0 {
		fmt.Println("No players")
		return
	}

	fmt.Println("Syncing")

	playerValues := make([]structs.Player, 0, len(players))

	for _, v := range players {
		playerValues = append(playerValues, *v)
	}

	values, _ := json.Marshal(playerValues)

	fmt.Println("Values:", string(values))

	messageResponse := fmt.Sprintf("Sync: %s", string(values))

	for connection := range connections {
		if connections[conn] == false {
			fmt.Println("Connection closed")
			continue
		}

		if err := connection.Socket.WriteMessage(messageType, []byte(messageResponse)); err != nil {
			log.Println(err)
			return
		}
	}
}

// Random int fun
func randInt(min int, max int) int {
	rand.Seed(time.Now().UnixNano())
	return min + rand.Intn(max-min)
}

func join(command string, conn *structs.Connection) {
	var data structs.Player
	json.Unmarshal([]byte(string(command)), &data)
	data.ID = conn.ID
	fmt.Println("Player joined with ID:", data.ID)
	fmt.Println("Player joined with Name:", data.Name)

	data.PositionX = randInt(10, 1910)
	data.PositionY = randInt(10, 1070)

	fmt.Println("Player joined with Position:", data.PositionX, data.PositionY)
	
	fmt.Println("Player joined: %s", data)

	data.Collider = structs.BoxCollider{structs.Vector2Int{data.PositionX, data.PositionY}, structs.Vector2Int{128, 128}}

	addPlayer(data)
	
	// Create an array only with values
    playersValues := make([]structs.Player, 0, len(players))
    
    for _, v := range players {
        playersValues = append(playersValues, *v)
    }

	dataJson, _ := json.Marshal(playersValues)

	messageResponse := fmt.Sprintf("Join: %s", dataJson)

	connections[conn] = true

	if err := conn.Socket.WriteMessage(1, []byte(messageResponse)); err != nil {
		log.Println(err)
		return
	}
}

func create(command string, messageType int, conn *websocket.Conn) {
	var data structs.Object
	json.Unmarshal([]byte(string(command)), &data)
	fmt.Println("Object created with ID:", data.ID)
	fmt.Println("Object created with Position:", data.PositionX, data.PositionY)
	addObject(data)

	dataJson, _ := json.Marshal(data)

	messageResponse := fmt.Sprintf("Create: %s", dataJson)

	fmt.Println("Sending message: %s", dataJson)

	if err := conn.WriteMessage(messageType, []byte(messageResponse)); err != nil {
		log.Println(err)
		return
	}
}

func move(command string, messageType int, conn *structs.Connection) {
	var data structs.PlayerInput

	json.Unmarshal([]byte(string(command)), &data)

	if data.Horizontal > 1 {
		data.Horizontal = 1
	}

	if data.Horizontal < -1 {
		data.Horizontal = -1
	}

	if data.Vertical > 1 {
		data.Vertical = 1
	}

	if data.Vertical < -1 {
		data.Vertical = -1
	}

	fmt.Printf("ID: %d ", conn.ID)
	fmt.Printf("Horizontal: %f ", data.Horizontal)
	fmt.Printf("Vertical: %f ", data.Vertical)
	fmt.Printf("IsShooting: %t ", data.IsShooting)
	fmt.Printf("MouseX: %f ", data.MousePositionX)
	fmt.Printf("MouseY: %f ", data.MousePositionY)

	player := getPlayer(conn.ID)

	if player == nil {
		fmt.Println("\n Player not found")
		return
	}

	player.Speed = 5

	previousX := player.PositionX
	previousY := player.PositionY

	canMoveX := false
	canMoveY := false

	if player.PositionX+player.Speed*int(data.Horizontal) > boundary.MinX && player.PositionX+player.Speed*int(data.Horizontal) < boundary.MaxX {
		canMoveX = true
	}

	if player.PositionY-player.Speed*int(data.Vertical) > boundary.MinY && player.PositionY-player.Speed*int(data.Vertical) < boundary.MaxY {
		canMoveY = true
	}

	for k, v := range players {
		if k == player.ID {
			continue
		}

		futurePositionX := player.PositionX + player.Speed*int(data.Horizontal)
		futurePositionY := player.PositionY - player.Speed*int(data.Vertical)

		playerMinX := futurePositionX - player.Collider.Size.X/2
		playerMaxX := futurePositionX + player.Collider.Size.X/2
		playerMinY := futurePositionY - player.Collider.Size.Y/2
		playerMaxY := futurePositionY + player.Collider.Size.Y/2

		otherPlayerMinX := v.PositionX - v.Collider.Size.X/2
		otherPlayerMaxX := v.PositionX + v.Collider.Size.X/2
		otherPlayerMinY := v.PositionY - v.Collider.Size.Y/2
		otherPlayerMaxY := v.PositionY + v.Collider.Size.Y/2

		if playerMaxX > otherPlayerMinX &&
			playerMinX < otherPlayerMaxX &&
			playerMaxY > otherPlayerMinY &&
			playerMinY < otherPlayerMaxY {

			canMoveX = false
			canMoveY = false
			break // Once a collision is detected, no need to check further
		}
	}

	fmt.Println("\n Collider position: ", player.Collider.Position.X, player.Collider.Position.Y)
	//fmt.Println("\n Collider boundaries: ", player.Collider.Position.X-player.Collider.Start.X, player.Collider.Position.Y-player.Collider.Start.Y, player.Collider.Position.X+player.Collider.End.X, player.Collider.Position.Y+player.Collider.End.Y)

	if canMoveX {
		player.PositionX += player.Speed * int(data.Horizontal)
		player.Collider.Position.X = player.PositionX + (player.Collider.Size.X / 2)
	}
	if canMoveY {
		player.PositionY -= player.Speed * int(data.Vertical)
		player.Collider.Position.Y = player.PositionY + (player.Collider.Size.Y / 2)
	}

	//Rotate right
	if previousX < player.PositionX {
		player.Rotation = 0
	}

	//Rotate left
	if previousX > player.PositionX {
		player.Rotation = math.Pi
	}

	//Rotate Down
	if previousY < player.PositionY {
		player.Rotation = math.Pi / 2
	}

	//Rotate Up
	if previousY > player.PositionY {
		player.Rotation = -math.Pi / 2
	}

	fmt.Println("Player position:", player.PositionX, player.PositionY)

	dataJson, _ := json.Marshal(player)

	messageResponse := fmt.Sprintf("Move: %s", dataJson)

	if err := conn.Socket.WriteMessage(messageType, []byte(messageResponse)); err != nil {
		log.Println(err)
		return
	}
}

func shoot (command string, messageType int, conn *websocket.Conn) {

    var data structs.PlayerInput
    json.Unmarshal([]byte(string(command)), &data)
    
    player := getPlayer(data.ID)
    
    if player == nil {
        fmt.Println("Player not found")
        return
    }
    
    data.IsShooting = true
    
    dataJson, _ := json.Marshal(player)
    
    messageResponse := fmt.Sprintf("Shoot: %s", dataJson)
    
    if err := conn.WriteMessage(messageType, []byte(messageResponse)); err != nil {
        log.Println(err)
        return
    }
}