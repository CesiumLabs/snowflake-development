const Discord = require("discord.js");
const exec = require("child_process").exec;

module.exports.run = async (client, message, args) => {
    if (message.author.id !== client.owner.id) return;
    let code = args.join(" ");
    if (!code) return message.channel.send("Please specify the command!");
    
    try {
            message.channel.startTyping();
            exec(code, function (err, stdout, stderr) {
                if (err) {
                    message.channel.send(err.toString(), { code: "xl", split: true });
                    return message.channel.stopTyping(true);
                }
                message.channel.send(stdout, { code: "xl", split: true })
                .catch(err => {
                    message.channel.send(stdout, { code: "xl", split: true });
                    return message.channel.stopTyping(true);
                });
                message.channel.stopTyping(true);
            });
        } catch (err) {
            message.channel.send(err.toString(), { code: "xl", split: true });
            return message.channel.stopTyping(true);
        }
}

module.exports.help = {
    name: "exec",
    aliases: []
}