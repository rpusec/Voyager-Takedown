function Teleporter(x, y, ident)
{
	var id = ident;
	
	var ss = new createjs.SpriteSheet({
		"images":["textures/envir/teleporter.png"],
		"animations":{
			"telep":[0,3]
		},
		"frames":{
			"regX": 15,
			"regY": 15,
			"width": 59,
			"height": 59,
			"count": 4
		}
	});
	
	var sprite = new createjs.Sprite(ss, "telep");
	sprite.x = x;
	sprite.y = y;
	
	sprite.setBounds(0, 0, sprite.getBounds().width-30, sprite.getBounds().height-30);
	
	this.getSprite = function(){ return sprite; };
	this.getId = function(){ return id; };
}

function Destination(x, y, ident)
{
	var id = ident;
	
	var sprite = new createjs.Bitmap("textures/envir/destination.png");
	sprite.x = x - Math.floor(sprite.getBounds().width/6);
	sprite.y = y - Math.floor(sprite.getBounds().height/6);
	
	this.getSprite = function(){ return sprite; };
	this.getId = function(){ return id; };
}

function addTeleportParticles(targetEntity)
{
	addGroupParticles(targetEntity.getSprite().x+(targetEntity.getSprite().getBounds().width/2), targetEntity.getSprite().y+(targetEntity.getSprite().getBounds().height/2), 4, "#66FF99", 3, 0.1, 10, 3);
	addGroupParticles(targetEntity.getSprite().x+(targetEntity.getSprite().getBounds().width/2), targetEntity.getSprite().y+(targetEntity.getSprite().getBounds().height/2), 8, "#66FF99", 3, 0.025, 15, 0);
}