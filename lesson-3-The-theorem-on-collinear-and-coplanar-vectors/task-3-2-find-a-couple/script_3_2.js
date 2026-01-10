//https://www.youtube.com/watch?v=7JbBr9q4UF8
//https://www.youtube.com/watch?v=dqqxkrKhfS4
//https://www.youtube.com/watch?v=-tlb4tv4mC4
"use strict";
const score = 10;
const numberOfCards = 8;
const numberOfFlipCards = 2;
const section = document.querySelector(".pair");
const form = document.querySelector("form");
const btnCheck = document.querySelector(".check");
const btnReset = document.querySelector(".reset");
const spanResult = document.querySelector(".span-result");
let mark = 0, indexPair = 1, countRightInput = 0; //countRightPair = 0,
let rightPairs = [], allPairs = [], allInputs = [];

const randomInt = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

const createArrNum = ()=>{
    const arr = [];
    for (let i=0; i<numberOfCards; i++){
        const a1 = randomInt(-25, 25);
        const a2 = randomInt(-25, 25);
        const ind = randomInt(-20, 20);
        arr.push([[a1, a2], [a1*ind, a2*ind], ind]);
    }
    return arr;
}

//randomize
const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};

const createData = () =>{
    const dataNum = createArrNum();
    const arrItems = [];
    randomize(dataNum).forEach((item, index) => {
        for (let i=0; i<numberOfFlipCards; i++){
            arrItems.push({name: `pair-${index}`, txt: `(${dataNum[index][i]})`, alfa: `${dataNum[index][2]}`});
        }});
    return randomize(arrItems);
}

//card generation function
const cardGenerator = (cardData) =>{
    form.innerHTML = "Соотношение между выбранными векторами равно (напишите целое число):";
    for (let i=0; i<numberOfCards; i++){
        form.innerHTML += `<div class="form">${i+1}) <input type="text" size="2rem"></div>`;
    }
    cardData.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add('card'); //append class 'card' to the element
        card.setAttribute("name", item.name);
        card.setAttribute("alfa", item.alfa);
        card.innerHTML = `<p class="face"/>${item.txt}</p>`;
        section.appendChild(card);
        
        card.addEventListener('click', (e)=>{
            checkCards(e);
        });     
    });
};

//check cards
const checkCards = (e) =>{
    const clickedCard = e.target;
    if (!clickedCard.classList.contains("clicked")){
        clickedCard.classList.add("clicked");
        const flippedCards = document.querySelectorAll(".clicked");
        const flippedFace = document.querySelectorAll("div.card.clicked p.face");
        createSyle(flippedFace, 'yellow');
        if (flippedCards.length === numberOfFlipCards){
            if([...flippedCards].every(el => el.getAttribute("name") === flippedCards[0].getAttribute("name")) ){
                createSyle(flippedFace, 'lightgreen');
                flippedCards.forEach(card=>{
                    card.classList.remove("clicked");
                    card.style.pointerEvents = "none"; //make anclickable element
                    card.lastElementChild.innerHTML = `(${indexPair}) `+ card.lastElementChild.innerHTML;
                    card.classList.add('right');
                });
                //countRightPair++; 
                indexPair++;
                rightPairs.push(flippedCards);
            }else{
                createSyle(flippedFace, 'red');
                setTimeout(()=>{
                    flippedCards.forEach((card)=>{
                    card.classList.remove("clicked");
                });
                    createSyle(flippedFace, 'white');
                }, 1000);
                //countRightPair--;
            }
            allPairs.push([...flippedCards].map(el=>el.lastElementChild.innerHTML));
        }
    }else {
        clickedCard.firstChild.style.backgroundColor = 'white';
        clickedCard.classList.remove("clicked");
    }
    //mark = countRightPair <= 0 ? 0 : Math.round(countRightPair * score / numberOfCards);
}

const createSyle = (flip, str) =>{
    flip.forEach((elem)=>{
        elem.style.backgroundColor = str;
    });
}


btnReset.addEventListener('click', ()=>{
    mark = 0, countRightInput = 0, rightPairs = [], allInputs = [], allPairs = [];
    //let cardData = createData();
   /* let faces = document.querySelectorAll(".face");
    let cards = document.querySelectorAll(".card");
    createSyle(faces, "white");
    cardData.forEach((item, index)=>{
        cards[index].removeAttribute("style");
        cards[index].setAttribute("name", item.name);
        faces[index].innerHTML = item.txt;
    });*/
    section.replaceChildren();
    form.replaceChildren();
    cardGenerator(randomize(cardData));
    spanResult.textContent = "";
    localStorage.removeItem("task-9");
});   

btnCheck.addEventListener('click', ()=>{
    const arrInputs = document.querySelectorAll("div.form input");
    rightPairs.forEach((card, index) =>{
        if (card[0].getAttribute("alfa") === arrInputs[index].value){
            countRightInput++;
        }
    });
    allInputs.push([...arrInputs].map(el=>el.value));
    const countRightPair = section.querySelectorAll('.right');
    const res = countRightPair.length/numberOfFlipCards - (numberOfCards - countRightInput);
    mark = res <= 0 ? 0 : Math.round(res * score / numberOfCards);
    spanResult.textContent = "Результат: " + mark + " из " + score;
    console.log(allPairs, allInputs);
    console.log(mark);
    localStorage.setItem("task-9", [mark, checkHint]);
});

const checkStorage = () =>{
    if (localStorage.getItem("task-9")){
        if (localStorage.getItem("task-9")[0]) spanResult.textContent = "Результат: " + localStorage.getItem("task-9")[0] + " из 10";
        if (localStorage.getItem("task-9")[0] === "0") spanResult.textContent = "Результат: 0 из 10";  
    }else 
        spanResult.textContent = "Результат: - из 10";
}

let cardData = createData();
let checkHint = false;
checkStorage();
cardGenerator(cardData);

let hint = false;
const lampHint = document.querySelector("img.teory-hint");
lampHint.addEventListener("click", () => {
    hint = !hint;
    const p_task = document.querySelector("strong");
    checkHint = true;
    localStorage.setItem("task-9", [mark, checkHint]);
    if (hint){
        p_task.setAttribute("data-tooltip", "Два вектора коллинеарны, если отношения их координат равны.");
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
            element: document.querySelector("strong"),
            intro: "Прочитайте условие"
        },
        {
            element: document.querySelector("div.card"),
            intro: "Нажимайте на карточки. Желтый цвет - карточка выбрана, зеленый - пара выбрана верно, красный - пара не верно выбрана"
        },
        {
            element: document.querySelector("input"),
            intro: "Введите целое число, которое является соотношением между координатами векторов в каждой паре. Номер пары указан на карточке"
        }
        
    ]
    }).start();
});
