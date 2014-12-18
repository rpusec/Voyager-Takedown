function EndLevel(x, y)
{
	var ss = new createjs.SpriteSheet({
		"images": ["textures/envir/endLevel.png"],
		"animations":{
			"normal" : [0,3]
		},
		"frames" : {
			"regX": 0,
			"regY": 0,
			"height": 50,
			"width": 50,
			"count": 4
		}
	});
	
	var sprite = new createjs.Sprite(ss, "normal");
	sprite.x = x;
	sprite.y = y;
	sprite.x -= Math.floor(sprite.getBounds().width/4);
	sprite.y -= Math.floor(sprite.getBounds().height/4);
	
	this.getSprite = function(){return sprite;};
	
	var onParticles = new OnParticles(["#cda0ff", "#bc81ff", "#a758ff", "#902dff", "#7800ff"], 1, 100, 0.01, 2, 3, sprite, sprite.getBounds().width, sprite.getBounds().height, 0);
	onParticles.addParticlesEvent();
	
	this.removeParticlesEvent = function(){onParticles.removeParticlesEvent();};
}

function endLevelProcess()
{
	moveUp = false;
	moveDown = false;
	moveLeft = false;
	moveRight = false;
	player.xSpeed = 0;
	player.ySpeed = 0;
	player.hideFire(); 
	stageCompleted = true;
	addEndLevelAnnouncement(currentLevel);
	player.startShrinking();
	if(endLevelContainer.length != 0)
		focusCameraTo(endLevelContainer[0], true);
	addGroupParticles(player.getSprite().x+(player.getSprite().getBounds().width/2), player.getSprite().y+(player.getSprite().getBounds().height/2), 1, "#a748ff", 3, 0.1, 3, 3);
}