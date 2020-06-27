const fetch = require("node-fetch");
const turndown = new (require("turndown"))();
const { MessageEmbed } = require("discord.js");

module.exports = {
  help: {
    name: "mdn",
    aliases: ["js"]
  },
  run: async (client, message, args) => {
    const search = args[0];
    if (!search) return message.channel.send("❌ What are you searching?");

    fetch(
      `https://mdn.pleb.xyz/search?q=${encodeURIComponent(search.replace(/#/g, ".prototype."))}`
    )
      .then(res => res.json())
      .then(body => {
        if (!body.URL || !body.Title || !body.Summary) {
          const embed = new MessageEmbed()
          .setColor("#4e5d94")
          .setAuthor(
            "MDN Web Docs",
            "https://i.imgur.com/DFGXabG.png",
            "https://developer.mozilla.org/"
          )
          .setURL(`https://developer.mozilla.org`)
          .setTitle(search.replace(/#/g, ".prototype."))
          .setTimestamp()
          .setFooter("Snowflake Development ❄️")
          .setDescription("No results.");
        return message.channel.send(embed);
        }
        turndown.addRule("hyperlink", {
          filter: "a",
          replacement: (text, node) =>
            `**[${text}](https://developer.mozilla.org${node.href})**`
        });
        const summary = body.Summary.replace(
          /<code><strong>(.+)<\/strong><\/code>/g,
          "<strong><code>$1</code></strong>"
        );
        const embed = new MessageEmbed()
          .setColor("#4e5d94")
          .setAuthor(
            "MDN Web Docs",
            "https://i.imgur.com/DFGXabG.png",
            "https://developer.mozilla.org/"
          )
          .setURL(`https://developer.mozilla.org${body.URL}`)
          .setTitle(body.Title)
          .setTimestamp()
          .setFooter("Snowflake Development ❄️")
          .setDescription(turndown.turndown(summary));
        message.channel.send(embed);
      })
      .catch(e => {
        const embed = new MessageEmbed()
          .setColor("#4e5d94")
          .setAuthor(
            "MDN Web Docs",
            "https://i.imgur.com/DFGXabG.png",
            "https://developer.mozilla.org/"
          )
          .setURL(`https://developer.mozilla.org`)
          .setTitle(search.replace(/#/g, ".prototype."))
          .setTimestamp()
          .setFooter("Snowflake Development ❄️")
          .setDescription("No results.");
        return message.channel.send(embed);
      });
  }
};