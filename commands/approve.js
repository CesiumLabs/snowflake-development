const discord = require("discord.js");

module.exports.run = (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD")) return;
    if (message.guild.id !== client.testGuild.id) return;
    let bot = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!bot || !bot.user.bot) return message.reply("Please specify a bot!");
    let queue = [];
    client.db.all().filter(d => d.ID.startsWith("bot_")).forEach(c => queue.push(client.db.get(c.ID)));
    queue = queue.filter(i => !i.approved);
    if (queue.length < 1) return message.reply("Queue is empty");
    if (!queue.find(i => i.id === bot.id)) return message.reply("That bot is not in the queue!");
    if (!message.guild.members.cache.get(bot.id)) return message.reply("Bot is not in this server.");
    client.db.set(`bot_${bot.id}.approved`, true);
    let i = client.db.set(`bot_${bot.id}.approvedAt`, new Date());
    client.db.set(`bot_${bot.id}.approvedTimestamp`, Date.now());
    i.exc = message.author;
    client.emit("approve", i);
    bot.kick("Approved by "+i.exc.tag).catch(e => {});
}

module.exports.help = {
    name: "approve",
    aliases: []
}