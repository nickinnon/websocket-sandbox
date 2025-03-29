# Websocket Sandbox
 
 This poject uses `ws` to configure a basic Websocket server. [Documentation can be found here](https://github.com/websockets/ws/blob/HEAD/doc/ws.md#event-headers)

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


