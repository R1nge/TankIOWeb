package structs

import (
    "sync"
    "github.com/gorilla/websocket"
)

type PlayerInput struct {
	ID             int     `json:"id"`
	Horizontal     float64 `json:"horizontal"`
	Vertical       float64 `json:"vertical"`
	IsShooting     bool    `json:"isShooting"`
	MousePositionX float64 `json:"mousePositionX"`
	MousePositionY float64 `json:"mousePositionY"`
}

type Player struct {
	ID        int     `json:"id"`
	PositionX int     `json:"x"`
	PositionY int     `json:"y"`
	Rotation  float64 `json:"rotationAngle"`
	Name      string  `json:"name"`
	Speed     int
	Collider  BoxCollider
}

type Vector2Int struct {
    X int `json:"x"`
    Y int `json:"y"`
}

type Object struct {
	ID        int `json:"id"`
	PositionX int `json:"x"`
	PositionY int `json:"y"`
}

type Boundaries struct {
	MinX int
	MinY int
	MaxX int
	MaxY int
}

type BoxCollider struct {
    //Kinda the center of the box
    Position  Vector2Int
    Start     Vector2Int
    End       Vector2Int
}

type Connection struct {
	Socket *websocket.Conn
	Mu     sync.Mutex
}
