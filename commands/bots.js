const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    let user = message.mentions.members.first() || match(args.join(" "), message) || message.member;

    let bots = [];
    client.db.all().filter(b => b.ID.startsWith("bot_")).forEach(i => bots.push(client.db.get(i.ID)));
    bots = bots.filter(i => i.owner.id === user.id);
    if (bots.length < 1) return message.reply("That user has no bots.");

    const embed = new MessageEmbed()
    .setTitle(`Bots of ${user.user.tag}`)
    .setDescription(bots.map(m => `<@${m.id}> **[\`${m.username}#${m.discriminator}\`]**`).join("\n"))
    .setColor("#4D5E94")
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL())
    return message.channel.send(embed);
}

function match(q, msg) {
  if (!q) return undefined;
  let c = msg.guild.members.cache;
  let filtered = (
    c.get(q) || 
    c.find(m => m.user.username.toLowerCase() === q.toLowerCase()) ||
    c.find(m => m.user.username.toLowerCase().startsWith(q.toLowerCase())) ||
    c.find(m => m.user.username.toLowerCase().includes(q.toLowerCase())) ||
    c.find(m => m.displayName.toLowerCase() === q.toLowerCase()) ||
    c.find(m => m.displayName.toLowerCase().startsWith(q.toLowerCase())) ||
    c.find(m => m.displayName.toLowerCase().includes(q.toLowerCase()))
  );
  if (!filtered) return undefined;
  return filtered;
}

module.exports.help = {
    name:  "bots",
    aliases: ["bot"]
}