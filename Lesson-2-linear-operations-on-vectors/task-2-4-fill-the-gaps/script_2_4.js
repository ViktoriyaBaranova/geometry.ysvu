"use strict";
let num_task = Math.floor(Math.random() * dataCondition.mainCondition.length);
let arrAnswForSolution = dataCondition.mainCondition[num_task].answerForSolution.split(", "); 
const arrAnswForJF = dataCondition.mainCondition[num_task]?.answerForJustification;
const btnCheck = document.createElement("button");
const divCondition = document.querySelector(".condition");
const sectionResult = document.querySelector(".section-result");
const spanResult = document.querySelector(".span-result");
let answer, count, mark;
localStorage.setItem("task-7", "0");

divCondition.innerHTML += `<h2>${dataCondition.header}</h2>`;
divCondition.innerHTML += `<span>${dataCondition.mainCondition[num_task].condition}</span>`;
localStorage.setItem("task-3", "0");

function createForms(inputs, solution, answ, sectoinForms){
    let mainForm = document.createElement("form");
    sectoinForms.append(mainForm);

    //create text and inputs
    for(let i=0; i<solution.length; i++){
        let t_1 = document.createElement('p');
        t_1.innerHTML = solution[i];
        mainForm.append(t_1);
        if (i < answ.length){
            let input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("size", answ[i].length+2);
	    input.style.background = "white";
            mainForm.append(input);
            inputs.push(input);
        }
    }
    //create button Reset
    const btnReset = document.createElement("input");
    btnReset.setAttribute("type", "reset");
    btnReset.setAttribute("value", "Очистить");
    btnReset.style.border = "none";
    btnReset.style.background = "#DBE1F9";
    btnReset.setAttribute("id", "clearButton");
    mainForm.append(btnReset);
    document.getElementById('clearButton').addEventListener('click', function() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.background = "white";
       });
    btnReset.style.background = "#DBE1F9";
    });

    return inputs;
}




const createDisplay = function(answ, btnCheck){
    let sectoinForms = document.querySelector("section");
    const arrSolutions = dataCondition.mainCondition[num_task].solution.split("_");
    const arrJF = dataCondition.mainCondition[num_task]?.justification;
    /*let condition = document.createElement("b");
    condition.innerHTML = dataCondition.mainCondition[num_task].condition;
    sectoinForms.append(condition);*/
    let arr_inputs = createForms([], arrSolutions, answ, sectoinForms);
    
    if (arrJF) {
        const line = document.createElement("div");
        line.classList.add("line");
        sectoinForms.appendChild(line);
        const answ_jf = dataCondition.mainCondition[num_task].answerForJustification.split(", ");
        arr_inputs = createForms(arr_inputs, arrJF.split("_"), answ_jf, sectoinForms);        
    }
    
    //set attributes for btnCheck
    btnCheck.innerHTML = "Проверить";
    sectionResult.append(btnCheck);
    
    return arr_inputs;
}

const checkStorage = () =>{
    if (localStorage.getItem("task-7")){
        if (localStorage.getItem("task-7")[0]) spanResult.textContent = "Количество баллов: " + localStorage.getItem("task-7")[0] + " из 10";
        if (localStorage.getItem("task-7")[0] === "0") spanResult.textContent = "Количество баллов: 0 из 10";  
    }else 
        spanResult.textContent = "Количество баллов: - из 10";
}

let checkHint = false;
checkStorage();
let arrDisplayInput = createDisplay(arrAnswForSolution, btnCheck);
if (arrAnswForJF) 
    arrAnswForSolution = [...arrAnswForSolution, ...arrAnswForJF.split(", ")];

btnCheck.addEventListener("click", () => {
    answer = [], count = 0;
    dataCondition.mainCondition[num_task].taskAnswers = arrAnswForSolution;
    for(let i=0; i<arrAnswForSolution.length; i++){
        answer[i] = arrDisplayInput[i].value;
        if (answer[i] == arrAnswForSolution[i]) {
		count++;
                document.querySelectorAll("input")[i].style.background = "white";
	}else {
		document.querySelectorAll("input")[i].style.background = "red";
	}
    }
    dataCondition.mainCondition[num_task].userAnswer = answer;
    mark = Math.round(count * dataCondition.max_score / arrAnswForSolution.length);
    spanResult.textContent = "Количество баллов: " + mark + " из " + dataCondition.max_score;
    console.log("cond", dataCondition.mainCondition[num_task], answer, count, mark);
    localStorage.setItem("task-3", [mark, checkHint]);
});

const returnTaskAnswers = ()=>{
    return [dataCondition.mainCondition[num_task].userAnswer, dataCondition.mainCondition[num_task].taskAnswers]
}