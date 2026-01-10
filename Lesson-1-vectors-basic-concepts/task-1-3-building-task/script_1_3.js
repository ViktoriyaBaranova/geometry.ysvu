"use strict";
const btnCheck = document.querySelector(".check");
const btnReset = document.querySelector(".reset");
const formAnsw = document.querySelector("form");
const condition = document.querySelector(".condition");
const spanResult = document.querySelector(".span-result");
var svg = document.getElementById('pic'); 
const score = 10;
const numberOfClickCircles = 2;
let clickedCircles = [], userVect = [], conditionVect = [], mark=0;

const randomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

const variant = randomInt(0, data.length-1);
condition.innerHTML = `<div class="hint"><h2>${data[variant].condition[0]}</h2><img class="sistem-hint" src="./../../paint/hint.png"/><img class="teory-hint" src="./../../paint/lamp.png"/></div><p>${data[variant].condition[1]}</p>`;

const draw_svg_line = (x1, y1, x2, y2, width, color) =>{
    x1 *= 10; y1 *= 10; x2 *= 10; y2 *= 10;
    const path_line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var s_line = `M ${x1} ${y1} L ${x2} ${y2} `;
    path_line.setAttribute('d', s_line);
    path_line.setAttribute('stroke-linecap', 'round');
    path_line.setAttribute('stroke-linejoin', 'round');
    path_line.setAttribute('stroke-width', width);
    path_line.setAttribute('stroke', color);
    
    svg.appendChild(path_line);
}

const draw_svg_vect = (x1, y1, x2, y2, color, name) =>{
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
    path_vect.setAttribute('stroke', color);
    path_vect.setAttribute('data-len', len / 10);  
    path_vect.classList.add(name);
    svg.appendChild(path_vect);
}

const draw_svg_circles = (x, y, color)=>{
    x *= 10; y *= 10;
    const circles = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circles.setAttribute("cx",x);
    circles.setAttribute("cy",y);
    circles.setAttribute("r",1.3);
    circles.setAttribute("stroke", color);
    circles.setAttribute("stroke-width", "0.5");
    circles.setAttribute("fill", "#DBE1F9");
    svg.appendChild(circles);
   // <circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" />
    circles.addEventListener('click', (e)=>{
            const coordClickedCircles = checkCircles(e);
            if (coordClickedCircles){
                draw_svg_vect(coordClickedCircles[0], coordClickedCircles[1], coordClickedCircles[2], coordClickedCircles[3], '#1683C9', 'user-vect'); //224bcf
            }
        });
}
const draw_svg_grid = () =>{
    let sizeSvg = 11;
    for (var i = 0; i < sizeSvg+2; ++i){
        draw_svg_line(i, 0, i, sizeSvg+1, '0.5', '#dcdcdc');
        draw_svg_line(0, i, sizeSvg+1, i, '0.5', '#dcdcdc');
    }
}
    
const draw_svg_picture = () =>{
    data[variant].lines.forEach(el=>draw_svg_line(el[0], el[1], el[2], el[3], '1', '#414141'));
    //const vect = createVectorsData();
    conditionVect = randomize(data[variant].conditionVect)[0];
    console.log(conditionVect);
    data[variant].points.forEach(el=>draw_svg_circles(el[0], el[1], '#224bcf'));
    draw_svg_vect(conditionVect[0], conditionVect[1], conditionVect[2], conditionVect[3], '#EEAA00', 'condition-vect');
}

const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};

/*const createVectorsData=()=>{
    const vect = [];
    data[variant].points = randomize(data[variant].points);
    vect.push([data[variant].points[0], data[variant].points[1]]);
    data[variant].conditionVect = vect.flat(2);
    return vect.flat(2);
}*/

const createSyle = (click, str1, str2, width) =>{
    click.forEach((elem)=>{
        elem.setAttribute('stroke', str1);
        elem.setAttribute('fill', str2);
        elem.setAttribute("stroke-width", width);
    });
}

const checkCircles = (e)=>{
    const clickedCircle = e.target;
    let coordClickedCircles = [];
    if (!clickedCircle.classList.contains("clicked")){
        clickedCircle.classList.add("clicked");
        clickedCircles.push(clickedCircle);
        createSyle(clickedCircles, '#224bcf', '#224bcf');
        if (clickedCircles.length === numberOfClickCircles){
            //for (let i=1; i>-1; i--) {
            for (let i=0; i<numberOfClickCircles; i++){
                coordClickedCircles.push(Number(clickedCircles[i].getAttribute("cx"))/10);
                coordClickedCircles.push(Number(clickedCircles[i].getAttribute("cy"))/10);
            }
            userVect.push(coordClickedCircles);
            data[variant].userVect = userVect;
            clickedCircles.forEach(el=> el.classList.remove("clicked"));
            createSyle(clickedCircles, '#224bcf', '#DBE1F9', '0.5');
            clickedCircles = [];
        return coordClickedCircles;  
        }
    }else{
        clickedCircle.classList.remove("clicked");
        createSyle(clickedCircles, '#224bcf', '#DBE1F9', '0.5');
        clickedCircles = [];
    }
}

const coordVect = (arr)=>{
    const arr2 = [];
    arr.forEach(item =>{
        arr2.push([item[2]-item[0], item[3]-item[1]]);
    });
    return arr2;
}

btnCheck.addEventListener("click", () => {
    let count = 0;
    mark = 0;
    let taskAnswers = [];
    const coordCondVect = coordVect([conditionVect]);
    const coordUserVect = coordVect(data[variant].userVect);
    if (data[variant].condition[2] === "равные"){
        coordUserVect.forEach(el=>{
        count += el.every((elem, index) => elem === coordCondVect[0][index])? 1 : -1;
        });
    }
    if (data[variant].condition[2] === "коллинеарные"){
        coordUserVect.forEach(el=>{
        count += (el[0]*coordCondVect[0][1]-el[1]*coordCondVect[0][0] === 0)? 1 : -1;
        console.log(el[0], coordCondVect[0][1], el[1], coordCondVect[0][0])    
        });
    }
    mark = count <= 0 ? 0 : Math.round(count * score / data[variant].numberOfAnswVect);
    spanResult.textContent = "Результат: " + mark + " из " + score;
    console.log(data, count, mark, coordCondVect, coordUserVect, data[variant].userVect);
    data[variant].userAnswers = coordUserVect;
    data[variant].taskAnswers = coordCondVect;
    localStorage.setItem("task-2", [mark, checkHint]);
});

btnReset.addEventListener("click", () => {
    const vect = svg.querySelectorAll('.user-vect');
    vect.forEach(el=>{
        svg.removeChild(el);
    });
    spanResult.textContent = "";
    data[variant].userVect = [], userVect = [];
    console.log(data);
    localStorage.removeItem("task-2");
});

const checkStorage = () =>{
    if (localStorage.getItem("task-2")){
        if (localStorage.getItem("task-2")[0]) spanResult.textContent = "Результат: " + localStorage.getItem("task-2")[0] + " из 10";
        if (localStorage.getItem("task-2")[0] === "0") spanResult.textContent = "Результат: 0 из 10";  
    }else 
        spanResult.textContent = "Результат: - из 10";
}

draw_svg_grid();
draw_svg_picture();
let checkHint = false;
checkStorage();

const chooseHint = (str)=>{
    if (str.innerText.indexOf('равные') !== -1) return hints[0]
    if (str.innerText.indexOf('коллинеарные') !== -1) return hints[1]
}

let hint = false;
const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    hint = !hint;
    const p_task = document.querySelector("p");
    checkHint = true;
    localStorage.setItem("task-2", [mark, checkHint]);
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
            intro: "Изобразите векторы, соответствующие условию на данной картинке"
        },
        {
            element: document.querySelector("circle"),
            intro: "Нажимайте на точки, чтобы рисовать векторы"
        }  
    ]
    }).start();
});

const returnTaskAnswers = ()=>{
    return [data[variant].userAnswers, data[variant].taskAnswers]
}