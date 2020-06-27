require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client({
    fetchAllMembers: true,
    disableMentions: "everyone"
});
client.config = require("./config");
client.commands = new Discord.Collection();
client.db = require("quick.db");
client.cmdmap = new Map();
client.docs = require("./docs");

client.on("ready", async () => {
    client.db.set("destroyed", false);
    console.log("Bot is Online!");
    client.user.setActivity({
        name: "Snowflake News",
        type: "LISTENING"
    });
    require("./loader")(client);
    client.mainGuild = client.guilds.cache.get(client.config.guilds.main);
    client.testGuild = client.guilds.cache.get(client.config.guilds.testing);
    client.owner = client.guilds.cache.get(client.config.guilds.main).owner;
    client.admins = client.guilds.cache.get(client.config.guilds.main).members.cache.filter(m => !m.user.bot && m.hasPermission("ADMINISTRATOR"));
    client.mods = client.guilds.cache.get(client.config.guilds.main).members.cache.filter(m => !m.user.bot && !m.hasPermission("ADMINISTRATOR") && m.hasPermission("KICK_MEMBERS"));
    client.booster = client.guilds.cache.get(client.config.guilds.main).members.cache.filter(m => m.roles.cache.has("708292755432013894"));
    client.supporters = client.guilds.cache.get(client.config.guilds.main).members.cache.filter(m => m.roles.cache.has("724213951231164478"));
    setInterval(() => {
        client.syncDatabase();
    }, 1.8e+6);
});

function log(data, ...message) {
    let wh = new Discord.WebhookClient("723941113202737243", "Bl_0egJWNYEprxkLjG_qh7EkezgsSauF3ium8j1GlIIFG6gHXS5pmvAP7ekVOCfowPNg");
    return wh.send(...message, data).catch(e => {
        client.channels.cache.get(client.config.channels.log).send(...message);
    });
}

client.on("botAdd", data => {
    log({ username: data.username, avatarURL: data.avatarURL }, `<@${data.owner.id}> added a bot <@${data.id}> [${data.username}]\n<${client.config.website.redirectURI.split("/authorize")[0]}/bot/${data.id}>`);
});

client.on("edit", data => {
    log({ username: data.username, avatarURL: data.avatarURL }, `<@${data.exc.id}> edited a bot <@${data.id}> [${data.username}]\n<${client.config.website.redirectURI.split("/authorize")[0]}/bot/${data.id}>`);
});

client.on("vote", data => {
    log({ username: data.username, avatarURL: data.avatarURL }, `<@${data.exc.id}> voted a bot <@${data.id}> [${data.username}]\n<${client.config.website.redirectURI.split("/authorize")[0]}/bot/${data.id}/vote>`);
});

client.on("delete", data => {
    if (client.mainGuild.members.cache.get(data.id)) client.mainGuild.members.cache.get(data.id).kick(data.reason ? data.reason : "Owner deleted!").catch(e => {});
    log({ username: data.username, avatarURL: data.avatarURL }, `Bot <@${data.id}> [${data.username}] by <@${data.owner.id}> was deleted by <@${data.exc.id}>.${data.reason ? ` Reason: ${data.reason}` : ""}`);
});

client.on("approve", data => {
    log({ username: data.username, avatarURL: data.avatarURL }, `Bot <@${data.id}> [${data.username}] by <@${data.owner.id}> was approved by <@${data.exc.id}>\n<${client.config.website.redirectURI.split("/authorize")[0]}/bot/${data.id}>`);
    client.mainGuild.members.cache.get(data.owner.id).roles.add(client.config.roles.developer);
});

client.on("guildMemberAdd", (member) => {
    if (member.guild.id == client.mainGuild.id) {
        member.guild.channels.cache.get("711061446355583027").setName(`❯ Total: ${member.guild.memberCount}`).catch(e => {});
        if (member.user.bot && (client.db.get(`bot_${member.id}`) !== null && !!client.db.get(`bot_${member.id}`).approved)) {
            member.roles.add(client.config.roles.bots).catch(e => {});
        }
    }
    if (member.guild.id === client.testGuild.id) {
        if (member.user.bot && client.db.get(`bot_${member.id}`) !== null && !client.db.get(`bot_${member.id}`).verified && !client.db.get(`bot_${member.id}`).approved) {
            client.db.set(`bot_${member.id}.verified`, true);
            if (!client.db.set(`bot_${member.id}.verified`, true)) log({ username: member.user.username, avatarURL: member.user.displayAvatarURL() },`Bot <@${member.id}> [${member.user.username}] by <@${client.db.get(`bot_${member.id}`).owner.id}> has been added to the verification server!`);
        }
    }
});

client.on("guildMemberRemove", member => {
    let botsof = [];
    if (member.guild.id == client.mainGuild.id) {
      member.guild.channels.cache.get("711061446355583027").setName(`❯ Total: ${member.guild.memberCount}`).catch(e => {});
        if (member.user.bot && client.db.get(`bot_${member.id}`) !== null) {
            let bot = client.db.get(`bot_${member.id}`);
            client.db.delete(`bot_${member.id}`);
            let data = {
                exc: client.user,
                reason: "Bot left the server.",
                owner: bot.owner,
                id: member.id,
                username: member.user.username
            };
            client.emit("delete", data);
        }
        if (!member.user.bot) {
            client.db.all().filter(d => d.ID.startsWith("bot_")).forEach(i => botsof.push(client.db.get(i.ID)));
            botsof = botsof.filter(i => i.owner.id === member.user.id);
            if (botsof.length < 1) return;
            botsof.forEach(b => {
                let data = {
                    exc: client.user,
                    reason: "Owner left the server.",
                    owner: b.owner,
                    id: b.id,
                    username: b.username
                };
                client.emit("delete", data);
            });
        }
    }
});

client.on("decline", data => {
    const embed = new Discord.MessageEmbed()
        .setTitle("Bot Declined!")
        .setThumbnail(data.avatarURL)
        .addField("Bot", `<@${data.id}> [${data.username}]`, true)
        .addField("Moderator", `<@${data.exc.id}>`, true)
        .addField("Reason", data.reason || "No reason provided!", false)
        .setFooter("Snow Bot List ❄", client.user.avatarURL())
        .setTimestamp();

    log({ username: data.username, avatarURL: data.avatarURL }, `Bot <@${data.id}> [${data.username}] by <@${data.owner.id}> was declined!`, embed);
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.channel.id === "708348623347515473") counter(newMessage, client, true);
});

client.on("message", async (message) => {
    if (message.author.bot || !message.guild) return;
    if (message.channel.id == "724608503464984576") return chat(message);
    if (message.channel.id === "708348623347515473") counter(message, client, false);
    if (!message.content.startsWith("-")) return;
    let args = message.content.slice(1).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    if (!client.commands.get(cmd)) return;
    client.commands.get(cmd).run(client, message, args);
});

function counter(message, client, edit = false) {
  db = client.db;
  let channel = message.channel;
  if (edit) return block(message);
  let count = db.fetch(`counter_${message.guild.id}`);
  if (count === null)
    count = db.set(`counter_${message.guild.id}`, {
      number: 314,
      author: "687357707635654688"
    });
  if (db.get(`noc_${message.author.id}`) === true)
    return message.reply("You are blacklisted!").then(m => {
      message.delete();
      setTimeout(() => {
        m.delete();
      }, 2000);
    });
  if (!message.author.bot && message.author.id === count.author) {
    message.delete();
    message.reply("Please wait for your turn").then(m => m.delete({ timeout: 3000 }));
    return;
  }
  if (!message.author.bot && isNaN(message.content)) {
    message.delete();
    message
      .reply("messages in this channel must be a number")
      .then(m => m.delete({ timeout: 3000 }));
    return;
  }
  if (
    (!message.author.bot && parseInt(message.content) !== count.number + 1) ||
    message.content.includes(".")
  ) {
    message.delete();
    message
      .reply(`next number must be ${count.number + 1}`)
      .then(m => m.delete({ timeout: 3000 }));
    return;
  }
  count = db.set(`counter_${message.guild.id}`, {
    number: count.number + 1,
    author: message.author.id
  });
  return;
}

function block(message) {
  if (message.author.bot) return;
  let role = message.guild.roles.cache.get("715111592726888472");
  message.member.roles.add(role);
  db.set("noc_" + message.author.id, true);
  return message.react("🚫");
}

function chat(message) {
    if (!message.cleanContent) return message.channel.send("Please say something.");
    let mesg = message.cleanContent;
    message.channel.startTyping();
    require("node-fetch")(`http://api.brainshop.ai/get?bid={BRAIN_ID}&key={API_KEY}&uid=${message.author.id}&msg=${encodeURIComponent(mesg)}`)
    .then(res => res.json())
    .then(data => {
        if (!data || !data.cnt) {
          message.channel.send("I cant understand!");
          return message.channel.stopTyping(true);
        }
        message.channel.send(data.cnt.replace("(translations by Microsoft translator)", ""));
        return message.channel.stopTyping(true);
    })
    .catch(e => {
      message.channel.send("I cant understand!");
      return message.channel.stopTyping(true);
    });
    return;
}

client.login(client.config.TOKEN);

module.exports = client;

Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};