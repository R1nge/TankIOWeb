package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"server/m/v2/utils"
	"strings"
)

var tickrate = 60
var connections = make(map[*websocket.Conn]bool)
var broadcast = make(chan []byte)

func handleConnections() {
    for {
        conn := <-broadcast
        for client := range connections {
            err := client.WriteMessage(1, conn)
            if err != nil {
                fmt.Println(err)
                client.Close()
                delete(connections, client)
            }
        }
    }
}

func main() {
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

var boundary = structs.Boundaries{10, 10, 790, 590}

func listen(conn *websocket.Conn) {
	for {
		messageType, messageContent, err := conn.ReadMessage()

		if err != nil {
			log.Println(err)
			return
		}

		fmt.Println("\n")

		fmt.Println("Received message:", string(messageContent))
		commandType := strings.Split(string(messageContent), "{")[0]
		fmt.Println("Command type:", commandType)
		command := strings.Split(string(messageContent), "{")[1]
		command = "{" + command
		fmt.Println("Command:", command)

		switch commandType {
		case "Join":
			join(command, conn)
			break
		case "Create":
			create(command, messageType, conn)
			break
		case "Move":
			move(command, messageType, conn)
			break
		case "Sync":
			sync(messageType, conn)
			break
		default:
			fmt.Println("Unknown command type:", commandType)
		}

		sync(messageType, conn)
	}
}

func sync(messageType int, conn *websocket.Conn) {
	fmt.Println("Syncing")

	playerValues := make([]structs.Player, 0, len(players))

	for _, v := range players {
		playerValues = append(playerValues, *v)
		break
	}
    
    values, _ := json.Marshal(playerValues[0])
    
    fmt.Println("Values:", string(values))
    
    messageResponse := fmt.Sprintf("Sync: %s", string(values))
    
    for connection := range connections {
        if err := connection.WriteMessage(messageType, []byte(messageResponse)); err != nil {
            log.Println(err)
            return
        }    
    } 
}

func join(command string, conn *websocket.Conn) {
	var data structs.Player
	json.Unmarshal([]byte(string(command)), &data)
	fmt.Println("Player joined with ID:", data.ID)
	fmt.Println("Player joined with Name:", data.Name)
	addPlayer(data)

	dataJson, _ := json.Marshal(players)

	messageResponse := fmt.Sprintf("Join: %s", dataJson)
	
	connections[conn] = true

	if err := conn.WriteMessage(1, []byte(messageResponse)); err != nil {
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

func move(command string, messageType int, conn *websocket.Conn) {
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

	fmt.Printf("ID: %d ", data.ID)
	fmt.Printf("Horizontal: %f ", data.Horizontal)
	fmt.Printf("Vertical: %f ", data.Vertical)
	fmt.Printf("IsShooting: %t ", data.IsShooting)
	fmt.Printf("MouseX: %f ", data.MousePositionX)
	fmt.Printf("MouseY: %f ", data.MousePositionY)

	player := getPlayer(data.ID)

	if player == nil {
		fmt.Println("Player not found")
		return
	}

	player.Speed = 5

	if player.PositionX+player.Speed*int(data.Horizontal) > boundary.MinX && player.PositionX+player.Speed*int(data.Horizontal) < boundary.MaxX {
		player.PositionX += player.Speed * int(data.Horizontal)
	}

	if player.PositionY-player.Speed*int(data.Vertical) > boundary.MinY && player.PositionY-player.Speed*int(data.Vertical) < boundary.MaxY {
		player.PositionY -= player.Speed * int(data.Vertical)
	}

	fmt.Println("Player position:", player.PositionX, player.PositionY)

	dataJson, _ := json.Marshal(player)

	messageResponse := fmt.Sprintf("Move: %s", dataJson)

	if err := conn.WriteMessage(messageType, []byte(messageResponse)); err != nil {
		log.Println(err)
		return
	}
}
