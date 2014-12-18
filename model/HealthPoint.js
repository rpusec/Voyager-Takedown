function HealthPoint(x, y)
{
	var ss = new createjs.SpriteSheet({
		"animations":{
			"loading": [0,3,"loaded"],
			"loaded": [3]
		},
		"images": ["textures/envir/healthpoint.png"],
		"frames": {
			"regX": 0,
			"regY": 0,
			"width": 13,
			"height": 20,
			"count": 4
		}
	});
	
	ss.getAnimation("loading").speed = 0.25;
	
	var sprite = new createjs.Sprite(ss, "loading");
	sprite.x = x;
	sprite.y = y;
	
	sprite.alpha = 0.8;
	
	this.getSprite = function(){return sprite; };
	
	this.removePoint = function(){
		sprite.alpha = 0.4;
		sprite.gotoAndPlay("loading");
	};
	
	this.addPoint = function(){
		sprite.alpha = 0.8;
		sprite.gotoAndPlay("loading");
	};
}