const express = require('express');
const server = express();
const routes = require("./routes");
const port = process.env.PORT||3000;
let groups = ["8303", "8304", "8382", "8383"];
server.set("view engine", "pug");
server.set("views", `./views`);
server.use('/public', express.static('public'));

// server.use('/groups/', (req, res, next) => {
//     console.log("Call for groups");
//     next();
// });

server.get('/groups/', (req, res, next) => {
    res.render("group", {
        name: "Группы",
        groups: groups
    });
});


server.use("/", routes);
server.listen(port);
