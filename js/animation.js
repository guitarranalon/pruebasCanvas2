var animationModule = (function(){
	var width = 600,
		height = 500,
		x = 0,
		dx = newSpeed(),
		redrawInterval = 45,
		intervalo,
		ctx,
		carImg,
		tunnelImg;
		
	var $spanTotal,
		$botonDetener,
		$botonEmpezar,
		$listaResultados,
		$botonesJuego,
		$parrafoTotal,
		$resultadoJuego;

	function inicializarVariablesDOM(){
		$parrafoTotal = $('#total');	
		$spanTotal = $parrafoTotal.find('span');
		$botonDetener = $('#botonDetener');
		$botonEmpezar = $('#botonEmpezar');
		$listaResultados = $('#resultados').find('ol');
		$botonesJuego = $('#juego').find('input');
		$resultadoJuego = $('#gameResult');
	}
	
	function ocultarMostrarBotonesSiPartidaCompleta(){
		if (resultsModule.completed())
		{
			$botonesJuego.hide();
			mostrarResultado();
		}
		else
		{
			$botonDetener.fadeOut(200);
			$botonEmpezar.fadeIn(200);
		}	
	}
	
	function newSpeed(){
		return Math.floor(Math.random()*10)+5;
	}
	
	function clear() {
		ctx.clearRect(0, 0, width, height);
	}
	
	function evaluar(){
		/* 30 is half the width the car */
		var diferencia = Math.round((x+30-width)/dx*redrawInterval);
		alert("Te has equivocado por: " + diferencia + " ms");
		resultsModule.escribirResultado(diferencia);
		resultsModule.nuevoResult(diferencia);
		$spanTotal.html(resultsModule.globalResult() + " ms");
	}
	
	function reset(){
		x=0;
		dx = newSpeed();
		animationModule.draw();
	}

	function start(){
		intervalo = setInterval(animationModule.draw,redrawInterval);			
	}
	
	function parar(){
		window.clearInterval(intervalo);
		evaluar();
		reset();
	}
	
	function mostrarResultado(){
		if (resultsModule.globalResult()<=1000)
			$resultadoJuego.html('¡Enhorabuena! Lo has logrado');
		else
			$resultadoJuego.html('Game Over! ¡Has tardado m&aacute;s de 1 segundo entre los cuatro intentos!');
			
		$resultadoJuego.fadeIn(1000);
	}
	
	return{

		init: function(context){
			ctx = context;
			inicializarVariablesDOM();
			
			resultsModule.init();
			resultsModule.retomarPartida();
			
			ocultarMostrarBotonesSiPartidaCompleta()			
			
			$spanTotal.html(resultsModule.globalResult() + " ms");
			
			/* Image Initializations */
			carImg =  new Image();
			carImg.src = "img/car.png";
			carImg.onload = function(){
				ctx.drawImage(carImg, 0, 213);
			}			
			
			tunnelImg = new Image();
			tunnelImg.src = "img/tunnel.png";			
			tunnelImg.onload = function(){
				ctx.drawImage(tunnelImg, 410, 190);
			}
			
		},	
	
		draw: function(){
			clear();

			ctx.drawImage(carImg, x, 213);
			ctx.drawImage(tunnelImg,410, 190);
			
			/* move */
			x += dx;
					
			/* if it goes so far away then stop */
			if (x>(3*width))
			{
				parar();
			}
		},

		empezarClickHandler: function(){
			start();
	
			$(this).fadeOut(200);
			$botonDetener.fadeIn(200);
		},

		detenerClickHandler: function(){
			parar();
	
			ocultarMostrarBotonesSiPartidaCompleta();
		},
		
		nuevaPartidaClickHandler: function(){
			$listaResultados.html('');
			$resultadoJuego.html('').hide();
			$botonEmpezar.show();
			resultsModule.clear();
			$spanTotal.html('0 ms');
		}
	};
}());