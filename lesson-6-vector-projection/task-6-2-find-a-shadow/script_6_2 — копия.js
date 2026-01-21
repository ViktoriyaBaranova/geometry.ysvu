// const fs = require('fs');
// const dataJSON = fs.readFileSync(`${__dirname}/data_6_2.json`, 'utf-8');
// const data = JSON.parse(dataJSON);
// console.log('json', data);
let svg = document.getElementById('pic'); 
const form = document.querySelector('.form');
const btnCheck = document.querySelector(".check");
const btnBack = document.querySelector(".back");
const btnReset = document.querySelector(".reset");
const spanResult = document.querySelector(".span-result");
localStorage.setItem("task-21", "0");

let sizeSvg = 14, 
    count = 0,
    mark = 0, 
    countVect = 0,
    countInput = 0;
const variant = 0, 
      coordAxes = [[1, sizeSvg+1, 1, 1], [0, sizeSvg,  sizeSvg+1, sizeSvg]];
let rest = data[variant].vectors.length;
let answInputs = [], 
    arrInputs = [], 
    answColorVect = [];

const draw_svg_line = (x1, y1, x2, y2) =>{
    x1 *= 10; y1 *= 10; x2 *= 10; y2 *= 10;
    const path_line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var s_line = `M ${x1} ${y1} L ${x2} ${y2} `;
    path_line.setAttribute('d', s_line);
    path_line.setAttribute('stroke-linecap', 'round');
    path_line.setAttribute('stroke-linejoin', 'round');
    path_line.setAttribute('stroke-width', '1');
    path_line.setAttribute('stroke', '#E0E0E0');
    
    svg.appendChild(path_line);
}

const draw_svg_vect = (arr, color = '#414141', width, name) =>{
    let x1 = arr[0], y1 = arr[1], x2 = arr[2], y2 = arr[3];
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
    path_vect.setAttribute('stroke-width', width);
    path_vect.setAttribute('stroke', color);
    path_vect.setAttribute('data-len', len / 10);  
    path_vect.classList.add(name);
    svg.appendChild(path_vect);
}

const draw_svg_grid = () =>{
    for (var i = 0; i < sizeSvg+2; ++i){
        draw_svg_line(i, 0, i, sizeSvg+1);
        draw_svg_line(0, i, sizeSvg+1, i);
    }
    for (let i = 0; i < coordAxes.length; i++) draw_svg_vect(coordAxes[i], '1.5', 'coordAxes');
}

const randomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

//randomize
const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};
let colorProj = randomize(data[variant].colorVect);
    //Array(data[variant].projections.length).fill('#dcdcdc'),
data[variant].colorVect = Array(data[variant].vectors.length).fill('#dcdcdc');
data[variant].colorProj = colorProj;

const drawTask = (colorVect, colorProj)=>{
    const elH2 = document.querySelector('.condition');
    elH2.innerHTML = `<div class="hint"><h3>${data[variant].condition[0]}</h3><img class="sistem-hint" src="./../../paint/hint.png"/><img class="teory-hint" src="./../../paint/lamp.png"/></div><p>${data[variant].condition[1]}</p>`;
    draw_svg_grid();
    //colorVectors = randomize(data[variant].color);
    data[variant].vectors.forEach((el, index) => {
        draw_svg_vect(el, colorVect[index], '2', 'vector'); 
    });
    data[variant].projections.forEach((el, ind)=>{
        draw_svg_vect(el, colorProj[ind], '2', 'projection');
    });
    console.log(data);
}

const clickVectors = (e, skalar)=>{
    const clickedVect = e.target;
    if (!clickedVect.classList.contains("clicked")){
        clickedVect.classList.add("clicked");
        clickedVect.setAttribute('stroke-width', '3');
        const chooseVectors = document.querySelectorAll(".clicked");
        let color;
        if (chooseVectors.length === 2){
            if (chooseVectors[0].classList.contains('projection'))
                color = chooseVectors[0].getAttribute('stroke') === '#dcdcdc'? chooseVectors[1].getAttribute('stroke'): chooseVectors[0].getAttribute('stroke');
            else 
                color = chooseVectors[1].getAttribute('stroke') === '#dcdcdc'? chooseVectors[0].getAttribute('stroke'): chooseVectors[1].getAttribute('stroke');

            chooseVectors.forEach((elem)=>{
                elem.setAttribute('stroke', color);
                elem.classList.remove("clicked");
                if (elem.classList.contains('vector')) elem.style.pointerEvents = "none";
                setTimeout(()=>{ 
                   elem.setAttribute('stroke-width', '1.7');
                }, 700);

            form.innerHTML = `<p>Скалярная проекция выбранного вектора равна:</p><div class="task"><div class="color" style="background-color: ${color}"></div><input skalar = "${skalar}" style='text'></div>`;

            const input = document.querySelector('input');
            input.addEventListener('change', ()=>{
                answInputs.push(input.value);
                form.innerHTML = '';
                arrInputs.push(skalar);
                console.log('input change', answInputs, arrInputs);

                });
            });
        }
    }else{
        clickedVect.classList.remove("clicked");
        clickedVect.setAttribute('stroke-width', '2');
    }
}

const talkColor=(color)=>{
    switch (color){
        case '#F2E01F': return 'жёлтый';
        case '#963E2A': return 'коричневый';
        case '#F2E01F': return 'жёлтый';
        case '#FF3B84': return 'розовый';
        case '#38CEF3': return 'голубой';
        case '#2788DB': return 'синий';
        case '#2CF2AD': return 'зеленый';
        case '#B87FB6': return 'фиолетовый';  
        case '#FF6947': return 'оранжевый'; 
        case '#dcdcdc': return 'серый'; 
            
    }
}

const addEventToVect = (arr1, arr2)=>{
    arr1.forEach((el, index)=>{
        el.classList.add(arr2[index][4]);
        el.addEventListener('click', (e)=>{
            clickVectors(e, arr2[index][5]);
        });   
    });   
}

const matchingGenerator = ()=>{
    const arrVect = svg.querySelectorAll('path.vector');
    const arrProj = svg.querySelectorAll('path.projection');
    addEventToVect(arrVect, data[variant].vectors);
    addEventToVect(arrProj, data[variant].projections);
}

const checkStorage = () =>{
    if (localStorage.getItem("task-21")){
        if (localStorage.getItem("task-21")[0]) spanResult.textContent = "Количество баллов: " + localStorage.getItem("task-21")[0] + " из 16";
        if (localStorage.getItem("task-21")[0] === "0") spanResult.textContent = "Количество баллов: 0 из 16";  
    }else 
        spanResult.textContent = "Количество баллов: - из 16";
}

drawTask(data[variant].colorVect, data[variant].colorProj);
let checkHint = false;
checkStorage();
matchingGenerator();

btnCheck.addEventListener('click', ()=>{
   countInput = 0, countVect = 0, mark = 0;
   for (let i=0; i<data[variant].projections.length; i++){
        const sameElem = svg.querySelectorAll(`.group-${i+1}`);
        const colorElem = sameElem[0].getAttribute('stroke');
        if ([...sameElem].every(el=>el.getAttribute('stroke') === colorElem)) countVect++;
    }
    console.log("count vect", countVect);
    arrInputs.forEach((el, ind)=>{
        if (el == answInputs[ind]) countInput++; 
        console.log("count input", countInput);
    });
    /*mark = count <= 0 ? 0 : Math.round(count * data[variant].score / data[variant].vectors.length * 2);*/
    mark = countVect + countInput;
    data[variant].rightAnswerInput = arrInputs;
    data[variant].userAnswerInput = answInputs;
    data[variant].mark = mark;
    spanResult.textContent = "Количество баллов: " + mark + " из " + data[variant].score;
    localStorage.setItem("task-21", [mark, checkHint]);
    
    arrInputs = [], answInputs = [], answColorVect = []; 
    //count = 0, mark = 0;
    console.log("check", data);
    //save data web page
    const vect = svg.querySelectorAll('.vector');
    const colorVect =[...vect].map(el=> el.getAttribute('stroke'));
    const proj = svg.querySelectorAll('.projection');
    const colorProj =[...proj].map(el=> el.getAttribute('stroke'));
    data[variant].colorProj = colorProj;
    data[variant].colorVect = colorVect;

});

btnReset.addEventListener('click', ()=>{
    arrInputs = [], answInputs = [], answColorVect = [], count = 0, mark = 0;
    const arrVect = svg.querySelectorAll('path.vector');
    const arrProj = svg.querySelectorAll('path.projection');
    arrVect.forEach((el, index)=>{
        el.setAttribute('stroke', data[variant].colorVect[index]);
        el.style.pointerEvents = "all";
    });
    arrVect.forEach((el, index)=>{
        el.setAttribute('stroke', '#dcdcdc');
    });
    form.replaceChildren();
    data[variant].rightAnswerInput = arrInputs;
    data[variant].userAnswerInput = answInputs;
    data[variant].mark = mark;
    colorProj = Array(data[variant].projections.length).fill('#dcdcdc');
    data[variant].colorProj = colorProj;
    console.log("reset", data);
    localStorage.removeItem("task-21");
});

let hint = false;
const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    hint = !hint;
    const p_task = document.querySelector("p");
    checkHint = true;
    localStorage.setItem("task-21", [mark, checkHint]);
    if (hint){
        p_task.setAttribute("data-tooltip", "Геометрическая проекция вектора — это вектор, который можно получить, если провести перпендикуляры от концов вектора до выбранной оси. Скалярной проекцией (Пр ) вектора на ось L называется скаляр, абсолютная величина которого равна модулю векторной проекции того же вектора на ту же ось.");
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
            intro: "Нажимайте на пары - цветной вектор и его тень"
        }        
    ]
    }).start();
});
