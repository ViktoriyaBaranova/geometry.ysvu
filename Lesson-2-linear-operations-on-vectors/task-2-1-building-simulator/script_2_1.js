"use strict";
const btnCheck = document.querySelector(".check");
const btnRestart = document.querySelector(".restart");
const condition = document.querySelector(".condition");
const spanResult = document.querySelector('.span-result');
var svg = document.getElementById('pic'); 
let arrUserVector = [], arrTaskVector = [], coordClickedCircle = [], coordClickedCircles = [], clickedCircles = [], arrCoordsTaskVect = [];
const sizeSvg = 15, numberOfClickCircles = 2;
let count = 0, mark = 0, numberOfTaskVect, variant, dataCoordsTaskVect, progressBar, progressValue = 0;
localStorage.setItem("task-4", "0");

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
            if (coordClickedCircles){
                drawElem(coordClickedCircles, 'vector', draw_svg_vect, '#224bcf');
                arrUserVector.push(coordClickedCircles);
                checkUserVect([coordClickedCircles], 'task-vect');
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

const checkUserVect = (userVect, nameClass)=>{
    let calcTaskVect = [];
    const vect = svg.querySelector('.vector');
    let coordTaskVect = coordVect(dataCoordsTaskVect);
    let coordsUserVect = coordVect(userVect); 
    
    calcTaskVect = (!variant) ? coordTaskVect.reduce((acc, cur)=>sumArrElem(acc, cur), [0, 0]) : (variant === 1 ? subsArrElem(coordTaskVect[0], coordTaskVect[1]) : subsArrElem(coordTaskVect[1], coordTaskVect[0]));
    if (calcTaskVect.every((elem, index)=>elem === coordsUserVect[0][index])) {
        setTimeout(()=>{
            svg.removeChild(vect);
            [...svg.querySelectorAll(`.${nameClass}`)].forEach(el=>svg.removeChild(el));
            const nameVectors = svg.querySelectorAll('text');
            nameVectors ? [...nameVectors].forEach(el=> svg.removeChild(el)) : null;
            progressValue !== 10? createTaskVect() : null;
            }, 1000);
        progressValue ++;
        progressBar.value = progressValue;
        count++;
    }else{
        vect.setAttribute('stroke', '#FF0000');
        setTimeout(()=>{
            svg.removeChild(vect);
            count--;
        }, 1000);
    } 
    mark = count <= 0 ? 0 : Math.round(count * data.score / data.numberOfTask);
}

const createSyle = (click, str1, str2, width) =>{
    click.forEach((elem)=>{
        elem.setAttribute('stroke', str1);
        elem.setAttribute('fill', str2);
        elem.setAttribute("stroke-width", width);
    });
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
        svg.removeChild(svg.querySelector(".move-vector"));
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

const createDataTaskVect = ()=>{
    let arr = [];
    const pointStart = {x: randomInt(1, sizeSvg-1), y: randomInt(1, sizeSvg-1)};
    if (variant === 0) {
        const pointEnd = {x: randomInt(1, sizeSvg-1), y: randomInt(1, sizeSvg-1)}; 
        arr.push([pointStart.x, pointStart.y, pointEnd.x, pointEnd.y]);
        for (let i=1; i<numberOfTaskVect; i++){
            const pointNew = {x: randomInt(1, sizeSvg-1), y: randomInt(1, sizeSvg-1)};
            arr.push([arr[i-1][2], arr[i-1][3], pointNew.x, pointNew.y]);
        }
    }else{
        for (let i=0; i<numberOfTaskVect; i++){
            const pointEnd = {x: randomInt(1, sizeSvg-1), y: randomInt(1, sizeSvg-1)};
            arr.push([pointStart.x, pointStart.y, pointEnd.x, pointEnd.y]);
        }
    }
    return arr;
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

const coordVect = (arr)=>{
    const arr2 = [];
    arr.forEach(item =>{
        arr2.push([item[2]-item[0], item[3]-item[1]]);
    });
    return arr2;
}

const sumArrElem = (arr1, arr2)=>{
    return arr1.map((elem, index) => elem + arr2[index]);
}

const subsArrElem = (arr1, arr2)=>{
    return arr1.map((elem, index) => elem - arr2[index]);
}

const createTaskVect=()=>{
    variant = randomInt(0, task.length-1);
    variant === 0 ? numberOfTaskVect = randomInt(2, 3) : numberOfTaskVect = 2; 
    
    condition.innerHTML = `<div class="hint"><h2>Задание 2.1. Сумма и разность векторов</h2><img class="sistem-hint" src="./../../paint/hint.png"/><img class="teory-hint" src="./../../paint/lamp.png"/></div><section class="section-progress"><p>Задание №${progressValue + 1} / ${data.numberOfTask}  <progress value="0" max="10"></progress><p style="font-weight: bold;">Постройте ${task[variant]}</p></section>`;
    progressBar = condition.querySelector('progress');
    progressBar.value = progressValue;
    dataCoordsTaskVect = createDataTaskVect();
    arrTaskVector.push(dataCoordsTaskVect);
    dataCoordsTaskVect.forEach(el=>draw_svg_vect(el[0], el[1], el[2], el[3], 'task-vect'));
    const taskVect = svg.querySelectorAll('.task-vect');
    if (variant){
        const nameVect = ["a", "b"]
        taskVect.forEach((el, ind)=>{
            const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            txt.setAttribute('x', dataCoordsTaskVect[ind][2]*10+5);
            txt.setAttribute('y', dataCoordsTaskVect[ind][3]*10+5);
            txt.textContent = nameVect[ind];
            svg.appendChild(txt);
        });
    }    
}

btnCheck.addEventListener("click", () => {
    spanResult.textContent = "Количество баллов: " + mark + " из " + data.score;
    data.taskVectors = arrTaskVector;
    data.userVectors = arrUserVector;
    console.log(data);
    localStorage.setItem("task-4", [mark, checkHint]);
});

btnRestart.addEventListener("click", () => {
    arrUserVector = [], coordClickedCircle = [], coordClickedCircles = [], clickedCircles = [], arrCoordsTaskVect = [];
    progressValue = 0, count = 0, mark = 0;
    spanResult.textContent = "";
    const taskVect = svg.querySelectorAll('.task-vect');
    taskVect.forEach(el=>svg.removeChild(el));
    const nameVectors = svg.querySelectorAll('text');
    nameVectors ? [...nameVectors].forEach(el=> svg.removeChild(el)) : null;
    createTaskVect();
    localStorage.removeItem("task-4");
    
})

const checkStorage = () =>{
    if (localStorage.getItem("task-4")){
        if (localStorage.getItem("task-4")[0]) spanResult.textContent = "Количество баллов: " + localStorage.getItem("task-4")[0] + " из 10";
        if (localStorage.getItem("task-4")[0] === "0") spanResult.textContent = "Количество баллов: 0 из 10";  
    }else 
        spanResult.textContent = "Результат: - из 10";
}

var pt = svg.createSVGPoint();
const task = ["вектор суммы для векторов, изображенных на рисунке", "вектор a - b", "вектор b - a"];
draw_svg_grid();
let checkHint = false;
checkStorage();
createTaskVect();

const chooseHint = (str)=>{
    if (str.innerText.indexOf('вектор суммы для векторов, изображенных на рисунке') !== -1) return hints[0]
    if (str.innerText.indexOf('вектор a - b') !== -1) return hints[1]
    if (str.innerText.indexOf('вектор b - a') !== -1) return hints[2]
}

let hint = false;
const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    hint = !hint;
    console.log(hint)
    const p_task = document.querySelectorAll("p");

    checkHint = true;
    localStorage.setItem("task-4", [mark, checkHint]);
    if (hint){
        p_task[1].setAttribute("data-tooltip", chooseHint(p_task[1]));
        lampHint.style.transform = "scale(0.88)";
    }else{
        p_task[1].removeAttribute("data-tooltip");
        lampHint.style.transform = "scale(1)";
    }
})


const imgHint = document.querySelector("img.sistem-hint");
imgHint.addEventListener("click", () => {
    introJs().setOptions({
    steps: [
        
        {
            element: document.querySelector("p"),
            intro: "Прочитайте условие"
        },
        {
            element: document.querySelector("svg"),
            intro: "Изобразите векторы, соответствующие условию в данном поле"
        },
        {
            element: document.querySelector("circle"),
            intro: "Нажимайте на пересечение клеток, чтобы рисовать векторы"
        },
        {
            element: condition.querySelector('progress'),
            intro: "Количество выполненных заданий отображается на индикаторе"
        }
        
    ]
    }).start();
});

const returnTaskAnswers = ()=>{
    return [data[variant].userVectors, data[variant].taskVectors]
}