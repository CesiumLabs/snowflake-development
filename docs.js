module.exports = b => {
  const data = [
    {
      keywords: [
        "add",
        "addmoney",
        "eco#add",
        "eco#addmoney",
        "eco.add",
        "eco.addmoney"
      ],
      type: "method",
      description: "Adds money to a user.",
      function: "addMoney",
      params: [
        { type: "string", name: "id", description: "User id" },
        { type: "number", name: "amount", description: "Amount to add" }
      ],
      returns: "{ before, after, user, amount }",
      example: `let data = eco.addMoney("1234567890", ${
        b ? "'7161617171727'," : ""
      } 100);
console.log("Added "+data.amount+" to "+data.user.toString());`
    },
    {
      keywords: [
        "remove",
        "removemoney",
        "subtract",
        "eco#remove",
        "eco#removemoney",
        "eco.remove",
        "eco.removemoney"
      ],
      type: "method",
      description: "Removes money from a user",
      function: "removeMoney",
      params: [
        { type: "string", name: "id", description: "User id" },
        { type: "number", name: "amount", description: "Amount to remove" }
      ],
      returns: "{ before, after, user, amount }",
      example: `let data = eco.removeMoney("1234567890", ${
        b ? "'81727271717227'," : ""
      } 50);
console.log(\`Removed \${data.amount} from \${data.user}\`)`
    },
    {
      keywords: [
        "fetch",
        "fetchmoney",
        "eco#fetch",
        "eco#fetchmoney",
        "eco.fetch",
        "eco.fetchmoney"
      ],
      type: "method",
      description: "Fetches the money of a user.",
      function: "fetchMoney",
      params: [{ type: "string", name: "id", description: "User id" }],
      returns: "{ amount, user, position }",
      example: `let data = eco.fetchMoney("1234567890"${
        b ? ",'716162737373737'" : ""
      });
console.log(\`\${data.user} has \${data.amount} money and their rank is \${data.position}.\`)`
    },
    {
      keywords: [
        "set",
        "setmoney",
        "eco#set",
        "eco#setmoney",
        "eco.set",
        "eco.setmoney"
      ],
      type: "method",
      description: "Sets the money by overwriting existing one.",
      function: "setMoney",
      params: [
        { type: "string", name: "id", description: "User id" },
        { type: "number", name: "amount", description: "Amount to set" }
      ],
      returns: "{ before, after, user, amount }",
      example: `let data = eco.setMoney("1234567890", ${
        b ? "'7272727282827'," : ""
      } 1000);
console.log(\`Your new money is \${data.after}.\`)`
    },
    {
      keywords: ["manager", "eco#manager", "eco.manager"],
      type: "method",
      description: "Instantiates quick.eco class.",
      params: [
        { name: "Table Name", type: "string", description: "Table Name" }
      ],
      function: "new " + !b ? "Manager()" : "GuildManager()",
      returns: "quick.eco",
      example: `const Eco = require("quick.eco");
const eco = new Eco.${b ? "GuildManager()" : "Manager()"};`
    },
    {
      keywords: ["version", "eco#version", "eco.version"],
      type: "property",
      description: "Returns quick.eco version",
      params: [],
      function: null,
      returns: "[quick.eco]#version",
      example: `console.log(\`I'm using \${Eco.version} of quick.eco :D\`);`
    },
    {
      keywords: [
        "manager.entries",
        "manager#entries",
        "entries",
        "total",
        "eco.entries",
        "eco#entries"
      ],
      type: "property",
      description: "Total entries count",
      params: [],
      function: null,
      returns: "Number:<Entries>",
      example: "We have ${eco.entries} entries."
    },
    {
      keywords: [
        "lb",
        "leaderboard",
        "eco#lb",
        "eco#leaderboard",
        "eco.lb",
        "eco.leaderboard"
      ],
      type: "method",
      description: "Leaderboard!",
      function: "leaderboard",
      isEco: false,
      params: b
        ? [
            { type: "string", name: "guildid", description: "Guild ID" },
            {
              type: "number",
              name: "options#limit",
              description: "Leaderboard Limit"
            },
            {
              type: "boolean",
              name: "options#raw",
              description: "Should return raw leaderboard?"
            }
          ]
        : [
            {
              type: "number",
              name: "options#limit",
              description: "Leaderboard Limit"
            },
            {
              type: "boolean",
              name: "options#raw",
              description: "Should return raw leaderboard?"
            }
          ],
      returns: "[{ position, id, money }]",
      example: `let lb = eco.leaderboard(${
        b ? "'7171762627272'," : ""
      }{ limit: 10, raw: false });
        const embed = new Discord.MessageEmbed()
        .setAuthor("Leaderboard")
        .setColor("BLURPLE");
        lb.forEach(u => {
            embed.addField(\`\${u.position}. \${client.users.get(u.id).tag}\`, \`Money: \${u.money} 💸\`);
        });
        return message.channel.send(embed);`
    },
    {
      keywords: [
        "eco#transfer",
        "eco.transfer",
        "transfer",
        "transfermoney",
        "eco#transfermoney",
        "eco.transfermoney"
      ],
      type: "method",
      description: "Transfers the money from one user to another.",
      function: "transfer",
      params: [
        { type: "string", name: "user1", description: "Id of giver" },
        { type: "string", name: "user2", description: "Id of receiver" },
        b
          ? ({ type: "string", name: "guildid", description: "Guild ID" },
            {
              type: "number",
              name: "amount",
              description: "Amount to transfer"
            })
          : {
              type: "number",
              name: "amount",
              description: "Amount to transfer"
            }
      ],
      isEco: false,
      returns: "{ user1, user2, amount }",
      example: `let data = eco.transfer("1234567890", "0987654321", ${
        b ? "'72717222727'," : ""
      } 100);
console.log(\`\${data.user1.id} gave \${data.amount} to \${data.user2.id}.\`)`
    },
    {
      keywords: ["delete", "deleteuser", "eco.deleteuser", "eco#deleteuser"],
      type: "method",
      description: "Deletes a user from the database.",
      function: "deleteUser",
      params: [
        {
          type: "string",
          name: "userid",
          description: "Id of a user to delete."
        }
      ],
      returns: "{ before, after, user }",
      example: `let data = eco.deleteUser("1234567890"${
        b ? ",'7274848383'" : ""
      });
console.log(\`Deleted user \${data.user}!\`)`
    },
    {
      keywords: ["eco#daily", "eco.daily", "daily"],
      type: "method",
      description: "Daily balance",
      function: "daily",
      params: [
        { type: "string", name: "userid", description: "User id" },
        { type: "number", name: "amount", description: "amount" }
      ],
      returns:
        "{ onCooldown, newCooldown, claimedAt, timeout, before, after, user, amount, time }",
      example: `let add = eco.daily(message.author.id, ${
        b ? "'72727227754'," : ""
      } 500);\nif (add.onCooldown) return message.reply(\`You already claimed your daily coins. Come back after \${add.time.days} days, \${add.time.hours} hours, \${add.time.minutes} minutes & \${add.time.seconds} seconds.\`);\nreturn message.reply(\`you claimed \${add.amount} as your daily coins and now you have total \${add.after} coins.\`);`
    },
    {
      keywords: ["eco#weekly", "eco.weekly", "weekly"],
      type: "method",
      description: "Weekly balance",
      function: "weekly",
      params: [
        { type: "string", name: "userid", description: "User id" },
        { type: "number", name: "amount", description: "amount" }
      ],
      returns:
        "{ onCooldown, newCooldown, claimedAt, timeout, before, after, user, amount, time }",
      example:
        "let add = eco.weekly(message.author.id," + b
          ? "'3772722727272',"
          : "" +
            " 500);\nif (add.onCooldown) return message.reply(`You already claimed your weekly coins. Come back after ${add.time.days} days, ${add.time.hours} hours, ${add.time.minutes} minutes & ${add.time.seconds} seconds.`);\nreturn message.reply(`You claimed ${add.amount} as your weekly coins and now you have total ${add.after} coins.`);"
    },
    {
      keywords: ["eco#beg", "eco.beg", "beg"],
      type: "method",
      description: "Beg money.",
      function: "beg",
      params: [
        { type: "string", name: "userid", description: "User id" },
        { type: "number", name: "amount", description: "amount" },
        {
          type: "boolean",
          name: "options#canLose",
          description: "User should randomly lose?"
        },
        { type: "number", name: "cooldown", description: "Cooldown" },
        {
          type: "string",
          name: "customName",
          description: "Custom Cooldown name"
        }
      ],
      returns:
        "{ onCooldown, newCooldown, claimedAt, timeout, before, after, user, amount, time, lost }",
      example:
        "let add = eco.beg(message.author.id," + b
          ? "'7372727277272',"
          : "" +
            ' 500, { canLose: true });\nif (add.onCooldown) return message.reply(`You already begged for coins. Come back after ${add.time.minutes} minutes & ${add.time.seconds} seconds.`);\nif (add.lost) return message.channel.send("Get Lost!")\nreturn message.reply(`You got ${add.amount} coins.`);'
    },
    {
      keywords: ["work", "eco#work", "eco.work"],
      type: "method",
      description: "Work and earn.",
      function: "work",
      params: [
        { type: "string", name: "userid", description: "User id" },
        { type: "number", name: "amount", description: "Amount" },
        {
          type: "array",
          name: "options#jobs",
          description: "Job list. (Not required)"
        },
        { type: "number", name: "options#cooldown", description: "Cooldown." }
      ],
      returns:
        "{ onCooldown, newCooldown, claimedAt, timeout, before, after, user, amount, workedAs, time }",
      example: `let amount = Math.floor(Math.random() * 1500) + 1000;
    let work = eco.work(message.author.id,${
      b ? "'37727272828282|," : ""
    } amount);
    if (work.onCooldown) return message.reply(\`You are tired rn. Come back after \${work.time.minutes} minutes & \${work.time.seconds} seconds to work again.\`);
    else return message.reply(\`You worked as **\${work.workedAs}** and earned **\${work.amount}** 💸. Now you have **\${work.after}** 💸.\`);`
    },
    {
      isEco: false,
      keywords: ["db", "quickdb", "database", "eco#db", "eco.db"],
      type: "method",
      description: "Quick.db Database",
      function: "db",
      params: [
        { type: "string", name: "name", description: "Database File Name" }
      ],
      returns: "quick.db",
      example: `const Eco = require("quick.eco");
const db = Eco.db("./database");

db.add("balance", 100);
db.get("balance");

db.startsWith("balance", { sort: ".data" });
db.deleteAll();
`
    },
    {
      keywords: ["ms", "eco#ms", "eco.ms"],
      type: "method",
      description: "Milliseconds Parser",
      function: "ms",
      params: [
        {
          type: "number",
          name: "milliseconds",
          description: "Time in milliseconds to parse."
        }
      ],
      returns:
        "{ days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds }",
      example: `const ms = Eco.ms;
const time = ms(19994);
console.log(time.hours);`,
      isEco: false
    },
    {
      keywords: ["reset", "eco.reset", "eco#reset"],
      type: "method",
      description: "Drops the table",
      function: "reset()",
      params: [],
      returns: "boolean",
      example: "eco.reset()",
      isEco: false
    },
    {
      keywords: ["eco.setbank", "setbank", "eco#setbank"],
      type: "method",
      description: "Set User Bank",
      function: "setBank",
      params: [
        { name: "userid", type: "string", description: "User ID" },
        { name: "amount", type: "number", description: "Amount" }
      ],
      returns: "{ before, after, user, amount }",
      example: `eco.setBank("188288948383", ${
        b ? '"7372718282828828",' : ""
      }500);`
    },
    {
      keywords: ["eco.deposit", "eco.depositMoney", "deposit", "eco#deposit"],
      type: "method",
      description: "Deposit money in Bank account",
      function: "depositMoney",
      params: [
        { name: "userid", type: "string", description: "User ID" },
        { name: "amount", type: "number", description: "Amount" }
      ],
      returns: "{ before, after, user, amount }",
      example: `eco.depositMoney("188288948383", ${
        b ? "\"72727727272\"," : ""
      }500);`
    },
    {
      keywords: [
        "eco.withdraw",
        "eco.withdrawMoney",
        "withdraw",
        "eco#withdraw"
      ],
      type: "method",
      description: "Withdraw money from Bank account",
      function: "withdrawMoney",
      params: [
        { name: "userid", type: "string", description: "User ID" },
        { name: "amount", type: "number", description: "Amount" }
      ],
      returns: "{ before, after, user, amount }",
      example: `eco.withdrawMoney("188288948383",${
        b ? "\"727271822272727\"," : ""
      } 500);`
    }
  ];
  data.forEach(i => {
    if (i.isEco === undefined) i.isEco = true;
    else i.isEco = false;
  });
  return data;
};
