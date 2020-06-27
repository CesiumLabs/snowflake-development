const Discord = require("discord.js");

module.exports.run = (client, message, args) => {
    let hidden = ["eval", "exec", "queue", "approve", "decline"];
    let cmd = client.commands.filter(c => !hidden.includes(c.help.name));
    const emb = new Discord.MessageEmbed()
    .setTitle("Commands")
    .setDescription(Array.from(new Set(cmd.map(m => m.help.name))).map(m => `\`${m}\``).join(", "))
    .setColor(0x4D5E94)

    return message.channel.send(emb);
}

module.exports.help = {
    name:  "help",
    aliases: []
}