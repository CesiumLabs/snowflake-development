let Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
  let docs = client.docs(args[1] && args[1] == "--guild");
  let search = args[0];
  let flag = args[1] || "--global";
  if (!search) return message.channel.send("Cant search air.");
  let hasDocs = docs.some(d => d.keywords.includes(search.toLowerCase()));
  if (!hasDocs) return message.channel.send("No docs found for `" + search + "`");
  let data = docs.filter(d => d.keywords.includes(search.toLowerCase()))[0];
  let embed = new Discord.MessageEmbed();
  embed.setAuthor("quick.eco");
  if (data.function && data.function !== null) embed.setTitle(data.function);
  embed.setDescription(data.description);
  if (flag == "--guild" && data.isEco == true) {
    let i = data.params.shift();
    data.params.unshift({
      name: "guildid", type: "string", description: "Guild ID"
    });
    data.params.unshift(i);
  }
  data.params.forEach(c => {
    embed.addField(
      "Parameter",
      `**__${c.name}__**: \`${c.type}\` - **${c.description}**`
    );
  });
  embed.addField("Returns", "`" + data.returns + "`");
  embed.addField("Example", "```js\n" + data.example + "```");
  embed.setFooter(`${data.type.replace("Properties", "property")}`);
  embed.setTimestamp();
  embed.setColor("#4E5D94");

  return message.channel.send(embed);
};

module.exports.help = {
  name: "eco",
  aliases: ["quick.eco", "quickeco", "ecodocs", "docs"]
};