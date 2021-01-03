var canvas = document.querySelector("#prvi");
const X = window.innerWidth;
const Y = window.innerHeight - 180;
canvas.style.background = "rgba(0,0,0,0.9)";
canvas.height = Y;
canvas.width = X;


const c = canvas.getContext("2d");
c.fillStyle = "rgba(0,0,200,1)";


//---------------LOPTICA objekt------------------------
class Ball{
	constructor(x,y,radius,speed){
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.speed = speed;
	}
	
	draw(){
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		c.fill();
	}
	
	update(){
		this.draw();
		this.x += this.speed.x;
		this.y += this.speed.y;
	}
	
}



//------------------ linija objekt------------------------
class Line{
	constructor(x_start, y_start, x_end, y_end){
		this.x_start = x_start;
		this.y_start = y_start;
		this.x_end = x_end;
		this.y_end = y_end;
	}
	
	draw(){
		c.beginPath();
		c.moveTo(this.x_start,this.y_start);
		c.lineTo(this.x_end,this.y_end);
		c.strokeStyle = "red";
		c.stroke();
	}
}

//------------------------globalne varijable -----------------
var x_start;
var y_start;
var x_end;
var y_end;
var mousedown = false;
var line;
var pause = false;
var sudar = false;
var sudarene_lopte = [];


//------------------event listener -----------------------
canvas.addEventListener("mousedown", (event)=>{
	x_start = event.clientX;
	y_start = event.clientY;
	x_end = event.clientX;
	y_end = event.clientY;
	mousedown = true;
});


canvas.addEventListener("mousemove", (event)=>{
	if(mousedown==true){
		x_end = event.clientX;
		y_end = event.clientY;
		line = new Line(x_start, y_start, x_end, y_end);
	}
});

var niz_lopti = [];

canvas.addEventListener("mouseup", ()=>{
	mousedown = false;
	line = undefined;
	let speed = {x:(-x_end+x_start)/50, y:(-y_end+y_start)/50};
	let ball = new Ball(x_start, y_start, 40, speed);
	niz_lopti.push(ball);
});







//-----------FUNKCIJE ___---------------

function kolizija(ball){
	if(ball.x >= X-ball.radius || ball.x <= ball.radius){
		ball.speed.x *= -1;
	}
	
	if(ball.y >= Y-ball.radius || ball.y <= ball.radius){
		ball.speed.y *= -1;
	}
	
	for(let i=0; i<niz_lopti.length; i++){
		if(niz_lopti[i]!=ball && Math.hypot(ball.x - niz_lopti[i].x, ball.y - niz_lopti[i].y)<=niz_lopti[i].radius + ball.radius){
			sudar = true;
			//pause = true;
			
			izracun_kuta(ball, niz_lopti[i]);
		}
	}
}

function izracun_kuta(ball_1, ball_2){
	let index = undefined;
	for(let j=0; j<niz_lopti.length; j++){
		if(ball_1 == niz_lopti[j]){index=j;}
	}
	let m1 = (ball_1.speed.y - ball_2.speed.y)/(ball_1.speed.x - ball_2.speed.x);
	let m2 = (ball_1.y - ball_2.y)/(ball_1.x - ball_2.x);
	let kut = (m1 - m2)/(1 + m1*m2);
	let brzina = {x:ball_1.speed.x - ball_2.speed.x, y:ball_1.speed.y - ball_2.speed.y,};
	let speed = Math.hypot(ball_1.speed.y - ball_2.speed.y, ball_1.speed.x - ball_2.speed.x);
	kut = Math.atan(kut);
	let vektor_size = 1-Math.abs(2*kut/Math.PI);
	let dodirna_tocka = tocka_sudara(ball_1, ball_2);
	let promjena_smjera = vektor(ball_2, dodirna_tocka, vektor_size, speed);
	let nova_brzina = {x:niz_lopti[index].speed.x+promjena_smjera.x, y:niz_lopti[index].speed.y + promjena_smjera.y}
	sudarene_lopte.push({index:index, vektor:promjena_smjera, brzina:brzina, nova_brzina:nova_brzina});
}

function tocka_sudara(ball_1, ball_2){
	let x = (ball_1.x + ball_2.x)/2;
	let y = (ball_1.y + ball_2.y)/2;
	return {x:x, y:y};
}

function vektor(ball_2, dodirna_tocka, vektor_size, speed){
	let x = dodirna_tocka.x - ball_2.x;
	let y = dodirna_tocka.y - ball_2.y;
	let konstanta = vektor_size*speed;
	let hypot = Math.hypot(x,y);
	x/=hypot;
	y/=hypot;
	x*=konstanta;
	y*=konstanta;
	let vektor = {x:x, y:y};
	return vektor;
}

function pomicanje(){
	for(let i=0; i<niz_lopti.length; i++){
		for(let j=0; j<niz_lopti.length; j++){
			if(j!=i){
				let udaljenost = Math.hypot(niz_lopti[i].x-niz_lopti[j].x, niz_lopti[i].y - niz_lopti[j].y);
				if(udaljenost<niz_lopti[i].radius+niz_lopti[j].radius){
					
					if(niz_lopti[i].x<niz_lopti[j].x){
						niz_lopti[i].x-=1;
					}else{
						niz_lopti[i].x+=1;
					}
					
					if(niz_lopti[i].y<niz_lopti[j].y){
						niz_lopti[i].y-=1;
					}else{
						niz_lopti[i].y+=1;
					}
				}
			}
		}
	}
}

function bug_fix(){
	for(let i=0; i<niz_lopti.length; i++){
		let too_close = false;
		for(let j=0; j<niz_lopti.length; j++){
			if(j!=i && Math.hypot(niz_lopti[i].x-niz_lopti[j].x, niz_lopti[i].y-niz_lopti[j].y)<=niz_lopti[i].radius+niz_lopti[j].radius+5){
				too_close = true;
			}	
		}
		
		if(too_close==false){
			if(niz_lopti[i].x > X-niz_lopti[i].radius){
				niz_lopti[i].x-=0.5;
			}
			
			if(niz_lopti[i].x < niz_lopti[i].radius){
				niz_lopti[i].x +=0.5;
			}
			
			if(niz_lopti[i].y > Y-niz_lopti[i].radius){
				niz_lopti[i].y-=0.5;
			}
			
			if(niz_lopti[i].y < niz_lopti[i].radius){
				niz_lopti[i].y +=0.5;
			}
		}
		
		
	}
}





function animate(){
	sudarene_lopte = [];
	c.clearRect(0,0,X,Y);
	if(pause == false){
		requestAnimationFrame(animate);
	}
	
	
	
	for(let i = 0; i < niz_lopti.length; i++){
		niz_lopti[i].update();
	}
	
	for(let i=0; i<niz_lopti.length;  i++){
		kolizija(niz_lopti[i]);
	}
	
	
	for(let i=0; i<sudarene_lopte.length; i++){
		niz_lopti[sudarene_lopte[i].index].speed.x = sudarene_lopte[i].nova_brzina.x;
		niz_lopti[sudarene_lopte[i].index].speed.y = sudarene_lopte[i].nova_brzina.y;
		
	}
	
	pomicanje();
	trenje();
	bug_fix();
	
	
	if(typeof line != "undefined"){
		line.draw();
	}
	
}



animate();







