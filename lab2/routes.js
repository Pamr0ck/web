const express = require('express');
const router = express.Router();
const fs = require('fs');
const library = require('./public/library.json');
let filterLibrary = undefined;

function saveState() {
    fs.writeFile(
        './public/state.json',
        JSON.stringify(library, null, 4),
        (err) => {
            if (err) {
                throw err;
            }
        }
    );
}

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
        saveState();
        res.redirect('/books/');
    }
    next();
});

router.get('/books/:num', (req, res, next) => {
    const id = req.params.num;
    if (id === 'filter') {
        if (filterLibrary !== undefined) {
            res.render('books', {
                books: filterLibrary
            })
        } else {
            res.redirect('/books/')
        }
        res.end(`Short library`);
        next();
    } else {
        for (let value of library.books) {
            if (value.id === parseInt(id)) {
                res.render('book', {
                    book: value
                })
            }
        }
    }
    res.end(`Book with id ${id} does not exist!`);
    next();
});

router.put("/books/filter/onlibrary/", (req, res, next) => {
    filterLibrary = [];
    for (let value of library.books){
        if(value.isInLibrary === "Yes"){
            filterLibrary.push(value);
        }
    }
    res.end(JSON.stringify(filterLibrary));
    next();
});

router.put("/books/filter/full/", (req, res, next) => {
    res.end(JSON.stringify(library.books));
    next();
});

router.put("/books/give/:num/:readerName/:expectedDate/", (req, res, next)=>{
    const  id = req.params.num;
    for(let value of library.books){
        if(value.id === parseInt(id)){
            value.isInLibrary = "No";
            value.readerName = req.params.readerName;
            value.expectedDate = req.params.expectedDate;
            saveState();
            res.end(`${id} was updated`)
            break;
        }
    }
    res.end(`${id} was not updated`);
    next();
});

router.put("/books/filter/date/:expectedDate", (req, res, next) => {
    const expectedDate = new Date(req.params.expectedDate);
    filterLibrary = [];
    for (let value of library.books) {
        if (value.expectedDate) {
            if (new Date(value.expectedDate) <= expectedDate) {
                filterLibrary.push(value);
            }
        }
    }
    res.end(JSON.stringify(filterLibrary));
    next();
});

router.delete('/books/:num', (req, res, next)=>{
    const id = req.params.num;
    for (let i = 0; i < library.books.length; i++) {
        if (library.books[i].id === parseInt(id)) {
            library.books.splice(i, 1);
            saveState();
            res.end(`${id} was deleted`);
            next();
        }
    }
    res.end(`${id} is not best!`);
    next();
});

router.put('/books/edit/:num/:author/:name/:publishedDate', (req, res, next) => {
    const id = req.params.num;
    for (let value of library.books) {
        if (value.id === parseInt(id)) {
            value.author = req.params.author;
            value.name = req.params.name;
            value.publishedDate = req.params.publishedDate;
            saveState();
            res.end(`${id} was updated`);
            break;
        }
    }
    res.end(`${id} was not updated`);
    next();
});

router.put('/books/return/:num/', (req, res, next) => {
    const id = req.params.num;
    for (let value of library.books) {
        if (value.id === parseInt(id)) {
            value.isInLibrary = "Yes";
            value.readerName = "";
            value.expectedDate = "";
            saveState();
            res.end(`${id} was updated`);
            break;
        }
    }
    res.end(`${id} was not updated`);
    next();
});

module.exports = router;