//https://learn.javascript.ru/variables
//https://developer.mozilla.org/ru/docs/Web/API/Canvas_API/Tutorial/Basic_usage
//https://dev.to/tqbit/how-to-create-svg-elements-with-javascript-4mmp
//https://www.motiontricks.com/creating-dynamic-svg-elements-with-javascript/

"use strict";
var num_task = 0;
var div_tasks = superMassive.massiv_color[num_task];
var coords = superMassive.massiv_coord[num_task];
console.log(coords);

//paint html-page
var div_main = document.getElementById("main_div");
div_main.innerHTML = "<div><b>Закрасьте на рисунке векторы, удовлетворяющие следующим условиям:</b></div><div class='controls_colors' id='jsColors'>";
var div_controls = document.getElementById("jsColors");
var massive_of_divs = [];
for (var i = 0; i < 8; ++i) {
        var div_containerTasks = document.createElement('div');
        div_containerTasks.className = "task";
        div_controls.append(div_containerTasks);
        var div = document.createElement('div');
        div.className = "control_color jsColor";
        div.style.backgroundColor = div_tasks[i][1];
        massive_of_divs[i] = div;
        div_containerTasks.append(div);
        var pTask = document.createElement('p');
        pTask.className = "statement";
        div_containerTasks.append(pTask);
}
var statements = document.getElementsByClassName("statement");
for (var i = 0; i < 8; ++i) {
    statements[i].innerHTML =div_tasks[i][0];
}
var div_second = document.createElement('div');
div_main.append(div_second);
div_second.innerHTML = "<div class='controls_btns'><button id='jsCheck'>ПРОВЕРИТЬ</button></div><div><p id='result'></p></div>";

//paint svg
var svg = document.getElementById('pic');
const colors = document.getElementsByClassName('jsColor');
var cursor = document.getElementById('cursor');
//for cursor
document.addEventListener('mousemove', function(e){
    var x = e.pageX;
    var y = e.pageY;
    cursor.style.left = x + "px";
    cursor.style.top = y + "px";
});

Array.from(colors).forEach(color => color.addEventListener('click', (event) => {
        const color = event.target.style.backgroundColor;
        cursor.style.backgroundColor = color;
    }));

//add a length to massive
var random_unit_vectors = [], random_sqrt_2 = [], random_2=[], random_3=[], random_sqrt_5=[], random_4=[];
for (var i = 0; i < coords.l.length; ++i) {    
    coords.l[i].push(Math.sqrt((coords.l[i][0]-coords.l[i][2])**2+(coords.l[i][1]-coords.l[i][3])**2));
    if (coords.l[i][4]==1) random_unit_vectors.push(coords.l[i]);
    if (coords.l[i][4]==Math.sqrt(2)) random_sqrt_2.push(coords.l[i]);
    if (coords.l[i][4]==2) random_2.push(coords.l[i]);
    if (coords.l[i][4]==3) random_3.push(coords.l[i]);
    if (coords.l[i][4]==Math.sqrt(5)) random_sqrt_5.push(coords.l[i]);
    if (coords.l[i][4]>=4) random_4.push(coords.l[i]);
};
console.log(random_3);

function draw_svg_line(x1, y1, x2, y2, w, c) {
    x1 *= 10; y1 *= 10; x2 *= 10; y2 *= 10;
    const path_line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var s_line = `M ${x1} ${y1} L ${x2} ${y2} `;
    path_line.setAttribute('d', s_line);
    path_line.setAttribute('stroke-linecap', 'round');
    path_line.setAttribute('stroke-linejoin', 'round');
    path_line.setAttribute('stroke-width', w);
    path_line.setAttribute('stroke', c);
    
    svg.appendChild(path_line);
}



function draw_svg_vect(x1, y1, x2, y2) {
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
    path_vect.setAttribute('stroke-width', '2.2');
    path_vect.setAttribute('stroke', '#E0E0E0');
    path_vect.setAttribute('data-len', len / 10);  
    path_vect.addEventListener('click', function () {
        path_vect.setAttribute('stroke', cursor.style.backgroundColor);
    });
    svg.appendChild(path_vect);
    
}

//*****
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function randomInteger(min, max) {
  // случайное число от min до (max+1)
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

//collinear vectors
function collinear_vect(arr){
    shuffle(arr);
    var rand = randomInteger(2, arr.length);
    var a1 = arr[0][2]-arr[0][0], a2 = arr[0][3]-arr[0][1]; 
    draw_svg_vect(arr[0][0], arr[0][1], arr[0][2], arr[0][3]);
    for (var i = 1; i < rand; ++i){
        if (a1 * (arr[i][3]-arr[i][1]) - a2 * (arr[i][2]-arr[i][0]) == 0) draw_svg_vect(arr[i][0], arr[i][1], arr[i][2], arr[i][3]);
   };
}
//no collinear vectors
function no_collinear_vect(arr){
    shuffle(arr);
    var rand = randomInteger(2, arr.length);
    var a1 = arr[0][2]-arr[0][0], a2 = arr[0][3]-arr[0][1]; 
    draw_svg_vect(arr[0][0], arr[0][1], arr[0][2], arr[0][3]);
    for (var i = 1; i < rand; ++i){
        if (a1 * (arr[i][3]-arr[i][1]) - a2 * (arr[i][2]-arr[i][0]) != 0) draw_svg_vect(arr[i][0], arr[i][1], arr[i][2], arr[i][3]);
   };
}
//oppositely directed vectors
function oppositely_directed_vect(arr){
    shuffle(arr);
    var a1 = arr[0][2]-arr[0][0], a2 = arr[0][3]-arr[0][1], alph; 
    draw_svg_vect(arr[0][0], arr[0][1], arr[0][2], arr[0][3]);
    for (var i = 1; i < arr.length; ++i){
        if (arr[i][2]-arr[i][0]!=0) alph = a1 / (arr[i][2]-arr[i][0]); 
        else alph = a2 / (arr[i][3]-arr[i][1]);
        if (a1 * (arr[i][3]-arr[i][1]) - a2 * (arr[i][2]-arr[i][0]) == 0 && alph < 0) {
            draw_svg_vect(arr[i][0], arr[i][1], arr[i][2], arr[i][3]);
            draw_svg_vect(arr[i-1][0], arr[i-1][1], arr[i-1][2], arr[i-1][3]);
            break;
        }
       
   };
}
//codirectional vectors
function codirectional_vect(arr){
    shuffle(arr);
    var a1 = arr[0][2]-arr[0][0], a2 = arr[0][3]-arr[0][1], alph; 
    draw_svg_vect(arr[0][0], arr[0][1], arr[0][2], arr[0][3]);
    for (var i = 1; i < arr.length; ++i){
        if (arr[i][2]-arr[i][0]!=0) alph = a1 / (arr[i][2]-arr[i][0]); 
        else alph = a2 / (arr[i][3]-arr[i][1]);
        if (a1 * (arr[i][3]-arr[i][1]) - a2 * (arr[i][2]-arr[i][0]) == 0 && alph > 0) {
            draw_svg_vect(arr[i][0], arr[i][1], arr[i][2], arr[i][3]);
        }
       
   };
}

function draw_svg_picture(){
    var maxCoords = 0, mCoords = 0;
    for (var i = 0; i < coords.l.length; ++i){
        mCoords = Math.max(...coords.l[i]);
        if (mCoords > maxCoords) maxCoords = mCoords;
    }
    /*for (var i = 0; i < coords.v.length; ++i){
        mCoords = Math.max(...coords.v[i][0]);
        if (mCoords > maxCoords) maxCoords = mCoords;
    }*/
    for (var i = 0; i < maxCoords+2; ++i){
        draw_svg_line(i, 0, i, maxCoords+1, '0.5', '#dcdcdc');
        draw_svg_line(0, i, maxCoords+1, i, '0.5', '#dcdcdc');
    }
    for (var i = 0; i < coords.l.length; ++i) {
        draw_svg_line(coords.l[i][0], coords.l[i][1], coords.l[i][2], coords.l[i][3], '2', "#414141"); 
    }
    for (var i = 0; i < coords.none.length; ++i) {
        draw_svg_line(coords.none[i][0], coords.none[i][1], coords.none[i][2], coords.none[i][3], '2', "#414141"); 
    }
   /* for (var i = 0; i < coords.v.length; ++i) {
        draw_svg_vect(coords.v[i][0][0], coords.v[i][0][1], coords.v[i][0][2], coords.v[i][0][3]); 
    }*/
    collinear_vect(random_unit_vectors);
    collinear_vect(random_2);
    oppositely_directed_vect(random_sqrt_2);
    oppositely_directed_vect(random_3);
    no_collinear_vect(random_sqrt_5);
    codirectional_vect(random_4);
}

draw_svg_picture();
//btn check
const btnCheck = document.getElementById('jsCheck');
var result = document.getElementById("result");


//Check
/*
btnCheck.addEventListener("click", () => {
    cursor.style.backgroundColor = null;
    var count_true = 0, count_false = 0, k = svg.children.length - 1; 
    var coef = 10 / coords.v.length, count = 0;
    console.log(coef);
    console.log(coords.v.length);
    for (var i = coords.v.length-1; i >=0; --i){
        if (svg.children[k].getAttribute('stroke') === massive_of_divs[coords.v[i][1]].style.backgroundColor) {
            count_true++;
            console.log(count_true);
        }
        else count_false++;
        k--;
    };
    console.log(count_true - count_false);
    if ((count_true - count_false) < 0) count = 0;
    else count = Math.floor((count_true - count_false) * coef);
    result.innerHTML = `Количество баллов: ${count} из 10`;

});

//next
const btnNext = document.getElementById('btnNext');
btnNext.addEventListener("click", () => {
    num_task +=1;
    if (num_task < superMassive.massiv_color.length){
         //remove all
        svg.replaceChildren();
        div_tasks = superMassive.massiv_color[num_task];
        coords = superMassive.massiv_coord[num_task];
    
        //create page again
        for (var i = 0; i < 8; ++i) {
            massive_of_divs[i].style.backgroundColor = div_tasks[i][1];
            statements[i].innerHTML = div_tasks[i][0];
        }
        Array.from(colors).forEach(color => color.addEventListener('click', (event) => {
        const color = event.target.style.backgroundColor;
        cursor.style.backgroundColor = color;
    }));
        draw_svg_picture();
        if (num_task === superMassive.massiv_color.length-1) num_task=-1;
    }
});
*/