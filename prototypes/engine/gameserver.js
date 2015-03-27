var TACT = 100;

var battlefield = {
	"field" : {
		"width": 650,
		"height": 450,
	},
	"players" : []
};



var Robot = function() {
	var actions = {
		"step" : function(x, y){
			this.duration = 50;
			this.x = x;
			this.y = y;
			this.perform = function(robot){
				robot.x = x;
				robot.y = y;
			}
		}
	};

	this.x = 0;
	this.y = 0;

	this.actionStacks = {
		"move" : [],
		"fight" : [],
		"block" : [],
	};

	this.move = function(x, y){
		var maxDestination = battlefield.field.width / (3000 / TACT);
		var newX = this.x, newY = this.y;
		var dX = this.x > x ? -1 : 1;
		var dY = this.y > y ? -1 : 1;

		this.actionStacks.move.length = 0;
		while(newX != x || newY != y){
			if(Math.abs(newX - x) > maxDestination){
				newX += dX * maxDestination;
			}else{
				newX = x;
			}
			if(Math.abs(newY - y) > maxDestination){
				newY += dY * maxDestination;
			}else{
				newY = y;
			}

			this.actionStacks.move.push(new actions.step(newX, newY));
		}
	};
};



var Gameplay = (function(){

	var timer;

	var playTact = function(){
		battlefield.players.forEach(function(player){
			player.actionStacks.move.length &&
			player.actionStacks.move.shift().perform(player);
		});
	};

	return {
		"start" : function(){
			timer = setInterval(function(){
				playTact();
				console.dir(battlefield.players[0].x);
				$(document).triggerHandler('GameState', battlefield);
			}, TACT);
		},
		"stop" : function(){
			clearInterval(timer);
		} 
	}
})();




var ViewPort = (function(){

	var playerDom = $("#pl1");

	return {
		"start" : function(){
			$(document).on('GameState', function(e, battlefield){
				playerDom.css({
					"visibility":"visible",
					"left" : battlefield.players[0].x, 
					"top" : battlefield.players[0].y
				});
			});
		}
	}

})();





var r2d2 = new Robot();

battlefield.players.push(r2d2);

var AI = setInterval(function(){
	var x = Math.random() * battlefield.field.width,
	y = Math.random() * battlefield.field.height;

	console.log("GoTo: ",x,", ", y);
	$("#target").css({
		"left" : x, 
		"top" : y
	})

	r2d2.move(x,y);
}, 800);

ViewPort.start();
Gameplay.start();

setTimeout(function(){
	Gameplay.stop();
	clearInterval(AI);
},8e4);
