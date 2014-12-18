function Flow(type, x, y)
{
	var active = true;
	var typeFr = -1;
	var intervalId = -1;

	switch(type)
	{
	case Flow.prototype.UP_TYPE : typeFr = 0; break;
	case Flow.prototype.DOWN_TYPE : typeFr = 2; break;
	case Flow.prototype.LEFT_TYPE : typeFr = 4; break;
	case Flow.prototype.RIGHT_TYPE : typeFr = 6; break;
	}
	
	var ss = new createjs.SpriteSheet({
		"images": ["textures/envir/flow.png"],
		"animations": {"active": [typeFr], "deactive": [typeFr+1]},
		"frames": {"regX": 0, "regY": 0, "width": Flow.prototype.SIZE, "height": Flow.prototype.SIZE, "count": 8}
	});
	
	var sprite = new createjs.Sprite(ss, "active");
	sprite.x = x - Math.floor(sprite.getBounds().width/5);
	sprite.y = y - Math.floor(sprite.getBounds().height/5);
	
	this.getSprite = function(){ return sprite; };
	this.getType = function(){ return type; };
	
	this.getWidth = function(){ return Flow.prototype.SIZE; };
	this.getHeight = function(){ return Flow.prototype.SIZE; };
	
	var onSetActive = function(){
		active = true;
		sprite.gotoAndPlay("active");
		clearInterval(intervalId);
		intervalId = -1;
	};
	
	this.setActive = function(bool){
		active = bool;
		
		if(bool)
			sprite.gotoAndPlay("active");
		else
		{
			sprite.gotoAndPlay("deactive");
			intervalId = setInterval(onSetActive, 2000);
		}
	};
	
	this.getActive = function(){
		return active;
	};
}

Flow.prototype.UP_TYPE = "uptype";
Flow.prototype.DOWN_TYPE = "downtype";
Flow.prototype.LEFT_TYPE = "lefttype";
Flow.prototype.RIGHT_TYPE = "righttype";
Flow.prototype.SIZE = 35;

function onFlowActive(item)
{
	//deactivating the flow
	item.setActive(false);
	player.onFlow();
	var flowSpeed = 30;
	
	switch(item.getType())
	{
	case Flow.prototype.UP_TYPE : 
		player.ySpeed = flowSpeed*-1; 
		player.xSpeed = 0; 
		player.setFlow(player.UP);
		break;
	case Flow.prototype.DOWN_TYPE : 
		player.ySpeed = flowSpeed; 
		player.xSpeed = 0; 
		player.setFlow(player.DOWN);
		break;
	case Flow.prototype.LEFT_TYPE : 
		player.xSpeed = flowSpeed*-1; 
		player.ySpeed = 0; 
		player.setFlow(player.LEFT);
		break;
	case Flow.prototype.RIGHT_TYPE : 
		player.xSpeed = flowSpeed; 
		player.ySpeed = 0; 
		player.setFlow(player.RIGHT);
		break;
	}
	
	focusCameraTo(item);
}