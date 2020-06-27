const app = require("express").Router();
const client = require("../../index");
const  Discord = require("discord.js");
const FormData = require("form-data");
const fetch = require("node-fetch");

const Check = (req, res, next) => {
    req.session.backURL = req.url || "/";
    if (!req.session.user) return res.redirect('/authorize')
    else return next();
}

app.get('/', (req, res) => {
    if (req.session.user) return res.redirect(req.session.backURL || '/');
    const authorizeUrl = `https://discordapp.com/api/oauth2/authorize?client_id=${client.config.website.clientID}&redirect_uri=${encodeURIComponent(client.config.website.redirectURI)}&response_type=code&scope=${client.config.website.scopes.join('%20')}`;
    res.redirect(authorizeUrl);
});

app.get('/callback', (req, res) => {
    if (req.session.user) return res.redirect(req.session.backURL || '/');

    const accessCode = req.query.code;
    if (!accessCode) return res.redirect("/");

    const data = new FormData();
    data.append('client_id', client.config.website.clientID);
    data.append('client_secret', client.config.website.clientSecret);
    data.append('grant_type', 'authorization_code');
    data.append('redirect_uri', client.config.website.redirectURI);
    data.append('scope', client.config.website.scopes.join(' '));
    data.append('code', accessCode);

    fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: data
    })
        .then(res => res.json())
        .then(response => {
            fetch('https://discord.com/api/users/@me', {
                method: 'GET',
                headers: {
                    authorization: `${response.token_type} ${response.access_token}`
                },
            })
                .then(res2 => res2.json())
                .then(user => {
                    user = new Discord.User(client, user);
                    user.isMember = !!client.mainGuild.members.cache.get(user.id);
                    user.mod = client.guilds.cache.get(client.config.guilds.main).members.cache.get(user.id) ? !!(client.guilds.cache.get(client.config.guilds.main).members.cache.get(user.id).hasPermission(client.config.permission)) : false;
                    req.session.user = user;
                    res.redirect(req.session.backURL || '/');
                });
        });
});

app.get('/logout', Check, (req, res) => {
    let url = req.session.backURL || '/';
    req.session.destroy();
    return res.redirect(url);
});


module.exports = app;