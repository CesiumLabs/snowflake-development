module.exports = {
    TOKEN: process.env.TOKEN,
    guilds: {
        main: "01234567890123456789",
        testing: "01234567890123456789"
    },
    channels: {
        log: "01234567890123456789",
        modLog: "01234567890123456789"
    },
    roles: {
        developer: "01234567890123456789",
        bots: "01234567890123456789"
    },
    permission: "MANAGE_GUILD",
    prefix: "-",
    website: {
        PORT: process.env.PORT || 5000,
        redirectURI: "https://example.com/authorize/callback",
        clientSecret: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        scopes: ["identify"],
        clientID: "01234567890123456789"
    }
};