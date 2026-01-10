//https://codepen.io/Coding_Journey/pen/LYPNmpe
//https://www.youtube.com/watch?v=7HUCAYMylCQ
"use strict";

const sectionDraggable = document.querySelector(".draggable-items");
const sectionMatching = document.querySelector(".matching-elements");
const condition = document.querySelector(".condition");
const btnRestart = document.querySelector(".restart-btn");
const spanResult = document.querySelector(".result");
const btnCheck = document.querySelector(".check-btn");
const score = 10;
let count, mark, cardData, fieldData;


const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};


const matchingGenerator = (cardData = randomize(data).slice(0, totalDraggableItems))=>{
    const uniqueName = new Set(), uniqueText = new Set();
    
    condition.innerHTML = `<div class="hint"><h3>${cond.header}</h3><img class="sistem-hint" src="./../../paint/hint.png"/><img class="teory-hint" src="./../../paint/lamp.png"/></div><img class="picture-task" src="${cond.img}"/><p>${cond.condition}</p>`;
 
    cardData.forEach(el=>{
        sectionDraggable.innerHTML += el.innerHtml;
    });
    [...sectionDraggable.children].forEach((card, ind)=>{
        card.classList.add('draggable');
        card.setAttribute("draggable", "true");
        card.setAttribute("id", cardData[ind].name);
    });
    //remember objects with the same value
    fieldData = randomize(cardData);
    fieldData.forEach((item)=>{
        uniqueName.add(item.name);
        uniqueText.add(item.text);
    });
    //create fields for insertion
    [...uniqueName].forEach((item, ind)=>{
        const element = document.createElement("div");
        element.classList.add('matching-element');
        element.innerHTML = `<span class="label">${[...uniqueText][ind]}</span><span class="droppable" drop-id="${item}"></span>`;
        sectionMatching.appendChild(element);
    });
    cond.fieldData = fieldData;
    cond.cardData = cardData;
    console.log(fieldData);
}

const commitMatching = ()=>{
    const draggableItems = document.querySelectorAll(".draggable");
    const droppableItems = document.querySelectorAll(".droppable");
    draggableItems.forEach((elem) =>{
        elem.addEventListener("dragstart", dragStart);
    });
    
    droppableItems.forEach((elem) =>{
        elem.addEventListener("dragover", dragOver);
        elem.addEventListener("drop", drop);
    });
}

const dragStart = (event) =>{
    event.dataTransfer.setData("id", event.target.id);
}

const dragOver = (event) =>{
    if (event.target.classList.contains("droppable")){
        event.preventDefault();
    }
}

const drop = (event) =>{
    if (event.target.classList.contains("droppable")){
        event.preventDefault();
        const draggableElData = event.dataTransfer.getData("id");
        const addedElement = document.getElementById(draggableElData);
        event.target.append(addedElement);
        addedElement.setAttribute("parent-id", event.target.getAttribute("drop-id"));
        //event.target.append(document.getElementById(draggableElData));
    }
};

const checkStorage = () =>{
    if (localStorage.getItem("task-8")){
        if (localStorage.getItem("task-8")[0]) spanResult.textContent = "Результат: " + localStorage.getItem("task-8")[0] + " из 10";
        if (localStorage.getItem("task-8")[0] === "0") spanResult.textContent = "Результат: 0 из 10";  
    }else 
        spanResult.textContent = "Результат: - из 10";
}

//const cardData = randomize(data).slice(0, totalDraggableItems); //totalMatchingPairs
let checkHint = false;
checkStorage();
matchingGenerator();
commitMatching();

btnCheck.addEventListener('click', ()=>{
    count = 0, mark = 0;
    //const elemsDraggable = sectionMatching.querySelectorAll("div.draggable");
    const elemsDraggable = sectionMatching.querySelectorAll(".draggable");
    const arrUserAnswers = [];
    elemsDraggable.forEach((item)=>{
        item.getAttribute("parent-id") === item.getAttribute("id")? count++ : count--;
        arrUserAnswers.push({parentId: item.getAttribute("parent-id"), elemId: item.getAttribute("id")});
    });
    mark = count<=0? 0 : Math.round(count * score / totalDraggableItems);
    spanResult.textContent = `Результат: ${mark}`+ " из " + score;
    console.log(arrUserAnswers, count, mark);
    //save data web page
    cond.sectionDraggable = sectionDraggable.querySelectorAll(".draggable");
    cond.sectionMatching = sectionMatching.querySelectorAll(".draggable");
    cond.userAnswers = arrUserAnswers;
    console.log(cond)
    localStorage.setItem("task-8", [mark, checkHint]);
});

btnRestart.addEventListener('click', ()=>{
    count = 0;
    spanResult.textContent = "";
    //spanResult.innerHTML = `Результат: ${count}`;
    const elemsDraggable = document.querySelectorAll(".draggable");
    randomize(elemsDraggable).forEach((item)=>{
        sectionDraggable.append(item);
    });
    spanResult.textContent = "";
    localStorage.removeItem("task-8");
});

const chooseHint = (str)=>{
    if (str.innerText === 'компланарные') return hints[0]
    if (str.innerText === 'не компланарные') return hints[1]
}

let hint = false;
const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    hint = !hint;
    const p_task = document.querySelectorAll("span.label");
    checkHint = true;
    localStorage.setItem("task-8", [mark, checkHint]);
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
            element: document.querySelector("p"),
            intro: "Прочитайте условие"
        },
        {
            element: document.querySelector(".draggable-items"),
            intro: "Перетаскивайте текст из данного поля в поля, расположенные ниже"
        }   
    ]
    }).start();
});

const returnTaskAnswers = ()=>{
    return [data[variant].userAnswers, data[variant].taskAnswers]
}