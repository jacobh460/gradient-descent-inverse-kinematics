const canvas = document.getElementById("drawCanvas");
const ctx = canvas.getContext("2d");

const middleX = canvas.width/2;
const middleY = canvas.height/2;

let x1 = -5;
let x2 = 0;

let L = [6, 5, 4, 3, 2];

const k = L.length;
//for (let i = 0; i < k; ++i) L.push(i/2);
const learn_rate = 0.001;

const scale = 30;


let mouseDown = false;
canvas.addEventListener("mousedown", function(event){
    mouseDown = true;
});

canvas.addEventListener("mouseup", function(event)
{
    mouseDown = false;
});

let mouseX = 0;
let mouseY = 0;
canvas.addEventListener("mousemove", function(event)
{
    mouseX = event.offsetX;
    mouseY = event.offsetY;
});
//root mean square error
function RMSE(xhat1, xhat2){
    return Math.sqrt(((x1 - xhat1)**2+(x2-xhat2)**2)/2);
}

//calculate final x position "guess"
function XHAT1(th){
    let ret = 0;
    for (let i = 0; i < th.length; ++i){
        ret += L[i] * Math.cos(th[i]);
    }
    return ret;
}

//calculate final y position "guess"
function XHAT2(th){
    let ret = 0;
    for (let i = 0; i < th.length; ++i){
        ret += L[i] * Math.sin(th[i]);
    }
    return ret;
}

let theta = []; 
for (let i = 0; i < k; ++i) theta.push(Math.PI/2);



function drawLoop(){
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mouseDown){
        new_x1 = (mouseX-middleX)/scale;
        new_x2 = (mouseY-middleY)/scale;

        if (new_x1 != x1 || new_x2 != x2){
            theta = []; 
            for (let i = 0; i < k; ++i) theta.push(Math.PI/2);

            x1 = new_x1;
            x2 = new_x2;
        }
    }

    
    

    for (let i = 0; i < 10000; ++i){
        let xhat1 = XHAT1(theta);
        let xhat2 = XHAT2(theta);

        let E = RMSE(xhat1, xhat2);

        //avoid divide by 0 error
        if (E == 0) continue;

        for (let j = 0; j < theta.length; ++j){
            theta[j] -= (((x1 - xhat1) * (L[j] * Math.sin(theta[j])) + (x2 - xhat2) * (-L[j] * Math.cos(theta[j])))/(2 * E)) * learn_rate * E;
        }
    }

    //draw all vectors
    ctx.beginPath();
    ctx.moveTo(middleX, middleY);
    let lastX = middleX;
    let lastY = middleY;
    for (let i = 0; i < L.length; ++i){
        lastX += L[i] * Math.cos(theta[i]) * scale;
        lastY += L[i] * Math.sin(theta[i]) * scale;
        ctx.lineTo(lastX, lastY);
    }
    ctx.stroke();

    const E = RMSE(XHAT1(theta), XHAT2(theta));
    ctx.fillText(`RMSE: ${E}`, 10, 10);
    ctx.fillText(`X1: ${x1}`, 10, 20);
    ctx.fillText(`X2: ${x2}`, 10, 30);
    
    window.requestAnimationFrame(drawLoop);
}
drawLoop();