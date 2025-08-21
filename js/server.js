const WebSocket = require("ws")
const server = new WebSocket.Server({port: 2008});


server.on("connection", ws => {
  ws.on("message", msg => {
    console.log("Received ", msg.toString());
    // handle(msg);
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });


    server.on("close", () => {
          console.log('Client disconnected');
    })
  })
})
