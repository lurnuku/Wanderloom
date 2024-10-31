import http from 'http'
import { WebSocketServer } from 'ws'


const server = http.createServer()
const wsServer = new WebSocketServer({ server })

server.listen(8000, () => {
    console.log('WebSocket servwer is running on port 8000')
})