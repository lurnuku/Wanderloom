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

const handleMessage = (buffer, uuid) => {
    const message = JSON.parse(buffer.toString())
    const user = users[uuid]

    user.state = message

    broadcast()
}

const handleClose = (uuid) => {
    delete connections[uuid]
    delete users[uuid]

    broadcast()
}

wsServer.on('connection', (connection, request) => {
    const { username } = request && url.parse(request.url, true).query
    console.log(username)
    const uuid = uuidv4()

    connections[uuid] = connection

    users[uuid] = {
        username,
        state: {}
    }

    connection.on('message', (message) => {
        handleMessage(message, uuid)
    })

    connection.on('close', () => handleClose(uuid))
})