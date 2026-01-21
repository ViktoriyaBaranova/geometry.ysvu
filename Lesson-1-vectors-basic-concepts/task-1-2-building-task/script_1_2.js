"use strict";
const btnCheck = document.querySelector(".check");
const btnReset = document.querySelector(".reset");
const btnBack = document.querySelector(".back");
const btnCancel = document.querySelector(".cancel");
const divTask = document.querySelector(".div-task");
const condition = document.querySelector(".condition");
const spanResult = document.querySelector('.span-result');
let pTask;
var svg = document.getElementById('pic'); 
let arrUserVector = [], arrTaskVector = [], coordClickedCircle = [], coordClickedCircles = [], clickedCircles = [], arrCoordsTaskVect = [];
const sizeSvg = 19, numberOfClickCircles = 2;
let count = 0, mark = 0, dataCoordsTaskVect, variant, numberOfPaintVect = 0;
localStorage.setItem("task-1", "0");

function draw_svg_line(x1, y1, x2, y2, name, w="1", c="#000") {
    x1 *= 10; y1 *= 10; x2 *= 10; y2 *= 10;
    const path_line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var s_line = `M ${x1} ${y1} L ${x2} ${y2} `;
    path_line.setAttribute('d', s_line);
    path_line.setAttribute('stroke-linecap', 'round');
    path_line.setAttribute('stroke-linejoin', 'round');
    path_line.setAttribute('stroke-width', w);
    path_line.setAttribute('stroke', c);
    path_line.classList.add(name);
    svg.appendChild(path_line);
}

const draw_svg_circles = (x, y, color)=>{
    x *= 10; y *= 10;
    const circles = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circles.setAttribute("cx",x);
    circles.setAttribute("cy",y);
    circles.setAttribute("r",2.2);
    circles.setAttribute("stroke", color);
    circles.setAttribute("stroke-width", "0.5");
    circles.setAttribute("fill", "#DBE1F9");
    svg.appendChild(circles);
    
    circles.addEventListener('click', (e)=>{
        circles.style.opacity = 1;
        let coordClickedCircles = checkCircles(e);
        const pTask = divTask.querySelectorAll("p.task");
        if (coordClickedCircles){
            drawElem(coordClickedCircles, 'vector', draw_svg_vect, '#224bcf');
            numberOfPaintVect++;
            numberOfPaintVect <= pTask.length ? appearanceOfCondition(numberOfPaintVect) : null;
            arrUserVector.push(coordClickedCircles);
            }
    });
        circles.addEventListener('mouseover', (e)=> circles.style.opacity = 0.5);
        circles.addEventListener('mouseout', (e)=>circles.style.opacity = 0);
}

const drawElem =(arrCoords, nameEl, func, color)=>{
    func(arrCoords[0], arrCoords[1], arrCoords[2], arrCoords[3], nameEl, color);
    const el = svg.querySelector(".move-"+nameEl);
    svg.removeChild(el);   
}

const createSyle = (click, str1, str2, width) =>{
    click.forEach((elem)=>{
        elem.setAttribute('stroke', str1);
        elem.setAttribute('fill', str2);
        elem.setAttribute("stroke-width", width);
    });
}

const appearanceOfCondition = (n)=>{
    n != pTask.length? pTask[n].style.opacity = 1 : null;
    pTask[n-1].style.opacity = 0.5;
}
const checkCircles = (e)=>{
    const clickedCircle = e.target;
    if (!clickedCircle.classList.contains("clicked")){
        clickedCircle.addEventListener('mouseout', (e)=>clickedCircle.style.opacity = 1);
        clickedCircle.classList.add("clicked");
        coordClickedCircle = [];
        clickedCircles.push(clickedCircle);
        createSyle(clickedCircles, '#224bcf', '#224bcf');
        
        if (clickedCircles.length === numberOfClickCircles){
            let coordClickedCircles = [];
            for (let i=0; i<numberOfClickCircles; i++){
                coordClickedCircles.push(Number(clickedCircles[i].getAttribute("cx"))/10);
                coordClickedCircles.push(Number(clickedCircles[i].getAttribute("cy"))/10);
            }
            clickedCircles.forEach(el=> {
                el.classList.remove("clicked"); 
                el.style.opacity = 0;
                el.addEventListener('mouseout', (e)=>el.style.opacity = 0);
            });
            createSyle(clickedCircles, '#224bcf', '#DBE1F9', '0.5');
            clickedCircles = [];
            return coordClickedCircles;
        }
        coordClickedCircle.push(Number(clickedCircle.getAttribute("cx"))/10);
        coordClickedCircle.push(Number(clickedCircle.getAttribute("cy"))/10);
    }else{
        clickedCircle.classList.remove("clicked");
        createSyle(clickedCircles, '#224bcf', '#DBE1F9', '0.5');
        clickedCircle.addEventListener('mouseout', (e)=> clickedCircle.style.opacity = 0);
        clickedCircles = [], coordClickedCircle = [];
        svg.querySelector(".move-vector")? svg.removeChild(svg.querySelector(".move-vector")) : null;
    }
}
    
function draw_svg_vect(x1, y1, x2, y2, name, color="#EEAA00") {
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
    path_vect.setAttribute('stroke-width', '1.3');
    path_vect.setAttribute('stroke', color);//1683C9
    path_vect.setAttribute('data-len', len / 10); 
    path_vect.classList.add(name);
    /*path_vect.addEventListener('click', function () {
        path_vect.setAttribute('stroke', cursor.style.backgroundColor);
    });*/
    svg.insertBefore(path_vect, svg.querySelectorAll('circle')[0]);
    
}

const draw_svg_grid = () =>{
    for (let i = 0; i < sizeSvg+2; ++i){
        draw_svg_line(i, 0, i, sizeSvg+1, 'line', '0.5', '#dcdcdc');
        draw_svg_line(0, i, sizeSvg+1, i, 'line', '0.5', '#dcdcdc');
    }
    for (let i=1; i<sizeSvg; ++i)
        for (let j=1; j<sizeSvg; ++j)
            draw_svg_circles(i, j, "#224bcf");
    
}

const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};

const randomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

const drawMoveElem = (arr, p, name, func, color)=>{
    func(arr[0], arr[1], Math.round(p.x)/10, Math.round(p.y)/10, name, color);
    const el = svg.querySelectorAll("."+name);
    for (let i=0; i<el.length-1; i++)
        svg.removeChild(el[i]);
}
svg.addEventListener('mousemove', function(e){
    var ptt = svg.createSVGPoint();
    ptt.x = e.clientX-2;
    ptt.y = e.clientY-2;
    ptt = ptt.matrixTransform(svg.getScreenCTM().inverse()); 
    if(coordClickedCircle.length) 
            drawMoveElem(coordClickedCircle, ptt, 'move-vector', draw_svg_vect, '#224bcf'); 
}, false);

const generateDataVect = (variant)=>{
    const coordsVectors = data[variant].vectors.slice(0);
    const cond = data[variant].condition.slice(0);
    let  greyVect =[], blackVect = [], cond2 = [];
    const rand = randomInt(1, data[variant].vectors.length-1);
    let coord1 = coordsVectors.splice(rand);
    blackVect = coordsVectors.splice(rand-1, 1);
    let coordConcat = coord1.concat(coordsVectors); 
    
    let cond1 = cond.splice(rand);
    cond2 = cond.splice(rand-1, 1);
    let condConcat = cond1.concat(cond); 
    return [blackVect, coordConcat, condConcat];
}

const randomInt2 = (min, max) => {
  let rand = Math.round(min - 0.5 + Math.random() * (max - min + 1));
  return rand % 2 == 0 ? rand :  randomInt2(0, 2);
}

const createNameVect = (arr, name, ind)=>{
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', arr[2]*10+5);
    txt.setAttribute('y', arr[3]*10+6);
    txt.textContent = name[ind];
    svg.appendChild(txt);
}
const createTask=()=>{  
   
    variant = 0; //randomInt(0, data.length);
    const nameVect = ["a", "b", "c", "d", "e"]
    condition.innerHTML = `<div class="hint"><h2>Задание 1.2. Векторы. Основные понятия</h2><img class="sistem-hint" src="./../../paint/hint.png"/><img class="teory-hint" src="./../../paint/lamp.png"/></div><p>Начиная от конца вектора ${nameVect[nameVect.length-1]}, последовательно отложите векторы, удовлетворяющие следующим условиям:</p>`;
   /* data[variant].basis.map((el, ind)=>{
        const coef = randomInt2(0, 2);
        ind === 0? el[2]+=coef : el[3]-=coef;
    });*/
    data[variant].basis.forEach(el=>draw_svg_vect(el[0], el[1], el[2], el[3]));
    const [startVector, dataVectors, cond] = generateDataVect(variant);
    cond.forEach((el, index)=>{
        const txtTask = document.createElement("p");
        txtTask.style.opacity = 0.5;
        txtTask.classList.add("task");
        txtTask.textContent = `${index+1}) ${el};`;
        divTask.appendChild(txtTask);
    });
    data[variant].taskVectors = dataVectors;
    data[variant].basis.forEach((el, ind)=> createNameVect(el, nameVect, ind));
    createNameVect(startVector[0], nameVect, nameVect.length-1)
    draw_svg_vect(startVector[0][0], startVector[0][1], startVector[0][2], startVector[0][3], 'task-vect', '#414141');
    pTask = divTask.querySelectorAll("p.task");
    pTask[0].style.opacity = 1;
     
}

btnCheck.addEventListener("click", () => {
    count = 0, mark = 0;
    data[variant].userVectors = arrUserVector;
    let i = 0;
    data[variant].userVectors.forEach((el, ind)=>{
        count += (el.every((val, ind)=>val == data[variant].taskVectors[i][ind])) ? 1 : 0;
        i++;
    });
    /*mark = count <= 0 ? 0 : Math.round(count * data[variant].score / data[variant].vectors.length);*/
    mark = count <= 0 ? 0 : count;
    spanResult.textContent = "Количество баллов: " + mark + " из 21";
    console.log(data, count, arrUserVector);
    localStorage.setItem("task-1", [mark, checkHint]);
})

btnReset.addEventListener("click", () => {
    arrUserVector = [], coordClickedCircle = [], coordClickedCircles = [], clickedCircles = [], arrCoordsTaskVect = [];
    count = 0, mark = 0, numberOfPaintVect = 0;
    spanResult.textContent = "";
    svg.querySelectorAll('.vector').forEach(el=>svg.removeChild(el));
    pTask[0].style.opacity = 1;
    for (let i = 1; i<pTask.length; i++){
        pTask[i].style.opacity = 0.5;
    }   
    localStorage.removeItem("task-1");
})

btnCancel.addEventListener("click", () => {
    const userVect = svg.querySelectorAll(".vector");
    if (userVect.length) {
        svg.removeChild(userVect[userVect.length-1]);
        pTask[userVect.length].style.opacity = 0.5;
        pTask[userVect.length-1].style.opacity = 1;
        arrUserVector.pop();
        numberOfPaintVect = userVect.length-1;
        count -= 0.5;
    }
})

const checkStorage = () =>{
    if (localStorage.getItem("task-1")){
        if (localStorage.getItem("task-1")[0]) spanResult.textContent = "Количество баллов: " + localStorage.getItem("task-1")[0] + " из 21 ";
        if (localStorage.getItem("task-1")[0] === "0") spanResult.textContent = "Количество баллов: 0 из 21";  
    }else 
        spanResult.textContent = "Количество баллов:  из 21 ";
}

var pt = svg.createSVGPoint();
draw_svg_grid();
let checkHint = false;
checkStorage();
createTask();

const chooseHint = (str)=>{
    if (str.innerText.indexOf('единичный, сонаправленный') !== -1) return data[variant].hints[0]
    if (str.innerText.indexOf('единичный, противоположно направленный') !== -1) return data[variant].hints[1]
    if (str.innerText.indexOf('противоположно направленный') !== -1) return data[variant].hints[2]
    if (str.innerText.indexOf('сонаправленный') !== -1) return data[variant].hints[3]
    if (str.innerText.indexOf('равный') !== -1) return data[variant].hints[4]
}

let hint = false;
const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    hint = !hint;
    const p_task = document.querySelectorAll("p.task");
    checkHint = true;
    localStorage.setItem("task-1", [mark, checkHint]);
    if (hint){
        [...p_task].forEach((el, ind)=> el.setAttribute("data-tooltip", chooseHint(el)));
        lampHint.style.transform = "scale(0.88)";
    }else{
        [...p_task].forEach((el, ind)=>el.removeAttribute("data-tooltip"));
        lampHint.style.transform = "scale(1)";
    }
});


const imgHint = document.querySelector("img.sistem-hint");
imgHint.addEventListener("click", () => {
    introJs().setOptions({
    steps: [
        
        {
            element: document.querySelector("p.task"),
            intro: "Прочитайте условие"
        },
        {
            element: document.querySelector("svg"),
            intro: "Изобразите векторы, соответствующие условию в данном поле"
        },
        {
            element: document.querySelector("circle"),
            intro: "Нажимайте на пересечение клеток, чтобы рисовать векторы"
        }
        
    ]
    }).start();
});

const returnTaskAnswers = ()=>{
    return [data[variant].userVectors, data[variant].taskVectors]
}