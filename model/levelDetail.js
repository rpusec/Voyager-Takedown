//LIGHT
var DT_LIGHT_UP = l1;
var DT_LIGHT_DOWN = l2;
var DT_LIGHT_LEFT = l3;
var DT_LIGHT_RIGHT = l4;

//COMP
var DT_LARGE_COMP = cl;
var DT_MINI_COMP = cm;

//POLE
var DT_POLE_CHAINS_HOR = ch;
var DT_POLE_CHAINS_VER = cv;
var DT_POLE_NORMAL_HOR = nh;
var DT_POLE_NORMAL_VER = nv;

//POWER BEAM
var DT_PB_UP = p1;
var DT_PB_DOWN = p2;
var DT_PB_LEFT = p3;
var DT_PB_RIGHT = p4;

function DetailTexture(textureId, x, y)
{
	var DIR_ROOT = "textures/detail/";

	var textureProperties = null;

	switch(textureId)
	{
		case DT_LIGHT_UP : 
			textureProperties = new TextureProperties(DIR_ROOT + "lights.png", 42, 55, 1, 22, 30, 0, 0);
			break;
		case DT_LIGHT_DOWN : 
			textureProperties = new TextureProperties(DIR_ROOT + "lights.png", 42, 55, 1, 22, 55, 180, 0);
			break;
		case DT_LIGHT_LEFT : 
			textureProperties = new TextureProperties(DIR_ROOT + "lights.png", 42, 55, 1, 22, 30, 270, 0);
			break;
		case DT_LIGHT_RIGHT : 
			textureProperties = new TextureProperties(DIR_ROOT + "lights.png", 42, 55, 1, 22, 55, 90, 0);
			break;
		case DT_LARGE_COMP : 
			textureProperties = new TextureProperties(DIR_ROOT + "large_comp.png", 244, 133, 3, 125, 108, 0, 0.1);
			break;
		case DT_MINI_COMP : 
			textureProperties = new TextureProperties(DIR_ROOT + "mini_comp.png", 71, 60, 4, 35, 30, 0, 0.1);
			break;
		case DT_POLE_CHAINS_HOR : 
			textureProperties = new TextureProperties(DIR_ROOT + "pole_chains.png", 25, 25, 1, 0, 0, 0, 0);
			break;
		case DT_POLE_CHAINS_VER : 
			textureProperties = new TextureProperties(DIR_ROOT + "pole_chains.png", 25, 25, 1, 25, 25, 90, 0);
			break;
		case DT_POLE_NORMAL_HOR : 
			textureProperties = new TextureProperties(DIR_ROOT + "pole_normal.png", 25, 25, 1, 0, 0, 0, 0);
			break;
		case DT_POLE_NORMAL_VER : 
			textureProperties = new TextureProperties(DIR_ROOT + "pole_normal.png", 25, 25, 1, 25, 25, 90, 0);
			break;
		case DT_PB_UP : 
			textureProperties = new TextureProperties(DIR_ROOT + "power_beam.png", 170, 250, 2, 85, 225, 0, 0.1);
			break;
		case DT_PB_DOWN : 
			textureProperties = new TextureProperties(DIR_ROOT + "power_beam.png", 170, 250, 2, 85, 250, 180, 0.1);
			break;
		case DT_PB_LEFT : 
			textureProperties = new TextureProperties(DIR_ROOT + "power_beam.png", 170, 250, 2, 50, 225, 270, 0.1);
			break;
		case DT_PB_RIGHT : 
			textureProperties = new TextureProperties(DIR_ROOT + "power_beam.png", 170, 250, 2, 85, 250, 90, 0.1);
			break;
	}

	var ss = new createjs.SpriteSheet({
		"animations":{"normal": [0,textureProperties.count-1]},
		"frames":{"regX":0, "regY":0, "width":textureProperties.width, "height": textureProperties.height, "count": textureProperties.count},
		"images": [textureProperties.imageLocation]
	});

	ss.getAnimation("normal").speed = textureProperties.speed;

	var sprite = new createjs.Sprite(ss, "normal");
	sprite.x = x;
	sprite.y = y;

	sprite.regX = textureProperties.regX;
	sprite.regY = textureProperties.regY;

	sprite.rotation = textureProperties.rotation;

	this.getSprite = function(){ return sprite; };

	function TextureProperties(imageLocation, width, height, count, regX, regY, rotation, speed)
	{
		this.imageLocation = imageLocation;
		this.width = width;
		this.height = height;
		this.count = count;
		this.regX = regX;
		this.regY = regY;
		this.rotation = rotation;
		this.speed = speed;
	}
}