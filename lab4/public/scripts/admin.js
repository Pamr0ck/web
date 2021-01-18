// @flow
// 2020-12-07T13:36:00
$(() => {

    $(".startAUCTION")
        .on("click", ()=> {
            let date = new Date()
            let HOURS = date.getHours()
            let MIINUTES = date.getMinutes() + 1
            let time = HOURS+":"+MIINUTES;
            socket.json.emit("LetsStart", {"time": time});
            window.alert("Аукцион начнется в "+ time);
        });

    $(".tabs").tabs({
        classes: {
            "ui-tabs-active": "highlight"
        }
    });

    $(".tabs").draggable({cursor: "move"});

    $(".portlet")
        .draggable({cursor: "move"})
        .addClass("ui-widget ui-widget-content ui-corner-all")
        .find(".portlet-header")
        .addClass("ui-widget-header ui-corner-all")
        .prepend("<span class='ui-icon ui-icon-circle-triangle-n portlet-toggle'></span>");

    $(".portlet-toggle").on("click", function () {
        var icon = $(this);
        icon.toggleClass("ui-icon-circle-triangle-n ui-icon-circle-triangle-s");
        icon.closest(".portlet").find(".portlet-content").toggle();
    });

    let socket = io.connect("http://localhost:3030");
    let isEnd = false;

    function send(type, value) {
        if(socket) socket.json.emit(type, {"value": value});
    }

    socket.on("connect", () => {socket.json.emit("hello", {"name": "ADMIN"});});
    socket.on("msg", (msg) => {addUL(msg, "blue");});
    socket.on("start", (msg) => {addUL(msg, "red");});
    socket.on("price", (msg) => {addUL(msg, "green");});
    socket.on("END", (msg) => {
        if(!isEnd) {
            isEnd = true;
            addUL(msg, "red");
        }
    });
    socket.on("buy", (msg) => {
        let deltaMoney;
        addUL(msg);
        for(let element of ($(".partner"))) {
            if(element.firstChild.innerHTML === msg.name) {
                deltaMoney = parseInt(element.lastChild.innerHTML) - parseInt(msg.money);
                element.lastChild.innerHTML = msg.money;
                break;
            }
        }
        let array = msg.art.split("-");
        let author = array[0].substring(0, array[0].length - 1);
        let name = array[1] = array[1].substring(1, array[1].length);
        for(let element of ($(".artInfo"))) {
            if(element.children[0].innerHTML === author && element.children[1].innerHTML === name) {
                element.children[3].innerHTML = msg.name;
                element.children[4].innerHTML = deltaMoney;
                break;
            }
        }
    });

});

function addUL(socketMessage, color = "black") {
    let li = document.createElement("li");
    li.style.color = color;
    li.innerHTML = `${new Date(socketMessage.time).toLocaleTimeString()}: ${socketMessage.message}`;
    data.appendChild(li);
}