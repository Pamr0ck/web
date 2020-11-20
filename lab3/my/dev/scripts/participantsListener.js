$(".mainMenuButt").first().on("click", () => {window.location = "/";});

$(".mainMenuButt").last().on("click", () => {$("#shadowCreate").css("display", "block");});

$("#modulCreateClose").on("click", () => {
    $("#shadowCreate").css("display", "none");
    $("#name").val("");
    $("#money").val("");
});

$(".delButton").on("click", (event) => {deletePartner(event);});

$(document).on("click", ".delButton", (event) => {deletePartner(event);});

function deletePartner(event) {
    $("#nameDelete").text(`Вы действительно хотите удалить участника ${$(event.target).parent().children()[0].innerHTML}?`);
    $("#targetTR").val($(event.target).parent());
    $("#shadowIsDelete").css("display", "block");
}

$("#modulIsDeleteClose").on("click", () => {$("#shadowIsDelete").css("display", "none");});

$("#sayYes").on("click", () => {
    $.ajax({
        url: `/${$("#targetTR").val().children()[0].innerHTML}`,
        type: 'DELETE',
        success: () => {
            $("#targetTR").val().remove();
            $("#shadowIsDelete").css("display", "none");
        }
    });
});


$("#createMan").on("click", () => {
    let nameMan = $("#name").val();
    let money = $("#money").val();
    if(nameMan === "") {
        window.alert("Введите имя!");
        return;
    }
    if(isNaN(parseInt(money))) {
        window.alert("Введите корректную суму!")
        return;
    }
    $.post("/participant", {name: nameMan, money: money}).done(() => {
        $("#addUnit").before($(
            `<tr><td>${nameMan}</td><td>${money}</td><td class="infoButton changeButton">Изменить запас средств</td><td class="infoButton delButton">Удалить участника</td></tr>`));
        $("#shadowCreate").css("display", "none");
        console.log('added')
    });

});

$(".changeButton").on("click", (event) => {changeButton(event);});

$(document).on("click", ".changeButton", (event) => {changeButton(event);});

function changeButton(event) {
    $("#targetButton").val(event.target);
    $("#shadowMoney").css("display", "block");
}

$("#modulMoneyClose").on("click", () => {
    $("#shadowMoney").css("display", "none");
    $("#newMoney").val("");
});

$("#changeMoney").on("click", () => {
    let changeMoney = $("#newMoney").val();
    let tag = $("#targetButton").val();
    $.ajax({
        url: `/${tag.parentNode.childNodes[0].innerHTML}/${changeMoney}`,
        type: 'PUT',
        success: () => {tag.parentNode.childNodes[1].innerHTML = changeMoney; $("#shadowMoney").css("display", "none");}

    });
});

