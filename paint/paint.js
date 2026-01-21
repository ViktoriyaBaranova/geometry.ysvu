"use strict";
//canvas
let prevMouseX, prevMouseY, snapshot, isDrawing = false, selectedTool, brushWidth;
const btnPaint = document.querySelector('.btn-paint');
const btnPensil = document.querySelector('.btn-pensil');
const btnEraser = document.querySelector('.btn-eraser');
const btnText = document.querySelector('.btn-text');
const btnClean = document.querySelector('.btn-clean');
const sectionTask = document.querySelector('.section-task');

/*window.addEventListener("load", () =>{
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    });*/
const startDraw = (e) =>{
    isDrawing = true;
    prevMouseX = e.offsetX; //passing current mouseX position
    prevMouseY = e.offsetY;
    ctx.beginPath(); //create new path to draw
    ctx.lineWidth = brushWidth;
    //copying canvas and passing as snapshot value, this avoids dragging the image
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    console.log("draw")
}

const drawing = (e) =>{
    if (!isDrawing) return;
    ctx.putImageData(snapshot, 0, 0); //adding copied canvas data on this canvas
    if(selectedTool === "brush"|| selectedTool === "eraser"){
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : "#224bcf";
        ctx.lineTo(e.offsetX, e.offsetY); 
        ctx.stroke(); 
    }
}

const showBtnPaints = (k)=>{
    btnEraser.style.opacity = k;
    btnPensil.style.opacity = k;
    btnText.style.opacity = k;
    btnClean.style.opacity = k;
    //btnPaint.src = `./../../paint/canvas-${k}.png`;
    btnPaint.style.transform = "scale(0.70)";
}
let ctx, canvas, i=0;
canvas = document.createElement('canvas');
sectionTask.appendChild(canvas);
ctx= canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const toolText = (e) =>{
  let text = prompt("Введите текст:", "");
  if (text) {
    ctx.font = "25px sans-serif";
    ctx.fillStyle = "#224bcf";
    ctx.strokeStyle = "#224bcf";
    
    ctx.fillText(text, e.offsetX, e.offsetY);
    
  }
}

const drawPansil=()=>{
    brushWidth = 3;
    selectedTool="brush";
    switchBtns(1, 0, 0, 0);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mouseup", () => isDrawing = false); 
    canvas.removeEventListener("click", toolText);
}

const switchBtns = (i, j, k, q) =>{
    btnPensil.src = `./../../paint/pensil-${i}.png`;
    btnEraser.src = `./../../paint/eraser-${j}.png`;
    btnText.src = `./../../paint/text-${k}.png`;
    btnClean.src = `./../../paint/clean-${q}.png`;
}

btnPaint.addEventListener("click", (e) =>{
    switchBtns(1, 0, 0, 0);
    if (i%2===0){
        drawPansil();
        showBtnPaints(1);
        btnPaint.style.transform = "scale(0.70)";
        canvas.style.zIndex = "9";
        canvas.style.opacity = "0.5";
        i++;
}
    else {
        showBtnPaints(0);
        btnPaint.style.transform = "scale(1.0)";
        canvas.style.zIndex = "-9";
        canvas.style.opacity = "0.4";
        i--;
        
    }
})

btnEraser.addEventListener("click", () =>{
    brushWidth = 12;
    selectedTool="eraser";
    switchBtns(0, 1, 0, 0);
    canvas.addEventListener("mousemove", drawing);
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mouseup", () => isDrawing = false); 
    canvas.removeEventListener("click", toolText);
})

btnPensil.addEventListener("click", ()=>{
    drawPansil()
})

btnText.addEventListener("click", ()=>{
    switchBtns(0, 0, 1, 0);
    canvas.removeEventListener("mousemove", drawing);
    canvas.removeEventListener("mousedown", startDraw);
    canvas.removeEventListener("mouseup", () => isDrawing = false);
    canvas.addEventListener("click", toolText);    
})

btnClean.addEventListener("click", ()=>{
    switchBtns(0, 0, 0, 1);
    canvas.removeEventListener("mousemove", drawing);
    canvas.removeEventListener("mousedown", startDraw);
    canvas.removeEventListener("mouseup", () => isDrawing = false);
    canvas.removeEventListener("click", toolText);    
    ctx.clearRect(0,0, canvas.width, canvas.height);
})