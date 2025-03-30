# Websocket Sandbox
 
 This poject uses `ws` to configure a basic Websocket server. [Documentation can be found here](https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-headers)

 ## Demo
 Clients are identified with a Base64 Bearer Token in headers. Example tokens are logged on startup, and can be passed to your TCP client to establish a connection.

 On startup, the server will log a GUID `roomId`, which is the global ID for chat all users are added to on initial connection.

 In your TCP client, connect with a Bearer Token. Once connected, you can broadcast a message to the global channel with a JSON push.

 ```JSON
 {
    "type": "rooms/message",
    "roomId": "aeea2113-3a11-4041-9b41-d88c93eb9315",
    "message": "This is Alice."
}
 ```

 ## Development
 It is highly reccomended to use Docker + Dev Containers, which will configure your development environment automatically. The DevContainer will inherit your .gitconfig from your hostmachine at runtime.
 
 You're also welcome to run this on your host machine without a container. The prerequisites to do so can be pulled from the base image in `/.devcontainer`.

### Prerequisites
1) Docker: Installed on host machine via your method of choice. This app was developed with Docker Desktop on OSX.
2) Dev Containers: This app was developed with VSCode Dev Container Plugin.
3) TCP Client: This app was developed with Postman.

### Running the WebSocket Server
1) Run the dev container
2) In the container's shell, run `npm run dev`
3) Connect to `ws://localhost:8080` with your TCP client of choice.


