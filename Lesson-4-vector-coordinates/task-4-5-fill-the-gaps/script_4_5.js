"use strict";
const btnCheck = document.querySelector(".check");
const btnReset = document.querySelector(".reset");
const formAnsw = document.querySelector("form");
const condition = document.querySelector(".condition");
const spanResult = document.querySelector(".span-result");
var svg = document.getElementById('pic'); 
const quantityGreyVect = 15, numberOfSumVect = 3;
const score = 10;
let  count = 0, mark = 0;

condition.innerHTML = `<div class="hint"><h2>${cond.header}</h2><img class="sistem-hint" src="./../../paint/hint.png"/><img class="teory-hint" src="./../../paint/lamp.png"/></div><p>${cond.condition}</p><p>${cond.note}</p>`;

const draw_svg_line = (x1, y1, x2, y2, width, color) =>{
    x1 *= 10; y1 *= 10; x2 *= 10; y2 *= 10;
    const path_line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var s_line = `M ${x1} ${y1} L ${x2} ${y2} `;
    path_line.setAttribute('d', s_line);
    path_line.setAttribute('stroke-linecap', 'round');
    path_line.setAttribute('stroke-linejoin', 'round');
    path_line.setAttribute('stroke-width', width); //'1'
    path_line.setAttribute('stroke', color);//'#E0E0E0'
    
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
    path_vect.setAttribute('stroke-width', '1');
    path_vect.setAttribute('stroke', color);
    path_vect.setAttribute('data-len', len / 10);  
    path_vect.classList.add(name);
    svg.appendChild(path_vect);
}

const draw_svg_grid = () =>{
    let sizeSvg = 14;
    for (var i = 0; i < sizeSvg+2; ++i){
        draw_svg_line(i, 0, i, sizeSvg+1, '0.5', '#dcdcdc');
        draw_svg_line(0, i, sizeSvg+1, i, '0.5', '#dcdcdc');
    }
}
    
const draw_svg_picture = (arr, color='#b3b3b3', name='pass-vector') =>{
    for (var i = 0; i < arr.length; ++i) 
        draw_svg_vect(arr[i][0], arr[i][1], arr[i][2], arr[i][3], color, name); 
    svg.innerHTML += `<text x="${coords[variant].basis[0][2]*10+2}", y="${coords[variant].basis[0][3]*10+2}">i</text>
                  <text x="${coords[variant].basis[1][2]*10-8}", y="${coords[variant].basis[1][3]*10+2}">j</text>`;
}

const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};

const randomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

const randomInt2 = (min, max) => {
  let rand = Math.round(min - 0.5 + Math.random() * (max - min + 1));
  return rand % 2 == 0 ? rand :  randomInt2(0, 2);
}

const generateData = ()=>{
    const coordsVectors = [];
    let  greyVect =[], blackVect = [];
    for (let i=0; i<coords[variant].points.length - 1; i++)
        coordsVectors.push([...coords[variant].points[i], ...coords[variant].points[i+1]]);  
    const rand = randomInt(0, quantityGreyVect);
    blackVect = coordsVectors.splice(rand, coordsVectors.length-quantityGreyVect);
    return [blackVect, coordsVectors];
}

const randomCoefs = ()=>{
    let coefs = new Array(quantityGreyVect / numberOfSumVect);
    for (let j=0; j<quantityGreyVect / numberOfSumVect; j++){
        coefs[j] = new Array(numberOfSumVect);
        for(let i=0; i<numberOfSumVect; i++)
            coefs[j][i] = randomInt(-4, 4);
    }   
    coords[variant].coef = coefs;
    return coefs;
}

const getNameToVect =()=>{
    const sectionNameVect = document.createElement('section');
    sectionNameVect.style.marginLeft = "15px";
    sectionNameVect.classList.add('name-vect');
    formAnsw.appendChild(sectionNameVect);
    const nameVect = ["a", "b", "c"];
    const colorVect = ['#EEAA00', '#00b74e', '#dd0055'];
    for (let k=0; k<numberOfSumVect; k++){
        const span = document.createElement('span');
        span.style.width = "20px";
        span.textContent += nameVect[k];
        span.style.backgroundColor = colorVect[k];
        sectionNameVect.appendChild(span);
    }
}

const setAttrElem = (n, i, j, vect, inp, divInp)=>{
    const colors = ['#EEAA00', '#00b74e', '#dd0055'];
    for (let k=0; k<numberOfSumVect; k++){
        vect[i+k].setAttribute('stroke', colors[k]); //#dc0055 #FF8F40
        vect[i+k].setAttribute('stroke-width', "2");
    }
    divInp[n].style.opacity = 1;
    inp[j].removeAttribute("disabled");
    inp[j+1].removeAttribute("disabled");
}

const resetAttrElem = (n, i, j, vect, inp, divInp)=>{
    for (let k=0; k<numberOfSumVect; k++){
        vect[i-k].setAttribute('stroke-width', "1"); //i-1=i
        vect[i-k].setAttribute('stroke', '#1683C9');//224bcf
    }
    inp[j].setAttribute("disabled", "true"); //ind-1=j
    inp[j+1].setAttribute("disabled", "true");
    divInp[n].style.opacity = 0.5;
}

const formGenerator = (greyVect, coefs)=>{
    getNameToVect();
    coefs.forEach((_, index)=>{
        const formInput = document.createElement("div");
        formInput.style.opacity = 0.5;
        formInput.innerHTML = `p${index+1} = ${coefs[index][0]}a + ${coefs[index][1]}b + ${coefs[index][2]}c; p${index+1}={<input type="text" disabled="false" size="1.5rem">; <input type="text" disabled="false" size="1.5rem">}`;
        formAnsw.appendChild(formInput);
    });
    
    const inputs = formAnsw.querySelectorAll("input");
    const divInp = formAnsw.querySelectorAll("div");
    const passVect = svg.querySelectorAll(".pass-vector");
    setAttrElem(0, 0, 0, passVect, inputs, divInp);
    let n=1;
    /*svg.innerHTML += `<text x="${greyVect[n][0]*10+2}", y="${greyVect[n][1]*10+2}">a</text><text x="${greyVect[n+1][0]*10+2}", y="${greyVect[n+1][1]*10+2}">b</text><text x="${greyVect[n+2][0]*10+2}", y="${greyVect[n+2][1]*10+2}">c</text>`;*/
    let i = 3;
    for (let ind=0; ind<inputs.length-2; ind++){
        if (ind % 2 !== 0) inputs[ind].addEventListener("change", ()=>{
            setAttrElem(n, i, ind+1, passVect, inputs, divInp);
            resetAttrElem(n-1, i-1, ind-1, passVect, inputs, divInp);
            /*const svgTxt = svg.querySelectorAll("text");
            svgTxt.forEach(el=>svg.removeChild(el));
            
            svg.innerHTML += `<text x="${greyVect[i+1][0]*10+2}", y="${greyVect[i+1][1]*10+2}">a</text><text x="${greyVect[i+2][0]*10+2}", y="${greyVect[i+2][1]*10+2}">b</text><text x="${greyVect[i+3][0]*10+2}", y="${greyVect[i+3][1]*10+2}">c</text>`;*/
            i+=3, n++;
    });
    }
    inputs[inputs.length-1].addEventListener("change", ()=>{
        for (let k=1; k<numberOfSumVect+1; k++){
        passVect[passVect.length-k].setAttribute('stroke-width', "1"); 
        passVect[passVect.length-k].setAttribute('stroke', '#1683C9');
    }
        divInp[divInp.length-1].style.opacity = 0.5;
    });
}

const coordVect = (arr)=>{
    const arr2 = [];
    arr.forEach(item =>{
        arr2.push([item[2]-item[0], item[3]-item[1]]);
    });
    return arr2;
}

const multiplyArrElem = (arr, coef)=>{
    return arr.map(elem => elem * Number(coef));
}

const sumArrElem = (arr1, arr2, arr3)=>{
    return arr1.map((elem, index) => elem + arr2[index] + arr3[index]);
}

const checkStorage = () =>{
    if (localStorage.getItem("task-15")){
        if (localStorage.getItem("task-15")[0]) spanResult.textContent = "Результат: " + localStorage.getItem("task-15")[0] + " из 10";
        if (localStorage.getItem("task-15")[0] === "0") spanResult.textContent = "Результат: 0 из 10";  
    }else 
        spanResult.textContent = "Результат: - из 10";
}

const variant = randomInt(0, coords.length-1);
const coefs = randomCoefs();
draw_svg_grid();
const [blackVect, greyVect] = generateData();
draw_svg_picture(coords[variant].basis, "#224bcf", 'basis-vector'); 
draw_svg_picture(blackVect, "#414141", 'black-vect');
draw_svg_picture(greyVect);
let checkHint = false;
checkStorage();
formGenerator(greyVect, coefs);

btnCheck.addEventListener("click", () => {
    count = 0, mark = 0;
    let index = 0;
    const inputs = document.querySelectorAll("input");
    const userCoordVect = [], coordVectSum = [];
    const numerOfTask = quantityGreyVect / numberOfSumVect;
    for (let i=0; i<numerOfTask + 4; i+=2)
        userCoordVect.push([inputs[i].value, inputs[i+1].value]); 
    
    coords[variant].userCoordVect = userCoordVect;
    coords[variant].coordGreyVect = coordVect(greyVect);
    const coordsBasisVectors = coordVect(coords[variant].basis);
    for(let i=0; i<numerOfTask; i++){
        const a = multiplyArrElem(coords[variant].coordGreyVect[i], coefs[i][0]);
        const b = multiplyArrElem(coords[variant].coordGreyVect[i+1], coefs[i][1]);
        const c = multiplyArrElem(coords[variant].coordGreyVect[i+2], coefs[i][2]);
        coordVectSum.push(sumArrElem(a, b, c));
    }
    coordVectSum.forEach((el)=>{
        el[0] /= coordsBasisVectors[0][0];
        el[1] /= coordsBasisVectors[1][1];
    });
    coords[variant].coordVectSum = coordVectSum;
    coordVectSum.forEach((el, index)=>{
        count += (el.every((val, ind)=>val == userCoordVect[index][ind])) ? 1 : -1;
    });
    mark = count <= 0 ? 0 : Math.round(count * score / numerOfTask);
    spanResult.textContent = "Результат: " + mark + " из " + score;
    console.log(count, mark, "coords", coords);
    localStorage.setItem("task-15", [mark, checkHint]);
});

btnReset.addEventListener("click", () => {
    const passVect = svg.querySelectorAll(".pass-vector");
    passVect.forEach(el=>{
        el.setAttribute('stroke', '#b3b3b3'); //#dc0055
        el.setAttribute('stroke-width', "1");
    });
    spanResult.textContent = "";
    formAnsw.replaceChildren();
    localStorage.removeItem("task-15");
    formGenerator(greyVect, coefs);
});

let hint = false;
const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    hint = !hint;
    const p_task = document.querySelector("p");
    checkHint = true;
    localStorage.setItem("task-15", [mark, checkHint]);
    if (hint){
        p_task.setAttribute("data-tooltip", "Равенство = ax + by называется разложением вектора по базису (a, b) или разложением вектора по базисным векторам a и b; числа x, y называются координатами вектора в базисе (a, b). Обратите внимание, что длина базисных векторов не всегда равна 1");
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
            element: document.querySelector("form div"),
            intro: "Введите координаты вектора. После ввода координат данная строка будет недоступна для редактирования"
        }
        
    ]
    }).start();
});