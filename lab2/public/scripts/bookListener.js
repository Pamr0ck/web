let url = window.location.href;
let parts = url.split('/');
let id = parts[parts.length - 1];
function AJAXrequest(method, url, id, callback) {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (method === 'GET') {
                let library = JSON.parse(this.responseText);
                for (let value of library.books) {
                    if (value.id === parseInt(id)) {
                        callback(value);
                    }
                }
            } else {
                callback();
            }
        }
    };
    xhttp.open(method, url);
    xhttp.send();
}

function getProperties(id) {
    let form = document.getElementById(id);
    let inputs = form.getElementsByClassName('w3-input');

    let properties = {};
    for (let input of inputs) {
        let temp = input.name;
        properties[temp] = input.value;
    }

    return properties;
}


function initEdit() {
    document.getElementById('edit').style.display = 'block';

}

function editBook() {
    let properties = getProperties('edit');
    if (properties.author && properties.name && properties.publishedDate) {
        AJAXrequest('PUT',
            `/books/edit/${id}/${properties.author}/${properties.name}/${properties.publishedDate}`,
            -1,
            () => {
                window.location.reload();
            })
    } else {
        alert('Ошибка. Не введены поля Автор и/или Название и/или Дата публикации');
    }
}
function deleteBook() {
    AJAXrequest('DELETE',
        `/books/${id}`,
        -1,
        () => {
            window.location = "/books/";
            // window.location.reload();
        });
    console.log('Delete')
}

function giveBook() {
    let properties = getProperties('give');
    if (properties.readerName && properties.expectedDate) {
        AJAXrequest('PUT',
            `/books/give/${id}/${properties.readerName}/${properties.expectedDate}/`,
            -1,
            () => {
                window.location.reload();
            })
    } else {
        alert('Ошибка. Не введены поля Читатель и/или Дата выдачи');
    }
}
function returnBook() {
    AJAXrequest('PUT',
        `/books/return/${id}/`,
        -1,
        () => {
            window.location.reload();
        })
}

function initGive() {
    AJAXrequest('GET',
        'http://localhost:3000/public/state.json',
        id,
        (book) => {
            if (book.isInLibrary === 'No') {
                alert('Книга уже выдана. Ее выдать нельзя.');
                return;
            }
            document.getElementById('give').style.display = 'block'
        });
}

function initReturn() {
    AJAXrequest('GET',
        'http://localhost:3000/public/state.json',
        id,
        (book) => {
            if (book.isInLibrary === 'Yes') {
                alert('Книга уже в библиотеке. Ее вернуть нельзя.');
                return;
            }
            document.getElementById('return').style.display = 'block';
        });
}

