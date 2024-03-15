package structs

type PlayerInput struct {
    Horizontal float64 `json:"horizontal"`
    Vertical float64 `json:"vertical"`
    IsShooting bool `json:"isShooting"`
    MousePositionX float64 `json:"mousePositionX"`
    MousePositionY float64 `json:"mousePositionY"`
}

type Player struct {
    ID int `json:"id"`
    PositionX int `json:"x"`
    PositionY int `json:"y"`
    Name string `json:"name"`
    Speed int
}

type Object struct {
    ID int `json:"id"`
    PositionX int `json:"x"`
    PositionY int `json:"y"`
}

type Boundaries struct {
    MinX int
    MinY int
    MaxX int
    MaxY int
}