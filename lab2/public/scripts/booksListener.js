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