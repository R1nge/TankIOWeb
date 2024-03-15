package main

import (
    "fmt"
    "log"
    "net/http"
    "encoding/json"
    "strings"

    "github.com/gorilla/websocket"
)

func main() {
    var upgrader = websocket.Upgrader {
        ReadBufferSize: 1024,
        WriteBufferSize: 1024,
        CheckOrigin: func(r * http.Request) bool {
                 return true
        },
    }

    http.HandleFunc("/", func(w http.ResponseWriter, r * http.Request) {

        websocket, err:= upgrader.Upgrade(w, r, nil)
        if err != nil {
            log.Println(err)
            return
        }
        log.Println("Websocket Connected!")
        listen(websocket)
    })
    http.ListenAndServe(":8080", nil)
}

var players = make(map[int]*player)


func addPlayer (player player) {
    fmt.Println("Adding player:", player)
    players[player.ID] = &player
    
    
    for k, v := range players {
        fmt.Println(k, v)
    }
}

func removePlayer (id int) {
    delete(players, id)
}

func getPlayer(id int) *player {
    return players[id]   
}

var objects = make(map[int]*object)

func addObject (object object) {
    fmt.Println("Adding object:", object)
    objects[object.ID] = &object
    
    for k, v := range objects {
        fmt.Println(k, v)
    }
}

func removeObject (id int) {
    delete(objects, id)
}

func getObject(id int) *object {
    return objects[id]
}

//Create boundaries struct
var boundary = boundaries{10, 10, 790, 590}

func listen(conn * websocket.Conn) {
    for {
        messageType, messageContent, err:= conn.ReadMessage()

        if err != nil {
            log.Println(err)
            return
        }

        fmt.Println("\n")

        fmt.Println("Received message:", string(messageContent))
        commandType:= strings.Split(string(messageContent), "{")[0]
        fmt.Println("Command type:", commandType)
        command:= strings.Split(string(messageContent), "{")[1]
        command = "{" + command
        fmt.Println("Command:", command)

        if commandType == "Join" {
           join(command, conn)
        } else if commandType == "Create"{
           create(command, messageType, conn)
        } else if commandType == "Move" {
           move(command, messageType, conn)
        } else {
            fmt.Println("Unknown command type:", commandType)
        }
    }
}


func join(command string, conn * websocket.Conn){
 var data player
            json.Unmarshal([]byte(string(command)), &data)
            fmt.Println("Player joined with ID:", data.ID)
            fmt.Println("Player joined with Name:", data.Name)
            addPlayer(data)
}

func create(command string, messageType int, conn * websocket.Conn){
     var data object
                json.Unmarshal([]byte(string(command)), &data)
                fmt.Println("Object created with ID:", data.ID)
                fmt.Println("Object created with Position:", data.PositionX, data.PositionY)
                addObject(data)
                
                dataJson, _:= json.Marshal(data)
                
                messageResponse:= fmt.Sprintf("Create: %s", dataJson)
                            
                fmt.Println("Sending message: %s", dataJson)
                
                if err:= conn.WriteMessage(messageType, []byte(messageResponse));
                err != nil {
                    log.Println(err)
                    return
                }
}

func move(command string, messageType int, conn * websocket.Conn){
 var data playerInput

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

            fmt.Printf("Horizontal: %f ", data.Horizontal)
            fmt.Printf("Vertical: %f ", data.Vertical)
            fmt.Printf("IsShooting: %t ", data.IsShooting)
            fmt.Printf("MouseX: %f ", data.MousePositionX)
            fmt.Printf("MouseY: %f ", data.MousePositionY)
            
            player := getPlayer(0)
            player.Speed = 5
            
            if player == nil {
                fmt.Println("Player not found")
                return
            }   
            
            if player.PositionX + player.Speed * int(data.Horizontal) > boundary.MinX && player.PositionX + player.Speed * int(data.Horizontal) < boundary.MaxX {
                player.PositionX += player.Speed * int(data.Horizontal)              
            }

            if player.PositionY - player.Speed * int(data.Vertical) > boundary.MinY && player.PositionY - player.Speed * int(data.Vertical) < boundary.MaxY {
                player.PositionY -= player.Speed * int(data.Vertical)
            }
            
            fmt.Println("Player position:", player.PositionX, player.PositionY)

            dataJson, _:= json.Marshal(player)

            messageResponse:= fmt.Sprintf("Move: %s", dataJson)

            if err:= conn.WriteMessage(messageType, []byte(messageResponse));
            err != nil {
                log.Println(err)
                return
            }
}


type playerInput struct {
    Horizontal float64 `json:"horizontal"`
    Vertical float64 `json:"vertical"`
    IsShooting bool `json:"isShooting"`
    MousePositionX float64 `json:"mousePositionX"`
    MousePositionY float64 `json:"mousePositionY"`
}

type player struct {
    ID int `json:"id"`
    PositionX int `json:"x"`
    PositionY int `json:"y"`
    Name string `json:"name"`
    Speed int
}

type object struct {
    ID int `json:"id"`
    PositionX int `json:"x"`
    PositionY int `json:"y"`
}

type boundaries struct {
    MinX int
    MinY int
    MaxX int
    MaxY int
}