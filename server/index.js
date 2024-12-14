const http = require('http')
const { WebSocketServer } = require('ws')

const url = require('url')

const uuidv4 = require('uuid').v4


const server = http.createServer()
const wsServer = new WebSocketServer({ server })

server.listen(8000, () => {
    console.log('WebSocket server is running on port 8000')
})

const connections = {}
const users = {}

const broadcast = () => {
    Object.keys(connections).forEach((uuid) => {
        const connection = connections[uuid]
        const message = JSON.stringify(users)
        connection.send(message)
    })
}

const getDefaultPosition = (width, height) => ({
    x: width / 2,
    y: height / 2,
})

const handleMessage = (buffer, uuid) => {
    const message = JSON.parse(buffer.toString())

    if (message.width && message.height && !users[uuid].position) {
        users[uuid].position = getDefaultPosition(message.width, message.height)
    } else if (message.x !== undefined && message.y !== undefined) {
        // Only update position, preserve other user properties
        users[uuid].position = {
            x: message.x,
            y: message.y
        }
    }

    broadcast()
}

const handleClose = (uuid) => {
    delete connections[uuid]
    delete users[uuid]

    broadcast()
}

wsServer.on('connection', (connection, request) => {
    const { username, playerColor } = request && url.parse(request.url, true).query
    const uuid = uuidv4()

    connections[uuid] = connection

    users[uuid] = users[uuid] || {
        username,
        position: null,
        playerColor,
    }

    connection.send(JSON.stringify(users))
    connection.on('message', (message) => { handleMessage(message, uuid) })
    connection.on('close', () => handleClose(uuid))
})