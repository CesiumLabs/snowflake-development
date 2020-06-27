const app = require("express").Router();
const client = require("../../index");
const { user } = require("../../index");

const checkAuth = (req, res, next) => {
    req.session.backURL = req.url || "/";
    if (req.session.user) return next();
    return res.redirect("/authorize");
};

app.get("/", async (req, res) => {
    res.render("index", {
        user: req.session.user || null,
        bot: client
    });
});

app.get("/login", (req, res) => {
    return res.redirect("/authorize");

});

app.get("/logout", (req, res) => {
    return res.redirect("/authorize/logout");
});

app.get("/user/:id", async (req, res) => {
    if (!req.query.public) req.query.public = "false";
    let id = req.params.id;
    if (!id || !client.users.cache.get(id) || client.users.cache.get(id).bot) return res.redirect("/404");
    if (req.session.user && req.session.user.id == id && req.query.public !== "true") return res.redirect("/me");
    let bots = [];
    client.db.all().filter(bot => bot.ID.startsWith("bot_")).forEach(d => bots.push(client.db.get(d.ID)));
    bots = bots.filter(d => d.owner.id === id && !!d.approved);
    res.render("user", {
        user: req.session.user || null,
        bot: client,
        bots: bots.length < 1 ? null : bots,
        mem: client.users.cache.get(id),
        arb: true
    });
});

app.get("/me", checkAuth, async (req, res) => {
    let bots = [];
    client.db.all().filter(bot => bot.ID.startsWith("bot_")).forEach(d => bots.push(client.db.get(d.ID)));
    bots = bots.filter(d => d.owner.id === req.session.user.id);
    res.render("me/me", {
        user: req.session.user || null,
        bot: client,
        bots: bots.length < 1 ? null : bots,
        mem: null,
        arb: false
    });
});

app.get("/me/edit", checkAuth, async (req, res) => {
    res.render("me/edit", {
        user: req.session.user || null,
        bot: client
    });
});

app.post("/me/edit", checkAuth, async (req, res) => {
    if(req.body.github) { 
        client.db.set(`github_${req.session.user.id}`, `${req.body.github}`)
    } else client.db.delete(`github_${req.session.user.id}`);
    if(req.body.bio) {
        client.db.set(`bio_${req.session.user.id}`, `${req.body.bio.substr(0,1024)}`)
    } else client.db.delete(`bio_${req.session.user.id}`);
    if(req.body.twitter) {
        client.db.set(`twitter_${req.session.user.id}`, `${req.body.twitter}`)
    } else client.db.delete(`twitter_${req.session.user.id}`);
    
    res.redirect("/me");
});

module.exports = app;