let lastIdPaint;

$("img").on("click", (event)=>{
    lastIdPaint = event.target.parentNode.lastChild.innerHTML;
    $.get(`paint/${lastIdPaint}`, {id: lastIdPaint}).done((data) => {
        $("#infoArtist").val(data.artist);
        $("#infoName").val(data.name);
        $("#infoDes").val(data.des);
        $("#infoPrice").val(data.price);
        $("#infoMin").val(data.minStep);
        $("#imainMenuButtonnfoMax").val(data.maxStep);
        $("#imgInfo").attr("src", data.src);
        if(data.is === "нет") $("input[name=activ]").last().prop("checked", true);
        else $("input[name=activ]").first().prop("checked", true);
        $("#shadowInfo").css("display", "block");
    });
});

$("#changePaint").on("click", () => {
    let is = ($("input[name=activ]").first().is(":checked")) ? "участвует" : "нет";
    $.post("/", {id: lastIdPaint, artist: $("#infoArtist").val(), name: $("#infoName").val(), des: $("#infoDes").val(),
        is: is, price: $("#infoPrice").val(), minStep: $("#infoMin").val(), maxStep: $("#infoMax").val()}).done(() => {console.log("DONE!")});
    $("#shadowInfo").css("display", "none");
});

$("#modulInfoClose").on("click", () => {$("#shadowInfo").css("display", "none");});

$(".mainMenuButt").first().on("click", () => {window.location = "/participants";});
