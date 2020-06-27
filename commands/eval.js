const Discord = require("discord.js");

module.exports.run = async (client, message, args) => {
    if (message.author.id !== client.owner.id) return;
    let code = args.join(" ");
    if (!code) return message.channel.send("Please specify the code to eval!");
    
    const clean = (text) => {
        if (typeof text !== "string") text = require("util").inspect(text, { depth: 1 });
        text = text
            .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(new RegExp(client.token, "g"), "XXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXXXX");

        return text;
    }
    try {
        var evaled = eval(code);
        return message.channel.send(clean(evaled), {
            code: "xl",
            split: true
        }).catch(e => {
            return message.channel.send(e, {
                split: true,
                code: "xl"
            });
        });
    } catch(e) {
        return message.channel.send(e, {
            split: true,
            code: "xl"
        }).catch(err => {
            return message.channel.send(err, {
                split: true,
                code: "xl"
            });
        });
    }
}

module.exports.help = {
    name: "eval",
    aliases: ["ev"]
}