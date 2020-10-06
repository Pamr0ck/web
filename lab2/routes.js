const express = require('express');
const router = express.Router();
let groups = ["8303", "8304", "8382", "8383"];

router.get("/groups/:num", (req, res, next) =>{
    let number = req.params.num;
    for(value of groups)
        if(value===number)
            res.end(`${value} is best!`);
    next();
});

router.get("/groups/", (req, res)=>{
    let body = "<h1>Groups</h1>";
    for (value of groups)
        body += `<a href="/groups/${value}">${value}</a> `;
    res.end(body);
});


router.get("/groups/*", (req, res)=>{
    res.end("NO such group");
});
router.get('/', (req, res)=> {
    res.end("<a href='/groups/'>Groups</a>");
});
module.exports = router;