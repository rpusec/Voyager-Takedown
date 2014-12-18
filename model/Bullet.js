var PLAYER_BULLET = 0;
var TURRET_BULLET = 1;
var TERMIBLASTER_BULLET = 2;
var BLACKSPHERE_BULLET = 3;
var FLAMETHROWER_BULLET = 4;

function Bullet(fromX, fromY, targetX, targetY, type, customAngleRadian)
{
	var bulletType = type;
	var bulletProperties = null;
	
	switch(type)
	{
	case PLAYER_BULLET :
		playSoundEffect(BLASTER_SOUND);
		bulletProperties = new BulletProperties(20, 25, true, "#fff", "textures/player/bullet.png", 23, 23, 4);
		break;
	case TURRET_BULLET : 
		playSoundEffect(TURRET_SOUND);
		bulletProperties = new BulletProperties(15, 40, false, "#fff", "textures/enemies/turret/bullet.png", 23, 23, 1);
		break;
	case TERMIBLASTER_BULLET : 
		playSoundEffect(BLASTER_SOUND);
		bulletProperties = new BulletProperties(20, 40, false, "#fff", "textures/enemies/termiblaster/bullet.png", 19, 19, 1);
		break;
	case BLACKSPHERE_BULLET : 
		playSoundEffect(ROCKET_SOUND);
		bulletProperties = new BulletProperties(15, 1, false, "#ff7d3d", "textures/enemies/blacksphere/bullet.png", 36, 19, 1);
		break;
	case FLAMETHROWER_BULLET :
		playSoundEffect(FIREBALL_SOUND);
		bulletProperties = new BulletProperties(15, 10, false, "#ffc000", "textures/enemies/flamethrower/bullet.png", 43, 41, 1);
		break;
	}
	
	var ss = new createjs.SpriteSheet({
		"images": [bulletProperties.bulletImgPath],
		"animations": {"normal": [0, bulletProperties.maxImgs-1]},
		"frames": {"regX": 0, "regY": 0, "height": bulletProperties.bulletHeight, "width": bulletProperties.bulletWidth, "count": bulletProperties.maxImgs}
	});
	
	ss.getAnimation("normal").speed = 0.5;
	
	var sprite = new createjs.Sprite(ss, "normal");
	sprite.regX = bulletProperties.regX;
	sprite.regY = bulletProperties.regY;
	
	createjs.Ticker.addEventListener("tick", onMoveBullet);
	
	var angleRadian = null;
	
	if(customAngleRadian != null)
		angleRadian = customAngleRadian;
	else
		angleRadian = Math.atan2(targetY - fromY, targetX - fromX);
	
	sprite.x = fromX + (Math.cos(angleRadian) * bulletProperties.distanceBullet);
	sprite.y = fromY + (Math.sin(angleRadian) * bulletProperties.distanceBullet);
	sprite.rotation = toDegrees(angleRadian) - 180;
	
	function onMoveBullet()
	{
		if(miniMenu != null)
			return;
		
		sprite.x += Math.cos(angleRadian) * bulletProperties.bulletSpeed;
		sprite.y += Math.sin(angleRadian) * bulletProperties.bulletSpeed;
	}
	
	this.getSprite = function() { return sprite; };
	this.isPlayerBullet = function() { return bulletProperties.playerBullet; }
	this.getBulletType = function(){ return bulletType; };
	
	this.removeBullet = function(shouldAddParticles)
	{
		if(shouldAddParticles)
			addGroupParticles(sprite.x + (sprite.getBounds().width/2), sprite.y + (sprite.getBounds().height/2), 1, bulletProperties.explColor, 4, 0.025, 3, 0.2);

		createjs.Ticker.removeEventListener("tick", onMoveBullet);
		stage.removeChild(sprite);
		bulletArr.splice($.inArray(this, bulletArr), 1);
	};
	
	function BulletProperties(bulletSpeed, distanceBullet, playerBullet, explColor, bulletImgPath, bulletWidth, bulletHeight, maxImgs)
	{
		this.bulletSpeed = bulletSpeed;
		this.distanceBullet = distanceBullet;
		this.playerBullet = playerBullet;
		this.explColor = explColor;
		this.bulletImgPath = bulletImgPath;
		this.bulletWidth = bulletWidth;
		this.bulletHeight = bulletHeight;
		this.maxImgs = maxImgs;
		this.regX = this.bulletWidth/2;
		this.regY = this.bulletHeight/2;
	}
}

function bulletColFunctionality(bullet)
{
	addGroupParticles(bullet.getSprite().x, bullet.getSprite().y, 5, "#fff", 3, 0.025, 20, 0.01);
	bullet.removeBullet(true);
}

function createBullet(fromX, fromY, targetX, targetY, type, customAngleRadian)
{
	var newBullet = new Bullet(fromX, fromY, targetX, targetY, type, customAngleRadian);
	bulletArr.push(newBullet);
	stage.addChild(newBullet.getSprite());
}