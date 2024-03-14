package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
    "encoding/json"

	"github.com/gorilla/websocket"
)

func main() {
    var upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
    
    upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	
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

func listen(conn *websocket.Conn) {
	for {
		// read a message
		messageType, messageContent, err := conn.ReadMessage()
		timeReceive := time.Now()
		if err != nil {
			log.Println(err)
			return
		}
		
		fmt.Println("\n")
		
		fmt.Println("Received message:", string(messageContent))
		
        var data playerInput
		json.Unmarshal([]byte(string(messageContent)), &data)
		
		if data.Horizontal > 1 {
            data.Horizontal = 1
        }
            
        if data.Horizontal < 0 {
            data.Horizontal = 0
        }
        
        if data.Vertical > 1 {
            data.Vertical = 1
        }
        
        if data.Vertical < 0 {
            data.Vertical = 0
        }

        fmt.Printf("Horizontal: %f ", data.Horizontal)
        fmt.Printf("Vertical: %f ", data.Vertical)
        fmt.Printf("IsShooting: %t ", data.IsShooting)
        fmt.Printf("MouseX: %f ", data.MousePositionX)
        fmt.Printf("MouseY: %f ", data.MousePositionY)

		// just echo the received message
		messageResponse := fmt.Sprintf("Your message is: %s. Time received : %v", messageContent, timeReceive)

		if err := conn.WriteMessage(messageType, []byte(messageResponse)); err != nil {
			log.Println(err)
			return
		}
	}
}


type playerInput struct {
    Horizontal float64 `json:"horizontal"`
    Vertical float64 `json:"vertical"`
    IsShooting bool `json:"isShooting"`
    MousePositionX float64 `json:mousePositionX`
    MousePositionY float64 `json:mousePositionY`
}