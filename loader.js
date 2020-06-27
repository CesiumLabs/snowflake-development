const fs = require("fs");

module.exports = (client) => {
    client.syncDatabase = () => {
        let bots = [];
        client.db.all().filter(d => d.ID.startsWith("bot_")).forEach(a  => bots.push(client.db.get(a.ID)));
        if (bots.length < 1) return;
        bots.forEach(async bot => {
            let Bot = await client.users.fetch(bot.id).catch(e => {});
            if (Bot) {
                client.db.set(bot.ID + ".avatarURL", Bot.displayAvatarURL({ format: "jpg" }));
                client.db.set(bot.ID + ".username", Bot.username);
                client.db.set(bot.ID + ".tag", Bot.discriminator);
                let owner = await client.users.fetch(bot.owner.id).catch(e => { });
                client.db.set(bot.ID+".owner", {
                    id: owner.id,
                    username: owner.username,
                    discriminator: owner.discriminator,
                    avatar: owner.displayAvatarURL({ format: "png" })
                })
            }
        });
    };
    fs.readdir("./commands/", (err, files) => {
        if (err) throw new Error(err);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            let cmd = require("./commands/"+file);
            client.commands.set(cmd.help.name, cmd);
            cmd.help.aliases.forEach(c => client.commands.set(c, cmd));
        });
    });
    require("./web/index");
};