let lastIdPaint;

$("img").on("click", (event)=>{
    lastIdPaint = event.target.parentNode.lastChild.innerHTML;
    $.get(`paint/${lastIdPaint}`, {id: lastIdPaint}).done((data) => {
        $("#infoArtist").val(data.artist);
        $("#infoName").val(data.name);
        $("#infoDes").val(data.des);
        $("#infoPrice").val(data.price);
        $("#infoMin").val(data.minStep);
        $("#infoMax").val(data.maxStep);
        $("#imgInfo").attr("src", data.src);
        if(data.is === "нет") $("input[name=activity]").last().prop("checked", true);
        else $("input[name=activ]").first().prop("checked", true);
        $("#shadowInfo").css("display", "block");
    });
});
$("#modulInfoClose").on("click", () => {$("#shadowInfo").css("display", "none");});
