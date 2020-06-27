const express = require("express");
const { createServer } = require("http");
const app = express();
const server = createServer(app);
const client = require("../index");
const session = require("express-session");
const helmet = require("helmet");

app.set("view engine", "ejs");
app.use(express.static("css"));
app.use(express.static("assets"));
app.use(require("serve-favicon")('./assets/Snowflake.png'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: '4854674154185416845874785GTWHIGHWIHGIKKWIHOGW52648',
    resave: false,
    saveUninitialized: false,
    expires: 604800000,
}));
app.use("/", require("./Routes/index"));
app.use("/bots", require("./Routes/bots"));
app.use("/bot", require("./Routes/bots"));
app.use("/authorize", require("./Routes/auth"));

app.get("/discord", (req, res) => res.redirect("https://discord.gg/VRsr5fv"));
app.get('*', (req, res) => {
    res.status(404);
    res.render("404", {
        user: req.session.user,
        bot: client
    })
});

server.listen(5000, () => {
    console.log("Server is up and running! *"+5000);
});