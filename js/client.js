class Client {
  constructor(host, port) {
    this.socket = net.createConnection({ port, host }, () => {
      console.log("✅ Connected to server");
    });

    this.socket.on("data", (data) => {
      const packet = decodePacket(data);
      if (this.onMessage) this.onMessage(packet); // run external callback
    });

    this.socket.on("end", () => {
      console.log("❌ Disconnected from server");
    });
  }

  send(packet) {
    this.socket.write(encodePacket(packet));
  }
}

module.exports = Client;
