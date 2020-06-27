const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return;
    let queue = [];
    client.db.all().filter(d => d.ID.startsWith("bot_")).forEach(c => queue.push(client.db.get(c.ID)));
    queue = queue.filter(i => !i.approved);
    if (queue.length < 1) return message.reply("Queue is empty");
    queue = queue.map(m => `**[${m.username}](${client.config.website.redirectURI.split("/authorize")[0]}/bot/${m.id})**`);
    const embed = new MessageEmbed()
    .setTitle("Snow Bot List | Queue")
    .setDescription(queue.join("\n"))
    .setColor("#4D5E94")
    .setTimestamp()

    return message.channel.send(embed);
}

module.exports.help = {
    name: "queue",
    aliases: []
}