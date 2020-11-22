function AJAXrequest(method, url, callback, body = null) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (body === null) {
                let library = JSON.parse(this.responseText);
                callback(library);
            } else {
                callback();
            }
        }
    };
    xhttp.open(method, url);
    if (body !== null) {
        xhttp.setRequestHeader("Content-Type",
            "application/json;charset=UTF-8");
        xhttp.send(JSON.stringify(body));
    } else {
        xhttp.send();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const rows = document.querySelectorAll('tr[data-href]');
    rows.forEach((row) => {
        row.addEventListener('click', () => {
            window.location.href = row.dataset.href;
        });
    });
});


function getProperties(id) {
    let form = document.getElementById(id);
    let inputs = form.getElementsByClassName('w3-input');

    let properties = {};

    for (let input of inputs) {
        let temp = input.name;
        properties[temp] = input.value;
    }
    let tmp = properties['publishedDate'].split('-');
    properties['publishedDate'] = tmp[2]+'-'+tmp[1]+'-'+tmp[0];




    return properties;
}

function addElem(tr, elem) {
    let temp = document.createElement('th');
    temp.textContent = elem;
    tr.appendChild(temp);
}

function removeOldAndPutNewBooks(library) {
    let table = document.getElementById('rows');
    let rows = document.getElementsByClassName('row');
    let size = rows.length;
    for (let i = 0; i < size; i++) {
        rows[0].remove();
    }
    for (let book of library) {
        let tr = document.createElement('tr');
        tr.classList.add('row');
        tr.setAttribute('data-href', `/books/${book.id}`);
        addElem(tr, book.id);
        addElem(tr, book.author);
        addElem(tr, book.name);
        addElem(tr, book.publishedDate);
        addElem(tr, book.isInLibrary);
        addElem(tr, book.readerName);
        addElem(tr, book.expectedDate);

        table.appendChild(tr);
    }
    document.addEventListener('mousemove', () => {
        const rows = document.querySelectorAll('tr[data-href]');
        rows.forEach((row) => {
            row.addEventListener('click', () => {
                window.location.href = row.dataset.href;
            });
        });
    });
}

function addBook() {
    let properties = getProperties('addForm');
    console.log(properties);
    if (properties.author && properties.name && properties.publishedDate) {
        AJAXrequest('POST',
            'http://localhost:3000/books/',
            () => {
                window.location.reload();
            },
            properties
        );
    } else {
        alert('Ошибка. Не введены поля Автор и/или Название и/или Дата публикации');
    }
}
function inLibraryOnly() {
    const button = document.getElementById('inLibrary');
    button.classList.toggle('w3-dark-grey');
    if (button.classList.contains('w3-dark-grey')) {
        button.textContent = 'Показать все книги';
        AJAXrequest("PUT",
            `http://localhost:3000/books/filter/onlibrary/`,
            (library) => {
                removeOldAndPutNewBooks(library);
                window.history.pushState("",
                    "", '/books/filter/');
            });
    } else {
        button.textContent = 'Только в наличии';
        AJAXrequest("PUT",
            `http://localhost:3000/books/filter/full/`,
            (library) => {
                removeOldAndPutNewBooks(library);
                window.history.pushState("",
                    "", '/books/');
            })
    }
}

function filterDateBooks() {
    let properties = getProperties('filterDateForm');
    if (properties.expectedDate) {
        console.log(properties);
        AJAXrequest("PUT",
            `http://localhost:3000/books/filter/date/${properties.expectedDate}/`,
            (library) => {
                removeOldAndPutNewBooks(library);
                window.history.pushState("",
                    "", '/books/filter/');
                document.getElementById('id02').style.display='none'
            });
    } else {
        alert('Ошибка. Не введено значения поля');
    }
}
