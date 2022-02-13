function encenderFoco(){
	var imag=document.getElementById("myImage");
	imag.src="FocoON.png";
} 
function apagarFoco(){
	var imag=document.getElementById("myImage");
	imag.src="FocoOFF.png";
} 

function calcularFactorial(){

	var fact=document.getElementById("valor").value;
	document.getElementById("factorial").innerHTML=recursiva(fact,fact-1);
}
function recursiva(valor,cont){
	valor=valor*cont;
	cont--;
	if(cont==1){
		return valor;
	}else return recursiva(valor,cont);
}

(function(){ //Panel o cancha en donde se moveran los objetos bola y barra.
   self.Board = function(width,height){
	this.width = width; //le doamos ancho
	this.height = height; // le damos alto
	this.playing = false; //si juego esta en uso
	this.game_over = false;// si juego terminó
	this.bars = [];
	this.ball = null;
	this.playing = false;

}

self.Board.prototype = { //se declaran elementos del prototype
	get elements(){
		var elements = this.bars.map(function(bar){ return bar;});//retorna las barras
		elements.push(this.ball); //esta es la bola
		return elements;
	}

};

})();

(function(){
// Objeto barra que se van a encargar de cambiar direccion de la bola
	self.Bar = function(x,y,width,height,board){
		this.x = x; //Donde va a estar x
		this.y = y;  //Donde va a estar y
		this.width = width;  //Ancho
		this.height = height; //Alto
		this.board = board; //como se comenta anteriormente, el objeto que dibuja la pizarra

		this.board.bars.push(this);//le setea el objeto barra al pizarron
		this.kind = "rectangle";//lo dibuja como rectangulo
		this.speed = 10;
	}
	self.Bar.prototype={ //funciones que se encargan del movimiento de las barras
		down:function(){
			this.y += this.speed;
		},
		up: function(){
			this.y -= this.speed;
		},
		toString:function(){
			return "x: "+this.x +" y: "+this.y;
		}
	};


})();

(function(){
	//Objeto bola que va a chocar contra las barras
  self.Ball = function(x,y,radius,board){
  	this.x = x;
  	this.y = y;
  	this.radius = radius;
  	this.speed_y = 0;
  	this.speed_x = 3;
	this.board = board;
	this.direction = 1;
	this.bounce_angle = 0;
	this.max_bounce_angle = Math.PI / 12;
	this.speed = 3;
 
	board.ball = this;
	this.kind = "circle";

  }

	self.Ball.prototype={
		move: function(){
			this.x += (this.speed_x * this.direction);
			this.y += (this.speed_y);
		},
		get width(){
			return this.radius * 2;
		},
		get height(){
			return this.radius * 2;
		},
		
		collision: function(bar){//funcion que controla laas colisiones entre las barras y la bola
			var relative_intersect_y = (bar.y + (bar.height/2)) - this.y;
			var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

			this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

			this.speed_y = this.speed * -Math.sin(this.bounce_angle);
			this.speed_x = this.speed * Math.cos(this.bounce_angle);

			if(this.x > (this.board.width / 2)){this.direction = -1;}
			else this.direction = 1;
		}
	}
})();

(function(){
	//Vista que llama a la clase que dibuja el cuadrado
	self.BoardView = function(canvas,board){
		this.canvas = canvas;
		this.canvas.width = board.width;
		this.canvas.height = board.height;
		this.board = board;
		this.ctx = canvas.getContext("2d");//contexto con el cual se dibuja en javascript
	} 
	self.BoardView.prototype ={
		clean:function(){
			this.ctx.clearRect(0,0,this.board.width,this.board.height)
		},
		draw:function(){//le dice que elemento debe dibujar
			for(var i= this.board.elements.length-1;i>=0;i--){
			var el = this.board.elements[i];
			draw(this.ctx,el);
			};
		},
		check_collisions: function(){
			//verifica las coliciones 
			for(var i= this.board.bars.length -1; i>=0; i--){
				var bar = this.board.bars[i];
				if(hit(bar,this.board.ball)){
				this.board.ball.collision(bar);
				}
			}
		},
		play:function(){//Metodo que comienza el juego
			if(this.board.playing){//si esta jugando, va borrando para que no quede la barra estirada
			 this.clean();
   			 this.draw();
   			 this.check_collisions();
   			 this.board.ball.move();
			}	 
		}

	}
	function hit(a,b){
		//revisa si a colisiona con b
		var hit = false;
		//coliciones horizontales
		if(b.x + b.width >= a.x && b.x < a.x + a.width){
			//coliciones verticales
			if(b.y + b.height >= a.y && b.y < a.y + a.height)
				hit = true;
		}
		//colicion de a con b

		if(b.x <= a.x && b.x + b.width >= a.x + a.width){
			if(b.y <= a.y && b.y + b.height >= a.y + a.height)
				hit = true;
		}
		//colicion de b con a
		if(a.x <= b.x && a.x + a.width >= b.x + b.width){
			if(a.y <= b.y && a.y + a.height >= b.y + b.height)
				hit = true;
		}
		return hit;

	}
	function draw(ctx,element){
        //Se encarga de dibura los elementos barras y circulo
		switch (element.kind){
		case "rectangle":
			ctx.fillRect(element.x,element.y,element.width, element.height);
	      break;
	    case "circle":
	    	ctx.beginPath();
			ctx.arc(element.x,element.y,element.radius,0,7);
			ctx.fill();
			ctx.closePath();
	      break;  
		}

		
	}
})();
var board = new Board(800,400);
var bar_2 = new Bar(20,100,40,100,board);
var bar = new Bar(730,100,40,100,board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas,board);
var ball = new Ball(350,100,10,board);

document.addEventListener("keydown", function(ev){
	//funcion que lee las teclas que son presionadas
	if(ev.keyCode == 38){//si w
		bar.up();
	}
	else if(ev.keyCode == 40){//si s
		bar.down();
	}else if(ev.keyCode === 87){//tecla arriba
		bar_2.up();
	}
	else if(ev.keyCode === 83){//tecla abajo
		bar_2.down();
	}else if(ev.keyCode==32){//barra espaciadora, pausa el juego
		ev.preventDefault();
		board.playing = !board.playing;//si esta en movimiento, lo pausa sino lo mueve
	}
});

board_view.draw();
window.requestAnimationFrame(controller);

function controller(){
    board_view.play();
    window.requestAnimationFrame(controller);
}