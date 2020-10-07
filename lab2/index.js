const express = require('express');
const server = express();
const routes = require("./routes");
const port = process.env.PORT||3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use("/", routes);
server.set("view engine", "pug");
server.set("views", `./views`);
server.use('/public', express.static('public'));

server.listen(port, ()=>{
    console.log(`Server started at http://localhost:${port}/`);
});
