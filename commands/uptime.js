const Discord = require("discord.js");
const moment = require('moment');
require('moment-duration-format');

module.exports.run = async (client, message, args) => {
  const duration = moment.duration(client.uptime).format(' D [Days], H [Hours], m [Minutes], s [Seconds]');
        const embed = new Discord.MessageEmbed()
            .setColor('RANDOM')
            .setAuthor('BOT UPTIME')
            .setThumbnail(`${client.user.displayAvatarURL(({ dynamic: true }))}`)
            .addField("Uptime:", `${duration}`)
            .setFooter(`${client.user.username}`, `${client.user.displayAvatarURL({ dynamic: true })}`)
            .setTimestamp()
        return message.channel.send(embed);
}

module.exports.help = {
  name: "uptime",
  aliases: ["ut"]
}