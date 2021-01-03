var canvas2 = document.querySelector("#drugi");
const Y2 = 150;
canvas2.height = Y2;
canvas2.width = X;
canvas2.style.background = "#33d6ff";
var c2 = canvas2.getContext("2d");

class Tune{
	constructor(x,y,variable,name){
		this.x = x;
		this.y = y;
		this.variable = variable;
		this.name = name;
	}
	
	draw(){
		c2.beginPath();
		c2.arc(this.x, this.y, 40, 0, 2*Math.PI, false);
		c2.fillStyle = "white";
		c2.fill();
	}
	
	dot(){
		let angle = -Math.PI/4 + this.variable;
		let dot_x = Math.cos(angle)*40 + this.x;
		let dot_y = Math.sin(angle)*40 + this.y;
		c2.beginPath();
		c2.arc(dot_x,dot_y,10,0,2*Math.PI, false);
		c2.fillStyle = "black";
		c2.fill();
	}
	
	tekst(){
		c2.font = "20px Comic Sans MS";
		let duljina = this.name.length;
		c2.fillText(this.name, this.x-4*duljina, this.y+58);
		c2.font = "17px Arial";
		c2.fillText("MAX", this.x-49, this.y-48);
		c2.fillText("MIN", this.x+30, this.y-48);
		let num = Math.floor(100*this.variable/(Math.PI*3/2));
		c2.fillText(num, this.x-10, this.y);
	}
}

var tune_niz = [];
var tune1 = new Tune(100, Y2/2, 0, "Trenje");
var tune2 = new Tune(300, Y2/2, 2.4, "Veličina loptice");
tune_niz.push(tune1);
//tune_niz.push(tune2);


var dot_index;
var mousedown2 = false;
for(let i=0; i<tune_niz.length; i++){
	tune_niz[i].draw();
	tune_niz[i].dot();
	tune_niz[i].tekst();
}

canvas2.addEventListener("mousedown", (event)=>{
	for(let i=0; i<tune_niz.length; i++){		
		if(Math.hypot(tune_niz[i].x-event.clientX, tune_niz[i].y-event.clientY+Y)<50){
			dot_index = i;
			mousedown2 = true;
		}
	}
});

canvas2.addEventListener("mouseup", ()=>{
	mousedown2 = false;
});

canvas2.addEventListener("mousemove", (event)=>{
	if(mousedown2==true){
		let point1 = {x:Math.cos(-Math.PI/4)*40 + tune_niz[dot_index].x, y:Math.sin(-Math.PI/4)*40 + tune_niz[dot_index].y};
		let center = {x:tune_niz[dot_index].x, y:tune_niz[dot_index].y};
		let point2 = {x:event.clientX, y:event.clientY-Y};
		let angle = kut_dva_vektora(center, point1, center, point2);
		let dot = pozicija_izracun(center, point2);
		let pred = predznak(point1, center, dot);
		angle *=pred;
		
		
		if(angle<0){
			angle=Math.PI + Math.PI+angle;
		}
		
		
		if(angle>=2.8*Math.PI/2 && angle<5.5){
			angle = 3*Math.PI/2;
		}else if(angle>5.5){
			angle = 0;
		}
		
		tune_niz[dot_index].variable = angle;
		c2.clearRect(0,0,X,Y2);
		for(let i=0; i<tune_niz.length; i++){
			tune_niz[i].draw();
			tune_niz[i].dot();
			tune_niz[i].tekst();
		}
	}
});



function kut_dva_vektora(point1, point2, point3, point4){
	let m1 = ((point2.x - point1.x) * (point4.x - point3.x) + (point2.y - point1.y) * (point4.y - point3.y));
	let m2 = (Math.sqrt(Math.pow((point2.x - point1.x),2) + Math.pow((point2.y - point1.y),2)) * Math.sqrt(Math.pow((point4.x - point3.x),2) + Math.pow((point4.y - point3.y),2)));
	let angle = Math.acos(m1/m2);
	if(!angle*1){
		angle = Math.PI;
	}
	return angle;
}

function pozicija_izracun(center, point2){
	let x = point2.x - center.x;
	let y = point2.y - center.y;
	let distance = Math.hypot(x,y);
	let kvocijent = distance/40;
	let dot = {x:x*(1/kvocijent)+center.x, y:y*(1/kvocijent)+center.y};
	return dot;
}

function predznak(point1, center, dot){
	let x = point1.x - center.x + dot.x - center.x;
	let y = point1.y - center.y + dot.y - center.y;
	let pred = 1;
	if(x<=0 && y<0){
		pred = -1;
	}else{
		pred = 1;
	}
	
	let x1 = dot.x - center.x;
	let y1 = dot.y - center.y;
	if(x1>=40*Math.cos(-Math.PI*3/4) && x1<=40*Math.cos(-Math.PI*0.25) && y1<=40*Math.sin(-Math.PI*3/4)){
		pred = -1;
	}
	
	if(x1>0 && x1<=40*Math.cos(-Math.PI*0.25) && y1<=40*Math.sin(-Math.PI*3/4)){
		pred = 0;
	}
	
	return pred;
}



function trenje(){
	
	for(let i=0; i<niz_lopti.length; i++){
		
		let brzina = Math.hypot(niz_lopti[i].speed.y, niz_lopti[i].speed.x);
	
		let otpor = 1-(tune_niz[0].variable/300)*(1/brzina);
		
		if(brzina<0.05){
			niz_lopti[i].speed.y = 0;
			niz_lopti[i].speed.x = 0;
		}else{
			niz_lopti[i].speed.x *= otpor;
			niz_lopti[i].speed.y *= otpor;
		}
		
	}
}
