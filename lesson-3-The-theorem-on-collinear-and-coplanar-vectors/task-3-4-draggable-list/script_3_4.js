//https://www.youtube.com/watch?v=wv7pvH1O5Ho
"use strict";
const draggable_list = document.getElementById('draggable-list');
const btnCheck = document.getElementById('check');
const spanResult = document.querySelector('.span-result');

// Store listitems
const listItems = [];

let dragStartIndex;

const checkStorage = () =>{
    if (localStorage.getItem("task-11")){
        if (localStorage.getItem("task-11")[0]) spanResult.textContent = "Результат: " + localStorage.getItem("task-11")[0] + " из 10";
        if (localStorage.getItem("task-11")[0] === "0") spanResult.textContent = "Результат: 0 из 10";  
    }else 
        spanResult.textContent = "Результат: - из 10";
}

const condition = document.createElement('p');
condition.innerHTML = data_task;
draggable_list.appendChild(condition);
let checkHint = false;
checkStorage();
createList();

// Insert list items into DOM
function createList() {
  [...correctSequence].map(a => ({ value: a, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(a => a.value).forEach((sent, index) => {
      const listItem = document.createElement('li');
      listItem.setAttribute('data-index', index);
      listItem.innerHTML = `
        <div class="draggable" draggable="true">
          <p class="sentence-name">${sent}</p>
          <i class="fas fa-grip-lines"></i>
        </div>
      `;
      listItems.push(listItem);
      draggable_list.appendChild(listItem);
    });

  addEventListeners();
}

function dragStart() {
  // console.log('Event: ', 'dragstart');
  dragStartIndex = +this.closest('li').getAttribute('data-index');
}

function dragEnter() {
  this.classList.add('over');
}

function dragLeave() {
  this.classList.remove('over');
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop() {
  const dragEndIndex = +this.getAttribute('data-index');
  swapItems(dragStartIndex, dragEndIndex);

  this.classList.remove('over');
}

// Swap list items that are drag and drop
function swapItems(fromIndex, toIndex) {
  const itemOne = listItems[fromIndex].querySelector('.draggable');
  const itemTwo = listItems[toIndex].querySelector('.draggable');

  listItems[fromIndex].appendChild(itemTwo);
  listItems[toIndex].appendChild(itemOne);
}

// Check the order of list items
function checkOrder() {
    let count = 0;
    const userAnswers = [];
    listItems.forEach((listItem, index) => {
        const  sentence = listItem.querySelector('.draggable').innerText.trim();
        userAnswers.push(sentence);
        if ( sentence !== correctSequence[index]) {
          listItem.classList.add('wrong');
            count--;
        } else {
          listItem.classList.remove('wrong');
          listItem.classList.add('right');
          count++;
    }
  });
    const mark = count <= 0 ? 0 : Math.round(count * score / listItems.length);
    spanResult.textContent = "Результат: " + mark + " из " + score;
    console.log(count, userAnswers);
    localStorage.setItem("task-11", [mark, checkHint]);
   
}

function addEventListeners() {
  const draggables = document.querySelectorAll('.draggable');
  const dragListItems = document.querySelectorAll('.draggable-list li');

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', dragStart);
  });

  dragListItems.forEach(item => {
    item.addEventListener('dragover', dragOver);
    item.addEventListener('drop', dragDrop);
    item.addEventListener('dragenter', dragEnter);
    item.addEventListener('dragleave', dragLeave);
  });
}

btnCheck.addEventListener('click', checkOrder);