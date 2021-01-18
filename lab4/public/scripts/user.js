// @flow
$(() => {
    $(".portlet")
        .draggable({cursor: "move"})
        .addClass("ui-widget ui-widget-content ui-corner-all")
        .find(".portlet-header")
        .addClass("ui-widget-header ui-corner-all")
        .prepend("<span class='ui-icon ui-icon-circle-triangle-n portlet-toggle'></span>");

    $("#currentArt").draggable({cursor: "move"});

    $(".portlet-toggle").on("click", function () {
        var icon = $(this);
        icon.toggleClass("ui-icon-circle-triangle-n uui-icon-circle-triangle-s");
        icon.closest(".portlet").find(".portlet-content").toggle();
    });

    let handle = $("#handle");
    $("#slider").slider({
        create: function () {
        },
        slide: (event, ui) => {
            $("#newPrice").text(`Повысить цену на: ${ui.value}`);
        },
    });

    let socket = io.connect("http://localhost:3030");
    let pause;
    let lastIdArt = "0";
    let timeUpdateInterval;
    let isChangePrice = false;
    let finalCountDown;
    let countInterval;

    function send(type, value) {
        if(socket) socket.json.emit(type, {"value": value});
    }

    socket.on("connect", () => {socket.json.emit("hello", {"name": $("#name").text()});});
    socket.on("msg", (msg) => {addUL(msg, "blue");});
    socket.on("start", (msg) => {
        new Promise((resolve, reject) => {
            pause = parseInt(msg.pause);
            setTimeout(() => {send("endPause", "next art");}, pause);
        }).then();
        addUL(msg, "red");
        $.get(`/next/art/${lastIdArt}`).done((resData) => {
            $("img").attr("src", resData.src);
            $("#nameArt").text(`${resData.author} - ${resData.name}`);
            $("#price").text(resData.price);
            $("#slider").slider({
                max: parseInt(resData.maxStep),
                min: parseInt(resData.minStep)
            });
            $("#newPrice").text(`Повысить цену на: ${$("#slider").slider("value")}`);
            beginTimeMarket = new Date();
            timeUpdateInterval = setInterval(pastTime, 1000);
            lastIdArt = resData.id;
        });
    });
    socket.on("market", (msg) => {
        isChangePrice = true;
        addUL(msg);
    });
    socket.on("endMarket", (msg) => {
        new Promise((resolve, reject) => {
            addUL(msg, "purple");
            isChangePrice = false;
        }).then();
        clearInterval(finalCountDown);
        if(lastIdArt !== $("#count").text()) {
            new Promise((resolve, reject) => {
                setTimeout(() => {send("endPause", "next art");}, pause);
            }).then();
            $.get(`/next/art/${lastIdArt}`).done((resData) => {
                new Promise((resolve, reject) => {
                    $("img").attr("src", resData.src);
                    $("#nameArt").text(`${resData.author} - ${resData.name}`);
                    $("#price").text(resData.price);
                    $("#slider").slider({
                        max: parseInt(resData.maxStep),
                        min: parseInt(resData.minStep)
                    });
                    $("#newPrice").text(`Повысить цену на: ${$("#slider").slider("value")}`);
                    lastIdArt = resData.id;
                }).then();
            });
        } else {
            clearInterval(timeUpdateInterval);
            send("endAuction", "end");
            $("img").attr("src", "/public/images/end.jpg");
            $("#nameArt").text(``);
            $("#price").text("");
        }
    });
    socket.on("price", (msg) => {
        addUL(msg, "green");
        $("#price").text(parseInt($("#price").text()) + parseInt(msg.up));
    });
    socket.on("win", (msg) => {
        new Promise((resolve, reject) => {
            let li = document.createElement("li");
            li.innerHTML = `${$("#nameArt").text()} ${$("#price").text()}`;
            purchases.appendChild(li);
            $("#money").text(parseInt($("#money").text()) - parseInt($("#price").text()));
            socket.json.emit("toAdmin", {"name": $("#name").text(), "money":  $("#money").text(), "art": $("#nameArt").text()});
        }).then();
    });
    socket.on("END", (msg) => {addUL(msg, "red");});

    $("#newPriceButton").on("click", () => {
        if(isChangePrice) {
            if(parseInt($("#money").text()) - parseInt($("#price").text()) - parseInt($("#slider").slider("value")) < 0) {
                window.alert("Недостаточно средств!");
                return;
            }
            console.log($("#slider").slider("value"));
            socket.json.emit("newPrice", {"name": $("#name").text(), "up": $("#slider").slider("value")});
        }
    });
});

let beginTimeMarket;

function addUL(socketMessage, color = "black") {
    new Promise((resolve, reject) => {
        console.log(`${new Date().toLocaleTimeString()}: ${color} ${socketMessage.message} ${socketMessage.time}`);
    }).then();
    let li = document.createElement("li");
    li.style.color = color;
    li.innerHTML = `${new Date(socketMessage.time).toLocaleTimeString()}: ${socketMessage.message}`;
    data.appendChild(li);
}

function pastTime() {
    let delta = new Date() - beginTimeMarket;
    let seconds = Math.round(delta / 1000);
    let minutes = 0;
    if(seconds > 60) {
        minutes = Math.floor(seconds/60);
        seconds = seconds % 60;
    }
    $("#time").text(`${minutes}:${seconds}`);
}
