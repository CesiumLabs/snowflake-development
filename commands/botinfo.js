const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    let user = message.mentions.members.first() || match(args.join(" "), message);
    if (!user) return message.reply("Please specify a bot!");
    if (!user.user.bot) return message.reply("Please specify a bot!");
    let bot = client.db.get(`bot_${user.id}`);
    if (bot == null) return message.reply("No bot found.");

    const embed = new MessageEmbed()
    .setAuthor(`Bot Information`)
    .setTitle(user.user.tag)
    .setThumbnail(user.user.displayAvatarURL())
    .setColor("#4D5E94")
    .setDescription(bot.short_description)
    .addField("Prefix", bot.prefix)
    .addField("Upvotes", bot.upvotes)
    if (bot.approved) embed.addField("Approved At", new Date(bot.approvedAt).toUTCString());
    if (bot.support) embed.addField("Support Server", `**[Click Here](${bot.support})**`);
    embed.addField("Invite Link", `**[Click Here](${bot.invite})**`);
    embed.addField("View On Website", `**[Click Here](${client.config.website.redirectURI.split("/authorize")[0]}/bot/${bot.id})**`);
    embed
    .addField("Owner", `<@${bot.owner.id}> **[\`${bot.owner.username}#${bot.owner.discriminator}\`]**`)
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
    name:  "botinfo",
    aliases: ["bi"]
}