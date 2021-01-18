// rollbar change key
// видосы flow точно
const express = require('express');
const router = require('./router').router;
const createDomain = require('domain');
let domain = createDomain.create(), server;
domain.on("error", (err) => {
    console.log("Домен перехватил ошибку %s", err);
});
domain.run(() => {
    server = express();
});
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.set("view engine", "pug");
server.set("views", `./views`);
server.use('/public', express.static('public'));
server.use("", router);
server.listen(3000, () => {
    console.log("server start http://localhost:3000")
});
