"use strict";
const btnCheck = document.querySelector(".check");
const btnRestart = document.querySelector(".restart");
const condition = document.querySelector(".condition");
const spanResult = document.querySelector('.span-result');
var svg = document.getElementById('pic');
let arrUserVector = [], arrTaskVector = [], coordClickedCircle = [], coordClickedCircles = [], clickedCircles = [], arrCoordsTaskVect = [];
const sizeSvg = 19, numberOfClickCircles = 2, numberOfTerms = 2;
let count = 0, mark = 0, variant,  dataCoordsTaskVect, btnNullVect, progressBar, progressValue = 0;
const sectionHint = document.querySelector(".hint");
const btnOk = document.querySelector(".btn-ok");

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
                checkUserVect([coordClickedCircles], 'line-figure');
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
            progressValue !== 10? createTask() : null;
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
        if (hint) sectionHint.style.opacity = 1;
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

const arrayRandElement = (arr) =>{
    const rand = randomInt(0, arr.length-1);
    return arr[rand];
}

const dataTask = (arr, index)=>{
    const arrCopy = arr.slice(0);
    const randomName = randomize(arrCopy);
    const dataName = randomName.splice(index);
    let task = [];
    for (let i=0; i<numberOfTerms; i++){
        const rand = {start: arrayRandElement(randomName), end: arrayRandElement(randomName)}
        task.push(`${rand.start}${rand.end}`);
    }
    return [randomName, task];
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

const createDataTaskVect = (coords, task)=>{
    let taskVectors = [];
    for (let i=0; i<numberOfTerms; i++){
        const vect = coords[`${task[i][0]}`].concat(coords[`${task[i][1]}`]);
        taskVectors.push(vect);                                    
    }
    return taskVectors;
}
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

const createTask=()=>{
    let coordPoints = {};
    variant = randomInt(0, operation.length-1);
    let numberFigure = randomInt(1, data.numberOfFigures);
    let currentNumberOfPoints = data[`figure_${numberFigure}`].numberOfPoints;
    let [currentNameOfPoints, task] = dataTask(data.namePoint, currentNumberOfPoints);
    if (task[0]=== task[1] && operation[variant] === "-") 
        [currentNameOfPoints, task] = dataTask(data.namePoint, currentNumberOfPoints);
    data.task = task;
    condition.innerHTML = `<div class="hint"><h2>Задание 2.3. Сумма и разность векторов</h2><img class="sistem-hint" src="./../../paint/hint.png"/><img class="teory-hint" src="./../../paint/lamp.png"/></div><p>Дана фигура. Постройте следующие векторы: ${task[0]} ${operation[variant]} ${task[1]}</p><section class="section-progress"><progress value="0" max="10"></progress><p>Задание №${progressValue + 1} / ${data.numberOfTask}</section><button class="null-vector">Нулевой вектор</button>`;
    
    btnNullVect = document.querySelector('.null-vector');
    btnNullVect.addEventListener("click", () => {
        coordClickedCircles = [0, 0, 0, 0];
        draw_svg_vect(coordClickedCircles[0], coordClickedCircles[1], coordClickedCircles[2], coordClickedCircles[3], 'vector', '#224bcf') 
        arrUserVector.push(coordClickedCircles);
        checkUserVect([coordClickedCircles], 'line-figure');
    })
    progressBar = condition.querySelector('progress');
    progressBar.value = progressValue;
    
    //paint figure
    data[`figure_${numberFigure}`].lines.forEach(el=>draw_svg_line(el[0], el[1], el[2], el[3], "line-figure", "0.5"));
    //create name to points
    for (let i=0; i<currentNumberOfPoints; i++){
        const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        txt.setAttribute('x', data[`figure_${numberFigure}`].lines[i][0]*10+1);
        txt.setAttribute('y', data[`figure_${numberFigure}`].lines[i][1]*10+10);
        txt.textContent = currentNameOfPoints[i];
        svg.appendChild(txt);
        coordPoints[currentNameOfPoints[i]] = [data[`figure_${numberFigure}`].lines[i][0], data[`figure_${numberFigure}`].lines[i][1]]
    }
    data.coordsPoints = coordPoints;
    dataCoordsTaskVect = createDataTaskVect(coordPoints, task);
}
                          
btnCheck.addEventListener("click", () => {
    spanResult.textContent = "Результат: " + mark + " из " + data.score;
    data.taskVectors = arrTaskVector;
    data.userVectors = arrUserVector;
    console.log(data);
    localStorage.setItem("task-6", [mark, checkHint]);
})

btnRestart.addEventListener("click", () => {
    arrUserVector = [], coordClickedCircle = [], coordClickedCircles = [], clickedCircles = [], arrCoordsTaskVect = [];
    progressValue = 0, count = 0, mark = 0;
    spanResult.textContent = "";
    const taskVect = svg.querySelectorAll('.line-figure');
    taskVect.forEach(el=>svg.removeChild(el));
    const namePoints = svg.querySelectorAll('text');
    namePoints ? [...namePoints].forEach(el=> svg.removeChild(el)) : null;
    createTask();
    localStorage.removeItem("task-6");
    
})

const checkStorage = () =>{
    if (localStorage.getItem("task-6")){
        if (localStorage.getItem("task-6")[0]) spanResult.textContent = "Результат: " + localStorage.getItem("task-6")[0] + " из 10";
        if (localStorage.getItem("task-6")[0] === "0") spanResult.textContent = "Результат: 0 из 10";  
    }else 
        spanResult.textContent = "Результат: - из 10";
}

var pt = svg.createSVGPoint();
const operation = ["+", "-"];
draw_svg_grid();
let checkHint = false;
checkStorage();
createTask();


const chooseHint = (str)=>{
    if (str.innerText.indexOf('+') !== -1) return hints[0]
    if (str.innerText.indexOf('-') !== -1) return hints[1]
}

let hint = false;
const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    
    hint = !hint;
    console.log(hint)
    const p_task = document.querySelector("p");
    checkHint = true;
    localStorage.setItem("task-6", [mark, checkHint]);
    if (hint){
        p_task.setAttribute("data-tooltip", chooseHint(p_task));
        lampHint.style.transform = "scale(0.88)";
    }else{
        p_task.removeAttribute("data-tooltip");
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
    return [data.userVectors, data.taskVectors]
}