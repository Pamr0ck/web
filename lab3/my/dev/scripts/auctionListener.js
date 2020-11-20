$(document).ready(function () {
    $.get(`date`).done((resData) => {
        $("#beginDate").val(resData.beginDate)
        $("#beginTime").val(resData.beginTime)
        $("#timeout").val(resData.timeout)
        $("#interval").val(resData.interval)
        $("#pause").val(resData.pause)
    });
})


$(".mainMenuButt").first().on("click", () => {window.location = "/";});

$(".mainMenuButt").first().next().on("click", () => {window.location = "/partners";});

$(".mainMenuButt").last().on("click", () => {
    console.log('im working');
    if($("#beginDate").val() === "" || $("#beginTime").val() === "" || $("#timeout").val() === "" || $("#interval").val() === "" || $("#pause").val() === "") {
        window.alert("Введены не все параметры аукциона!");
        return;
    }
    $.post("/save", {beginDate: $("#beginDate").val(), beginTime: $("#beginTime").val(),
        timeout: $("#timeout").val(), interval: $("#interval").val(), pause: $("#pause").val()}).done(() => {console.log("END!");});
});