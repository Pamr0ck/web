//todo
// картины для участия в акционе + рисунки
// начальные ставки
// перечень участников
// параметры аукциона

/*todo html
* перечень картин
* карточка картины
* список участников
* настройки аукциона
* */


const express = require('express');
const fs = require('fs');
const https = require('https');
const routers = require('./routers.js');

const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const options = {
    cert: fs.readFileSync('ssl/cert.csr'),
    key: fs.readFileSync('ssl/key.key')
};

app.use('/build', express.static('build'));
app.use('/media', express.static('media'));
app.use("", routers);

let server = https.createServer(options, app)
server.listen(8443, (err) => {
    if (err) {
        console.log("Error was occured at server start");
    } else {
        console.log(`Server is running on https protocol\nServer is started at port 8443`);
    }
});