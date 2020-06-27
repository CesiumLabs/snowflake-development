const app = require("express").Router();
const client = require("../../index");
const cheerio = require("cheerio");
const moment = require("moment");
require("moment-duration-format");
const showdown = require("showdown");
let converter = new showdown.Converter({
    emoji: true,
    literalMidWordUnderscores: true,
    strikethrough: true,
    tables: true,
    tasklists: true,
    smoothLivePreview: true,
    simpleLineBreaks: true,
    openLinksInNewWindow: true
});

const checkAuth = (req, res, next) => {
    req.session.backURL = req.url || "/";
    if (req.session.user) return next();
    return res.redirect("/authorize");
};

const clean = (txt) => {
    let html = converter.makeHtml(txt);
    const $ = cheerio.load(html);
    $('*').each((i, element) => {
        Object.keys(element.attribs)
            .filter(attribute => attribute.startsWith('on'))
            .forEach((attribute) => {
                $(element).removeAttr(attribute);
            });
    });
    $('script').remove();
    $('object').remove();
    return $.html();
};

const isAllowed = (bot, req) => {
  if (bot.approved) return true;
  if (!req.session.user) return false;
  if (req.session.user.mod) return true;
  if (bot.owner.id === req.session.user.id) return true;
  return false;
}
app.get("/", async (req, res) => {
    let all = [];
    client.db.all().filter(data => data.ID.startsWith("bot_")).forEach(b => all.push(client.db.get(b.ID)));
    all = all.filter(data => !!data.approved);
    res.render("bots/index", {
        user: req.session.user || null,
        bot: client,
        all,
        random: shuffle(all).slice(0,8),
        top: all.sort((a, b) => b.upvotes - a.upvotes).slice(0,8),
        newBots: all.sort((a, b) => b.approvedTimestamp - a.approvedTimestamp).slice(0,8)
    });
});

app.get("/new", checkAuth, async (req, res) => {
    if (!req.session.user.isMember) return error(req, res, "bots/new", "You must join our discord server in order to add bots.");
    res.render("bots/new", {
        user: req.session.user || null,
        bot: client,
        error: null
    });
});

app.post("/new", checkAuth, async (req, res) => {
    if (!req.session.user.isMember) return error(req, res, "bots/new", "You must join our discord server in order to add bots.");
    if (!req.body.id) return error(req, res, "bots/new", "Please provide a bot id!");
    if (!req.body.prefix) return error(req, res, "bots/new", "Please provide a bot prefix!");
    if (!req.body.short_description) return error(req, res, "bots/new", "Please provide a short description.");
    if (!req.body.long_description) return error(req, res, "bots/new", "Please provide long description.");
    if (req.body.short_description.length < 50 || req.body.short_description.length > 100) return error(req, res, "bots/new", "Short description length must be of 50 (minimum) & 100 (maximum) characters.");
    if (req.body.long_description.length < 300) return error(req, res, "bots/new", "Long description length must be of atleast 300 characters.");
    try {
        var bot = await client.users.fetch(req.body.id);
        if (!bot.bot) return error(req, res, "bots/new", "Invalid Bot ID.");
        if (client.db.all().map(m => m.ID).includes(`bot_${bot.id}`)) return error(req, res, "bots/new", "Bot is already on the list.");
    } catch (e) {
        return error(req, res, "bots/new", "Invalid Bot ID.");
    }
    let data = {
        id: bot.id,
        username: bot.username,
        tag: bot.tag,
        discriminator: bot.discriminator,
        prefix: req.body.prefix,
        invite: (req.body.invite || (await client.generateInvite()).replace(client.user.id, req.body.id)),
        approved: false,
        owner: {
            id: req.session.user.id,
            username: req.session.user.username,
            discriminator: req.session.user.discriminator,
            avatar: req.session.user.displayAvatarURL
        },
        support: req.body.support || null,
        short_description: req.body.short_description.substr(0, 100),
        long_description: req.body.long_description,
        avatarURL: bot.displayAvatarURL({ format: "jpg" }),
        upvotes: 0
    };
    client.db.set(`bot_${data.id}`, data);
    client.emit("botAdd", data);
    return res.redirect("/bot/" + data.id);
});

app.get("/search", async (req, res) => {
    if (!req.query.q) return res.redirect("/404");
    let bots = [];
    client.db.all().filter(d => d.ID.startsWith("bot_")).forEach(i => bots.push(client.db.get(i.ID)));

    bots = bots.filter(b => !!b.approved && 
        (b.username.toLowerCase() === req.query.q.toLowerCase() ||
        b.username.toLowerCase().includes(req.query.q.toLowerCase()) ||
        b.username.toLowerCase().startsWith(req.query.q.toLowerCase()) ||
        req.query.q.toLowerCase().includes(b.username.toLowerCase()) ||
        req.query.q.toLowerCase().startsWith(b.username.toLowerCase())
        ));

    return res.render("bots/search", {
        user: req.session.user || null,
        bot: client,
        bots: bots,
        q: req.query.q
    });
});

app.get("/:id", async (req, res) => {
    if (!req.params.id) return res.redirect("/404");
    let bot = client.db.get(`bot_${req.params.id}`);
    if (bot === null) return res.redirect("/404");
    if (!req.session.user && !bot.approved) return res.redirect("/404");
    if (!isAllowed(bot, req)) {
      return res.redirect("/404");
    }
    bot.long_description = clean(bot.long_description);
    return res.render("bots/bot", {
        user: req.session.user || null,
        bot: client,
        boti: bot,
        message: null
    });
});

app.get("/:id/edit", async (req, res) => {
    if (!req.params.id) return res.redirect("/404");
    let bot = client.db.get(`bot_${req.params.id}`);
    if (bot === null) return res.redirect("/404");
    if (!req.session.user) return res.redirect("/404");
    if (!isAllowed(bot, req)) return res.redirect("/404");
    return res.render("bots/edit", {
        user: req.session.user || null,
        bot: client,
        data: bot,
        error: null
    });
});

app.post("/:id/edit", checkAuth, async (req, res) => {
    if (!req.params.id) return res.redirect("/404");
    let bot = client.db.get(`bot_${req.params.id}`);
    if (bot === null) return res.redirect("/404");
    if (!isAllowed(bot, req)) return res.redirect("/404");
    if (!req.body.prefix) return error(req, res, "bots/edit", "Please provide a bot prefix!", bot);
    if (!req.body.short_description) return error(req, res, "bots/edit", "Please provide a short description.", bot);
    if (!req.body.long_description) return error(req, res, "bots/edit", "Please provide long description.", bot);
    if (req.body.short_description.length < 50 || req.body.short_description.length > 100) return error(req, res, "bots/edit", "Short description length must be of 50 (minimum) & 100 (maximum) characters.", bot);
    if (req.body.long_description.length < 300) return error(req, res, "bots/edit", "Long description length must be of atleast 300 characters.", bot);
    const set = (path, data) => client.db.set(`bot_${req.params.id}${path ? `.${path}` : ""}`, data);

    if (req.body.prefix) set("prefix", req.body.prefix);
    if (req.body.support) set("support", req.body.support);
    if (req.body.invite) set("invite", req.body.invite);
    if (req.body.long_description) set("long_description", req.body.long_description);
    if (req.body.short_description) set("short_description", req.body.short_description);

    let data = client.db.get(`bot_${req.params.id}`);
    data.exc = req.session.user;
    client.emit("edit", data);
    return res.redirect("/bot/" + data.id);
});

app.get("/:id/delete", checkAuth, async (req, res) => {
    if (!req.params.id) return res.redirect("/");
    let bot = client.db.get(`bot_${req.params.id}`);
    if (bot === null) return res.redirect("/");
    if (!req.session.user) return res.redirect("/404");
    if (!isAllowed(bot, req)) return res.redirect("/404");
    return res.render("bots/delete", {
        user: req.session.user || null,
        bot: client,
        data: bot
    });
});

app.post("/:id/delete", checkAuth, async (req, res) => {
    if (!req.params.id) return res.redirect("/");
    let bot = client.db.get(`bot_${req.params.id}`);
    if (bot === null) return res.redirect("/");
    if (!req.session.user) return res.redirect("/404");
    if (!isAllowed(bot, req)) return res.redirect("/404");
    client.db.delete(`bot_${req.params.id}`);
    bot.exc = req.session.user;
    if (req.body.reason) bot.reason = req.body.reason;
    client.emit("delete", bot);
    return res.redirect("/");
});

app.get("/:id/vote", checkAuth, async (req, res) => {
    if (!req.params.id) return res.redirect("/404");
    let bot = client.db.get(`bot_${req.params.id}`);
    if (bot === null) return res.redirect("/404");
    if (!bot.approved) return res.redirect("/404");
    bot.long_description = clean(bot.long_description);
    if (!req.session.user) return res.redirect("/login");
    let voter = req.session.user;
    let timeout = 4.32e+7;
    let check = client.db.fetch(`vote_${voter.id}_${bot.id}`);
    if (check !== null && timeout - (Date.now() - check) > 0) {
        let time = moment.duration(timeout - (Date.now() - check)).format("hh [Hours], mm [Minutes] & ss [Seconds]");
        return res.render("bots/bot", {
            user: req.session.user || null,
            bot: client,
            boti: bot,
            message: `You have already voted this bot. Please wait for ${time} to vote this bot again!`
        });
    }
    client.db.add(`bot_${req.params.id}.upvotes`, 1);
    client.db.set(`vote_${voter.id}_${bot.id}`, Date.now());
    bot.exc = voter;
    client.emit("vote", bot);
    return res.render("bots/bot", {
        user: req.session.user || null,
        bot: client,
        boti: bot,
        message: `Successfully voted the bot. You can vote it again after 12 Hours!`
    });
});

function error(req, res, path, msg=null, data) {
    return res.render(path, {
        user: req.session.user || null,
        bot: client,
        error: msg,
        data
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

module.exports = app;