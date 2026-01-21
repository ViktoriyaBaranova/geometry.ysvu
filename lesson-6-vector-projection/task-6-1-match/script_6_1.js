//https://codepen.io/Coding_Journey/pen/LYPNmpe
//https://www.youtube.com/watch?v=7HUCAYMylCQ
"use strict";

const sectionDraggable = document.querySelector(".draggable-items");
const sectionMatching = document.querySelector(".matching-elements");
const condition = document.querySelector(".condition");
const btnCheck = document.querySelector(".check-btn");
const btnRestart = document.querySelector(".restart-btn");
const spanResult = document.querySelector(".span-result");
const score = 10;
let count, mark, cardData, fieldData;
localStorage.setItem("task-16", "0");

const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};


const matchingGenerator = (cardData = randomize(data).slice(0, totalDraggableItems))=>{
    const uniqueName = new Set(), uniqueText = new Set();
    
    condition.innerHTML = `<div class="hint"><h3>${cond.header}</h3><img class="sistem-hint" src="./../../paint/hint.png"/><img class="teory-hint" src="./../../paint/lamp.png"/></div><p>${cond.condition}</p>`;
 
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
}

const checkStorage = () =>{
    if (localStorage.getItem("task-16")){
        if (localStorage.getItem("task-16")[0]) spanResult.textContent = "Количество баллов: " + localStorage.getItem("task-16")[0] + " из 10";
        if (localStorage.getItem("task-16")[0] === "0") spanResult.textContent = "Количество баллов: 0 из 10";  
    }else 
        spanResult.textContent = "Количество баллов: - из 10";
}

//const cardData = randomize(data).slice(0, totalDraggableItems); //totalMatchingPairs
matchingGenerator();
let checkHint = false;

commitMatching();

btnCheck.addEventListener('click', ()=>{
    count = 0, mark = 0;
    //const elemsDraggable = sectionMatching.querySelectorAll("div.draggable");
    const elemsDraggable = sectionMatching.querySelectorAll(".draggable");
    const arrUserAnswers = [];
    elemsDraggable.forEach((item)=>{
        item.getAttribute("parent-id") === item.getAttribute("id")? count++ : 0;
        arrUserAnswers.push({parentId: item.getAttribute("parent-id"), elemId: item.getAttribute("id")});
    });
    mark = count<=0? 0 : Math.round(count * score / totalDraggableItems);
    console.log(arrUserAnswers, count, mark);
    //save data web page
    cond.sectionDraggable = sectionDraggable.querySelectorAll(".draggable");
    cond.sectionMatching = sectionMatching.querySelectorAll(".draggable");
    spanResult.textContent = "Количество баллов: " + mark + " из " + score;
    localStorage.setItem("task-16", [mark, checkHint]);
});

checkStorage();

btnRestart.addEventListener('click', ()=>{
    count = 0;
    spanResult.textContent = "";
    const elemsDraggable = document.querySelectorAll(".draggable");
    randomize(elemsDraggable).forEach((item)=>{
        sectionDraggable.append(item);
    });
    localStorage.removeItem("task-20");
})

let hint = false;
const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    hint = !hint;
    const p_task = document.querySelectorAll("span.label");
    checkHint = true;
    localStorage.setItem("task-16", [mark, checkHint]);
    if (hint){
        [...p_task].forEach((el, ind)=> el.setAttribute("data-tooltip", cond.hints));
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

