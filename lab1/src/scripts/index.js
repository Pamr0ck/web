function storeName(value){
    localStorage["tetris.username"] = value;
}
function goToRecord() {
    setTimeout(()=>{
        window.location = "records.html";
    }, 0);

}