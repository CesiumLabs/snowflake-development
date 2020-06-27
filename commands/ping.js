module.exports.run = (client, message, args) => {
    message.channel.send(`Pong! ${client.ws.ping ? Math.ceil(client.ws.ping) : 0}ms`);
}

module.exports.help = {
    name:  "ping",
    aliases: ["pong"]
}