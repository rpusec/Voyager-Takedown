var RED_KEY = 1;
var BLUE_KEY = 2;
var YELLOW_KEY = 3;

var KEY_CARD = 1;
var KEY_INPUT = 2;
var KEY_WALL = 3;

function KeyHud(type, x, y)
{
	var keyType = type;
	
	var keyId = framesReference(type);
	
	var ss = new createjs.SpriteSheet({
		"images": ["textures/envir/keys/keyhud.png"],
		"animations": {"notActive" : [keyId], "active" : [keyId+1]},
		"frames": {"regX": 0, "regY": 0, "height": 30, "width": 30, "count": 6}
	});
	
	var sprite = new createjs.Sprite(ss, "notActive");
	sprite.x = x;
	sprite.y = y;
	
	this.getSprite = function(){return sprite;};
	this.getType = function(){return keyType;};
}

function KeyCard(type, x, y)
{
	var keyType = type;
	
	var keyId = framesReference(type);
	
	var ss = new createjs.SpriteSheet({
		"images": ["textures/envir/keys/keycards.png"],
		"animations": {"normal" : [keyId, keyId+1]},
		"frames": {"regX": 0, "regY": 0, "height": 30, "width": 30, "count": 6}
	});
	
	ss.getAnimation("normal").speed = 0.1;
	
	var sprite = new createjs.Sprite(ss, "normal");
	sprite.x = x;
	sprite.y = y;
	
	this.getSprite = function(){return sprite;};
	this.getType = function(){return keyType;};
}

function KeyInput(type, x, y)
{
	var keyType = type;
	var closed = false;
	
	var keyId = framesReference(type);
	
	var ss = new createjs.SpriteSheet({
		"images": ["textures/envir/keys/keyinputs.png"],
		"animations": {"opened" : [keyId], "closed" : [keyId+1]},
		"frames": {"regX": 0, "regY": 0, "height": 30, "width": 30, "count": 6}
	});
	
	var sprite = new createjs.Sprite(ss, "opened");
	sprite.x = x;
	sprite.y = y;
	
	this.isClosed = function(){return closed;};
	this.closeInput = function(){sprite.gotoAndPlay("closed"); closed = true;};
	this.getSprite = function(){return sprite;};
	this.getType = function(){return keyType;};
}

function KeyWall(type, x, y)
{
	var keyType = type;
	
	var keyId = framesReference(type);
	
	var ss = new createjs.SpriteSheet({
		"images": ["textures/envir/keys/keywalls.png"],
		"animations": {"normal" : [keyId, keyId+1]},
		"frames": {"regX": 0, "regY": 0, "height": 25, "width": 25, "count": 6}
	});
	
	ss.getAnimation("normal").speed = 0.1;
	
	var sprite = new createjs.Sprite(ss, "normal");
	sprite.x = x;
	sprite.y = y;
	
	this.getSprite = function(){return sprite;};
	this.getType = function(){return keyType;};
}

function framesReference(keyId)
{
	switch(keyId)
	{
	case RED_KEY : 
		return 0;
	case BLUE_KEY : 
		return 2;
	case YELLOW_KEY : 
		return 4;
	}
}

function pickKey(key)
{
	switch(key.getType())
	{
	case RED_KEY : 
		hasRedKey = true; 
		break;
	case BLUE_KEY : 
		hasBlueKey = true; 
		break;
	case YELLOW_KEY : 
		hasYellowKey = true;
		break;
	}
	
	addKeyParicles(key);
	hud.setKeyAsActive(key.getType(), true);
	stage.removeChild(key.getSprite());
	keyCards.splice($.inArray(key, keyCards), 1);
}

function removeKeyWall(wallType, keyInput)
{
	var wasUsed = false;
	
	switch(wallType)
	{
	case RED_KEY : 
		if(hasRedKey)
		{
			redKeyWalls.forEach(function(wall){
				if(wall.getType())
					stage.removeChild(wall.getSprite());
			});
			
			redKeyWalls = [];
			hasRedKey = false;
			wasUsed = true;

			playSoundEffect(KEY_SOUND);
		}
		break;
	case BLUE_KEY : 
		if(hasBlueKey)
		{
			blueKeyWalls.forEach(function(wall){
				if(wall.getType())
					stage.removeChild(wall.getSprite());
			});
			
			blueKeyWalls = [];
			hasBlueKey = false;
			wasUsed = true;

			playSoundEffect(KEY_SOUND);
		}
		break;
	case YELLOW_KEY : 
		if(hasYellowKey)
		{
			yellowKeyWalls.forEach(function(wall){
				if(wall.getType())
					stage.removeChild(wall.getSprite());
			});
			
			yellowKeyWalls = [];
			hasYellowKey = false;
			wasUsed = true;

			playSoundEffect(KEY_SOUND);
		}
		break;
	}
	
	if(wasUsed)
	{
		keyInput.closeInput();
		addKeyParicles(keyInput);
		hud.setKeyAsActive(keyInput.getType(), false);
	}
}