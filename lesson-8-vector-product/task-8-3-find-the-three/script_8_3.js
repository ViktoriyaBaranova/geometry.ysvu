//https://www.youtube.com/watch?v=7JbBr9q4UF8
//https://www.youtube.com/watch?v=dqqxkrKhfS4
//https://www.youtube.com/watch?v=-tlb4tv4mC4
"use strict";

const section = document.querySelector("section.triple");
const btnCheck = document.querySelector(".check");
const btnReset = document.querySelector(".reset");
const spanResult = document.querySelector(".span-result");
const condition = document.querySelector(".condition");
let mark = 0, count = 0;

condition.innerHTML = `<div class="hint"><h3>${cond[0]}</h3><img class="sistem-hint" src="./../../paint/hint.png"/><img class="teory-hint" src="./../../paint/lamp.png"/></div><p>${cond[1]}</p>`;
//randomize
const randomize = (arr) =>{
    return [...arr].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value);   
};

const createData = () =>{
    const arrItems = [];
    randomize(data).slice(0, numberOfCards).forEach((item) => {
        for (let i=0; i<item.imageSrc.length; i++){
            arrItems.push({name: item.name, imageSrc: item.imageSrc[i]});
        }});
    return randomize(arrItems);
}
/*const duplicateArr = (arr, n) =>{
    let newArr = [];
    for (let i=0; i<n; i++){
        newArr = newArr.concat(arr);
    }
    return newArr;
}*/

//card generation function
const cardGenerator = (cardData) =>{
    cardData.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add('card'); //append class 'card' to the element
        card.setAttribute("name", item.name);
        card.innerHTML = `<div class="face"><img src="${item.imageSrc}"/></div>`;
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
        const flippedFace = document.querySelectorAll("div.card.clicked div.face");
        createSyle(flippedFace, 'yellow');

        if (flippedCards.length === numberOfFlipCards){
            if([...flippedCards].every(el => el.getAttribute("name") === flippedCards[0].getAttribute("name")) ){
                createSyle(flippedFace, 'lightgreen');
                flippedCards.forEach((card)=>{
                    card.classList.remove("clicked");
                    card.style.pointerEvents = "none"; //make anclickable element
                    card.classList.add('right');
                });
               //countRightPair++; 
            }else{
                createSyle(flippedFace, 'red');
                setTimeout(()=>{
                    flippedCards.forEach((card)=>{
                    card.classList.remove("clicked");
                });
                    createSyle(flippedFace, 'transparent');
                }, 1000);
                count--;
            }
        }
    }else{
        clickedCard.firstChild.style.backgroundColor = 'white';
        clickedCard.classList.remove("clicked");
    }
    console.log(count);
}

const createSyle = (flip, str) =>{
    flip.forEach((elem)=>{
        elem.style.backgroundColor = str;
    });
}

btnReset.addEventListener('click', ()=>{
     mark = 0;
    /*let cardData = createData();
    let faces = document.querySelectorAll(".face");
    let cards = document.querySelectorAll(".card");
    createSyle(faces, "white");
    cardData.forEach((item, index)=>{
        cards[index].removeAttribute("style");
        cards[index].setAttribute("name", item.name);
        faces[index].src = item.imageSrc;
    });*/
    section.replaceChildren();
    cardGenerator(randomize(cardData));
    spanResult.textContent = "";
    localStorage.removeItem("task-25");
});   

btnCheck.addEventListener('click', ()=>{
    const countRightPair = section.querySelectorAll('.right');
    const res = countRightPair.length / numberOfFlipCards + count;
    mark = res <= 0 ? 0 : Math.round(res * score / numberOfCards);
    spanResult.textContent = "Результат: " + mark + " из " + score;
    console.log(res, count);
    localStorage.setItem("task-25", [mark, checkHint]);
})

const checkStorage = () =>{
    if (localStorage.getItem("task-25")){
        if (localStorage.getItem("task-25")[0]) spanResult.textContent = "Результат: " + localStorage.getItem("task-25")[0] + " из 10";
        if (localStorage.getItem("task-25")[0] === "0") spanResult.textContent = "Результат: 0 из 10";  
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
    const p_task = document.querySelector("p");
    checkHint = true;
    localStorage.setItem("task-25", [mark, checkHint]);
    if (hint){
        p_task.setAttribute("data-tooltip", "Векторное произведение двух векторов - это вектор, координаты которого можно вычислить с помощью определителя третьего порядка. Модуль векторного произведения векторов равен площади параллелограмма, построенного на этих векторах.");
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
            element: document.querySelector(".face"),
            intro: "Нажимайте на карточки. Желтый цвет - карточка выбрана, зеленый - пара выбрана верно, красный - пара не верно выбрана"
        }
    ]
    }).start();
});