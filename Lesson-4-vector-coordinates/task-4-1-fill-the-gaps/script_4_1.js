"use strict";
const btnCheck = document.querySelector(".check");
const btnReset = document.querySelector(".reset");
const formAnsw = document.querySelector("form");
const condition = document.querySelector(".condition");
const spanResult = document.querySelector(".span-result");
var svg = document.getElementById('pic'); 
const quantityGreyVect = 12;
const score = 10;
let  count = 0, mark = 0;
//coords.basis

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
    
const draw_svg_vectors = (arr, color='#b3b3b3', name='pass-vector') =>{
    for (var i = 0; i < arr.length; ++i) 
        draw_svg_vect(arr[i][0], arr[i][1], arr[i][2], arr[i][3], color, name); 
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

const setAttrElem = (i, j, el1, el2, el3)=>{
    el1[i].setAttribute('stroke', '#EEAA00'); //#dc0055 #FF8F40
    el1[i].setAttribute('stroke-width', "2");
    el3[i].style.opacity = 1;
    el2[j].removeAttribute("disabled");
    el2[j+1].removeAttribute("disabled");
}

const formGenerator = (greyVect)=>{
    greyVect.forEach((_, index)=>{
        const formInput = document.createElement("div");
        formInput.style.opacity = 0.5;
        formInput.innerHTML = `c${index+1} =<input type="text" disabled="false" size="1.5rem">a + <input type="text" disabled="false" size="1.5rem">b`;
        formAnsw.appendChild(formInput);
    });
    
    const inputs = formAnsw.querySelectorAll("input");
    const divInp = formAnsw.querySelectorAll("div");
    const passVect = svg.querySelectorAll(".pass-vector");
    setAttrElem(0, 0, passVect, inputs, divInp);

    let i = 1;
    for (let ind=0; ind<inputs.length-2; ind++){
        if (ind % 2 !== 0) inputs[ind].addEventListener("change", ()=>{
            setAttrElem(i, ind+1, passVect, inputs, divInp);
            inputs[ind-1].setAttribute("disabled", "true");
            inputs[ind].setAttribute("disabled", "true");
            passVect[i-1].setAttribute('stroke-width', "1");
            passVect[i-1].setAttribute('stroke', '#1683C9');
            divInp[i-1].style.opacity = 0.5;
            i++;            
    });
    }
    inputs[inputs.length-1].addEventListener("change", ()=>{
        passVect[passVect.length-1].setAttribute('stroke-width', "1");
        passVect[passVect.length-1].setAttribute('stroke', '#1683C9');
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

const sumArrElem = (arr1, arr2)=>{
    return arr1.map((elem, index) => elem + arr2[index]);
}

const variant = randomInt(0, coords.length-1);
coords.basis = coords[variant].basis.map((el, ind)=>{
    const coef = randomInt2(0, 2);
    ind === 0? el[2]+=coef : el[3]-=coef;
});

const checkStorage = () =>{
    if (localStorage.getItem("task-12")){
        if (localStorage.getItem("task-12")[0]) spanResult.textContent = "Результат: " + localStorage.getItem("task-12")[0] + " из 10";
        if (localStorage.getItem("task-12")[0] === "0") spanResult.textContent = "Результат: 0 из 10";  
    }else 
        spanResult.textContent = "Результат: - из 10";
}

console.log(variant, coords.length, coords[variant]);
draw_svg_grid();
draw_svg_vectors(coords[variant].basis, "#224bcf", 'basis-vector'); //#30BA8F  #1A5DA9 #4479D4 #3661A9
svg.innerHTML += `<text x="30", y="56" font-size="8px" stroke="none" fill="#4479D4">a</text>
                  <text x="1", y="45" font-size="8px" stroke="none" fill="#4479D4">b</text>`;
const [blackVect, greyVect] = generateData();
draw_svg_vectors(blackVect, "#414141", 'black-vect');
draw_svg_vectors(greyVect);
let checkHint = false;
checkStorage();
formGenerator(greyVect);

btnCheck.addEventListener("click", () => {
    count = 0, mark = 0;
    let index = 0;
    const inputs = document.querySelectorAll("input");
    const arrVectSum = [];
    const coordsBasisVectors = coordVect(coords[variant].basis);
    const coordGreyVect = coordVect(greyVect);
    for(let i=0; i<greyVect.length; i++){
        const a = multiplyArrElem(coordsBasisVectors[0], inputs[index].value);
        const b = multiplyArrElem(coordsBasisVectors[1], inputs[index+1].value);
        arrVectSum.push(sumArrElem(a, b));
        index +=2;
    }
    let i = 0;
    arrVectSum.forEach((el, ind)=>{
        count += (el.every((val, ind)=>val == coordGreyVect[i][ind])) ? 1 : -1;
        i++;
    });
    mark = count <= 0 ? 0 : Math.round(count * score / greyVect.length);
    spanResult.textContent = "Результат: " + mark + " из " + score;
    console.log(count, mark, "vectSum", arrVectSum, "coordGreyVect", coordGreyVect);
    coords[variant].userVectSum = arrVectSum;
    coords[variant].taskVectSum = coordGreyVect;
    localStorage.setItem("task-12", [mark, checkHint]);
});

btnReset.addEventListener("click", () => {
    const passVect = svg.querySelectorAll(".pass-vector");
    passVect.forEach(el=>{
        el.setAttribute('stroke', '#b3b3b3'); //#dc0055
        el.setAttribute('stroke-width', "1");
    });
    formAnsw.replaceChildren();
    localStorage.removeItem("task-12");
    formGenerator(greyVect);
    
})

let hint = false;
const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    hint = !hint;
    const p_task = document.querySelector("p");
    checkHint = true;
    localStorage.setItem("task-12", [mark, checkHint]);
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
            intro: "Введите координаты вектора (желтого), изображенного на рисунке. После ввода координат данная строка будет недоступна для редактирования"
        }
        
    ]
    }).start();
});