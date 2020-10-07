const express = require('express');
const router = express.Router();
const fs = require('fs');
const library = require('./public/library.json');
let groups = ["8303", "8304", "8382", "8383"];

// router.get("/groups/:num", (req, res, next) =>{
//     let number = req.params.num;
//     for(value of groups)
//         if(value===number)
//             res.end(`${value} is best!`);
//     next();
// });

// router.get("/groups/", (req, res)=>{
//     let body = "<h1>Groups</h1>";
//     for (value of groups)
//         body += `<a href="/groups/${value}">${value}</a> `;
//     res.end(body);
// });
//

// router.get("/groups/*", (req, res)=>{
//     res.end("NO such group");
// });
// router.get('/', (req, res)=> {
//     res.end("<a href='/groups/'>Groups</a>");
// });

router.get('/', (req, res)=> {
    res.redirect('/books/');
});

router.get('/books/', (req, res, next)=> {
    res.render('books', {
        books:library.books,
        name:"Домашняя бибилиотека"
    });
    next();
});

router.post('/books/', (req, res, next) => {
    let body = req.body;
    if(!body || !body.author || !body.name || !body.publishedDate) {
        res.status(400);
        res.json({success: false, message: "Bad request"});
    } else{
        library.maxId++;
        let id_ = {id: library.maxId};
        let newBook = Object.assign(id_, req.body);
        newBook.isInLibrary = "Yes";
        newBook.readerName = "";
        newBook.expectedDate = "";
        library.books.push(newBook);
        res.redirect('/books/');
    }
    next();
});





// server.use('/groups/', (req, res, next) => {
//     console.log("Call for groups");
//     next();
// });

// server.get('/groups/', (req, res, next) => {
//     res.render("group", {
//         name: "Группы",
//         groups: groups
//     });
// });




module.exports = router;