//https://cdnjs.com/libraries/intro.js
//https://habr.com/ru/articles/245767/

"use strict";
const btnCheck = document.querySelector(".check");
const btnReset = document.querySelector(".reset");
const condition = document.querySelector(".condition");
const spanResult = document.querySelector(".span-result");
var svg = document.getElementById('pic'); 
const pallete = document.querySelector(".palette");
var cursor = document.getElementById('cursor');
const score = 10;
let count = 0, mark = 0, hint = false;
let userColorAnswer = [];

svg.addEventListener('mousemove', function(e){
    var x = e.pageX;
    var y = e.pageY;
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
    cursor.style.opacity = 1;
});
pallete.addEventListener('mousemove', function(e){
    var x = e.pageX;
    var y = e.pageY;
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
    cursor.style.opacity = 1;
});

svg.addEventListener('mouseout', function(e){
    var x = 0;
    var y = 0;
    cursor.style.opacity = 0;
});
pallete.addEventListener('mouseout', function(e){
    var x = 0;
    var y = 0;
    cursor.style.opacity = 0;
});
const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};

const randomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

function draw_svg_line(x1, y1, x2, y2, w, c) {
    x1 *= 10; y1 *= 10; x2 *= 10; y2 *= 10;
    const path_line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var s_line = `M ${x1} ${y1} L ${x2} ${y2} `;
    path_line.setAttribute('d', s_line);
    path_line.setAttribute('stroke-linecap', 'round');
    path_line.setAttribute('stroke-linejoin', 'round');
    path_line.setAttribute('stroke-width', w);
    path_line.setAttribute('stroke', c);
    
    svg.appendChild(path_line);
}



function draw_svg_vect(x1, y1, x2, y2) {
    x1 *= 10; y1 *= 10; x2 *= 10; y2 *= 10;
    const path_vect = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.sqrt(dx * dx + dy * dy);
    dx /= len; dy /= len;
    var alen = 2.5;
    var ax = x2 - (alen+1) * dx, ay = y2 - (alen) * dy;
    
    var s_vect = `M ${x1} ${y1} L ${x2} ${y2} ` +
        " L " + (ax + dy * alen) + " " + (ay - dx * alen) +
        " M " + x2 + " " + y2 +
        " L " + (ax - dy * alen) + " " + (ay + dx * alen);
    path_vect.setAttribute('d', s_vect);
    path_vect.setAttribute('stroke-linecap', 'round');
    path_vect.setAttribute('stroke-linejoin', 'round');
    path_vect.setAttribute('stroke-width', '2.2');
    path_vect.setAttribute('stroke', '#E0E0E0');
    path_vect.setAttribute('data-len', len / 10); 
    path_vect.classList.add('vector');
    path_vect.addEventListener('click', function () {
        path_vect.setAttribute('stroke', cursor.style.backgroundColor);
    });
    svg.appendChild(path_vect);
    
}

function draw_svg_picture(){
    for (var i = 0; i < data[variant].size_picture[0]+1; ++i)
        draw_svg_line(i, 0, i, data[variant].size_picture[0]+1, '0.5', '#dcdcdc');
       
    for (var i = 0; i < data[variant].size_picture[1]+1; ++i) 
        draw_svg_line(0, i, data[variant].size_picture[1], i, '0.5', '#dcdcdc');
    data[variant].lines.forEach(el=>{
        draw_svg_line(el[0], el[1], el[2], el[3], '1.5', "#414141"); 
    });
    data[variant].vectors.forEach(el=>{
        draw_svg_vect(el[0], el[1], el[2], el[3]); 
    });
}

const createTask = ()=>{
    condition.innerHTML = `<div class="hint"><h2>${cond[0]}</h2><img class="sistem-hint" src="./../../paint/hint.png"/><img class="teory-hint" src="./../../paint/lamp.png"/></div>`;
    pallete.innerHTML = `<b>${cond[1]}</b>`;
    data[variant].condition.forEach((el, ind)=>{
        pallete.innerHTML +=`<div class="task"><div class="color" style="background-color: ${data[variant].colors[ind]}"></div><p>${el}</p></div>`;
    });
    const colors = document.querySelectorAll(".color");
    [...colors].forEach(el=>el.addEventListener('click', (event) => {
        cursor.style.backgroundColor = event.target.style.backgroundColor;
    }));
    //svg.style.viewBox=`0 0 ${data[variant].size_picture[0]} ${data[variant].size_picture[1]}`;
    draw_svg_picture();
}

function rgb2hex(rgb) {
    var rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
};

btnCheck.addEventListener("click", () => {
    count = 0, mark = 0;
    userColorAnswer = [];
    let taskColor = [];
    const vectors = svg.querySelectorAll('.vector');
    [...vectors].forEach((el, ind)=>{
        const index = data[variant].vectors[ind][4];
        const elem = rgb2hex(el.getAttribute('stroke')).toUpperCase();
        count += elem === data[variant].colors[index]? 1 : -1;
        userColorAnswer.push(elem);
        taskColor.push(data[variant].colors[index]);
    });
    mark = count <= 0 ? 0 : Math.round(count * score / data[variant].vectors.length);
    spanResult.textContent = "Результат: " + mark + " из " + score;
    data[variant].userAnswers = userColorAnswer;
    data[variant].taskAnswers = taskColor;
    ///
    localStorage.setItem("task-0", [mark, checkHint]);
    ///
    console.log(data[variant])
    console.log(count);
});

btnReset.addEventListener("click", () => {
    count = 0, mark = 0;
    userColorAnswer = [];
    const vectors = svg.querySelectorAll('.vector');
    [...vectors].forEach(el=>{
        el.setAttribute('stroke', '#E0E0E0');
    });
    spanResult.textContent = "";
    ///
    localStorage.removeItem("task-0");
    ///
});

////
const checkStorage = () =>{
    if (localStorage.getItem("task-0")){
        if (localStorage.getItem("task-0")[0]) spanResult.textContent = "Результат: " + localStorage.getItem("task-0")[0] + " из 10";
        if (localStorage.getItem("task-0")[0] === "0") spanResult.textContent = "Результат: 0 из 10";  
    }else 
        spanResult.textContent = "Результат: - из 10";
}
///

const variant = randomInt(0, data.length-1);
////
let checkHint = false;
checkStorage();
////
createTask();

const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    hint = !hint;
    const p_task = document.querySelectorAll("p");
    const b_task = document.querySelector("b");
    ////
    checkHint = true;
    localStorage.setItem("task-0", [mark, checkHint]);
    ///
    if (hint){
        [...p_task].forEach((el, ind)=> el.setAttribute("data-tooltip", data[variant].hints[ind]));
        b_task.setAttribute("data-tooltip", "Векторы каждой группы должны уловлетворять условию между собой");
        lampHint.style.transform = "scale(0.88)";
    }else{
        [...p_task].forEach((el, ind)=>el.removeAttribute("data-tooltip"));
        b_task.removeAttribute("data-tooltip");
        lampHint.style.transform = "scale(1)";
    }
});


const imgHint = document.querySelector("img.sistem-hint");
imgHint.addEventListener("click", () => {
    introJs().setOptions({
    steps: [
        
        {
            element: document.querySelector("p"),
            intro: "Прочитайте условие"
        },
        {
            element: document.querySelector("div.color"),
            intro: "Нажмите, чтобы курсор изменил цвет"
        },
        {
            element: document.querySelector("svg"),
            intro: "Нажмимайте на серые векторы, чтобы закрашивать их"
        }        
    ]
    }).start();
});


const returnTaskAnswers = ()=>{
    return [data[variant].userAnswers, data[variant].taskAnswers]
}