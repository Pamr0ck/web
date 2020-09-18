// todo list
const table = document.getElementById('records');
let records = JSON.parse(localStorage["tetris.records"]);
let lastPlayer = records[records.length-1];
records.sort((a,b)=>{
    return b.score-a.score;
})

let i = 0;
for (let one of records){
    if (i>=10) break;
    let row = document.createElement('tr');
    let name = document.createElement('td');
    let score = document.createElement('td');
    name.textContent = one.name;
    score.textContent = one.score;
    row.appendChild(name);
    row.appendChild(score);
    table.appendChild(row);
    i++
}
