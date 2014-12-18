function Boss(x, y)
{
	var GET_PSYCHED = 0;
	var SHOOT_BULLETS = 1;
	var SHOOT_ROCKETS = 2;
	var SHOOT_FLAMES = 3;
	
	var shouldRest = false;
	var startFollowing = false;
	var hiddenForm = false;
	
	var vulners = [];
	
	var selfDestructText = new createjs.Text("", "bold 36px Arial", "#fff");
	var MAX_SELF_DESTRUCT = 10;
	var selfDestructCount = MAX_SELF_DESTRUCT;
	var selfDestructionInterval = -1;
	selfDestructText.visible = false;
	
	var onDeathInterval = -1;
	
	var container = new createjs.Container();
	
	var ss = new createjs.SpriteSheet({
		"animations": {
			"unactive": [0],
			"intro": [0,3,"opening"],
			"idle": [8,9],
			"still": [8],
			"beingDestroyed": [13],
			"opening": [4,7,"idle"],
			"attack": [12],
			"hurt": [13,13,"idle"],
			"closed": [27],
			"closing": [16,26,"closed"]
		},
		"frames": {
			"regX": 0,
			"regY": 0,
			"width": 244,
			"height": 274,
			"count": 28
		},
		"images": ["textures/enemies/boss/boss.png"]
	});
	
	ss.getAnimation("intro").speed = 0.03;
	ss.getAnimation("opening").speed = 0.2;
	ss.getAnimation("idle").speed = 0.08;
	ss.getAnimation("hurt").speed = 0.05;
	ss.getAnimation("closing").speed = 1;
	
	var sprite = new createjs.Sprite(ss, "unactive");
	container.addChild(sprite);
	setDefBounds();
	container.x = x;
	container.y = y;
	
	container.addChild(selfDestructText);
	
	this.getSprite = function(){return container;};
	
	createjs.Ticker.addEventListener("tick", onConstantBehavior);
	
	var onInteractInterval = setInterval(onEnemyInteract, 50);
	var active = false;
	var parent = this;
	var shootTimes = 0;
	var currentBehavior = -1;
	
	var turretGun1;
	var turretGun2;
	var rocketLauncher1;
	var rocketLauncher2;
	
	setUpWeapons();
	
	var healthBar = new EnemyHealthBar(sprite.getBounds().width, 4, 70, 15);
	container.addChild(healthBar.getHealthBar());
	
	function setDefBounds()
	{
		container.setBounds(50, 75, 125, 110);
	}
	
	function setUpWeapons()
	{
		var turretImg = "textures/enemies/boss/turretGun.png";
		var rocketImg = "textures/enemies/boss/rocketLauncher.png";
		turretGun1 = new BossWeapon(0, 60, turretImg, TERMIBLASTER_BULLET, 30, container);
		turretGun2 = new BossWeapon(240, 60, turretImg, TERMIBLASTER_BULLET, 30, container);
		rocketLauncher1 = new BossWeapon(70, 175, rocketImg, BLACKSPHERE_BULLET, 30, container);
		rocketLauncher2 = new BossWeapon(175, 175, rocketImg, BLACKSPHERE_BULLET, 30, container);
		container.addChild(turretGun1.getSprite(), turretGun2.getSprite(), rocketLauncher1.getSprite(), rocketLauncher2.getSprite());
	}
	
	function manipulateSelfDestruct(shouldStart)
	{
		if(shouldStart && !selfDestructText.visible)
		{
			selfDestructCount = MAX_SELF_DESTRUCT;
			selfDestructionInterval = setInterval(onSelfDestructCountdown, 1000);
			selfDestructText.visible = true;
		}
		else if(!shouldStart && selfDestructText.visible)
		{
			clearInterval(selfDestructionInterval);
			selfDestructText.visible = false;
		}
	}
	
	function onSelfDestructCountdown()
	{
		if(miniMenu != null)
			return;
		
		if(selfDestructText.visible)
		{
			selfDestructText.text = selfDestructCount;
			selfDestructCount--;
			
			if(selfDestructCount >= 0)
			{
				//centering the display text
				selfDestructText.regX = selfDestructText.getBounds().width/2;
				selfDestructText.regY = selfDestructText.getBounds().height/2;
				selfDestructText.x = sprite.getBounds().width/2;
				selfDestructText.y = sprite.getBounds().height/2;
			}
			else
			{
				player.setDeath();
				manipulateSelfDestruct(false);
				addGroupParticles(parent.getSprite().x+(parent.getSprite().getBounds().width/2), parent.getSprite().y+(parent.getSprite().getBounds().height/2), 4, "#fff", 3, 0.1, 3, 30);
			}
		}
	}
	
	function onConstantBehavior()
	{
		if(miniMenu != null)
			return;
		
		if(player.isDead())
		{
			parent.removeEnemyBehavior();
			return;
		}
			
		bulletArr.forEach(function(bullet){
			turretGun1 = weaponBulletCollision(turretGun1, bullet);
			turretGun2 = weaponBulletCollision(turretGun2, bullet);
			rocketLauncher1 = weaponBulletCollision(rocketLauncher1, bullet);
			rocketLauncher2 = weaponBulletCollision(rocketLauncher2, bullet);
		});
		
		if(startFollowing)
			followEntity(parent, player, 5);
		
		if(hiddenForm)
		{
			bulletArr.forEach(function(bullet){
				if(checkIntersection(parent, bullet))
					bulletColFunctionality(bullet);
			});
			
			if(checkIntersection(parent, player))
				bouncePlayer();
		}
		
		if(sprite.currentAnimation == "closed" && !hiddenForm)
		{
			var activeInid = Math.floor(Math.random()*4);
			
			for(var i = 0; i < 4; i++)
			{
				var newBossVulner = new BossVulnerability(i, (activeInid == i) ? true : false, parent);
				vulners.push(newBossVulner);
				container.addChild(newBossVulner.getSprite());
			}
			
			hiddenForm = true;
			manipulateSelfDestruct(true);
		}
		else if(sprite.currentAnimation == "closed" && hiddenForm)
		{		
			bulletArr.forEach(function(bullet){
				vulners.forEach(function(vulner){
					if(checkIntersection(bullet, vulner, true) && bullet.isPlayerBullet())
					{
						bulletColFunctionality(bullet);
						
						if(vulner.getActive())
						{
							vulner.destroy();
							vulners.splice($.inArray(vulner, vulners), 1);
						}
						else
						{
							player.setDeath();
							addGroupParticles(parent.getSprite().x+(parent.getSprite().getBounds().width/2), parent.getSprite().y+(parent.getSprite().getBounds().height/2), 4, "#fff", 3, 0.1, 3, 30);
							return;
						}
						
						if(vulners.length != 0 && vulner.getActive())
						{
							var activeInid = Math.floor(Math.random()*vulners.length);
							vulners[activeInid].setActive(true);
						}
						
						if(vulners.length == 0)
						{
							addGroupParticles(parent.getSprite().x+(parent.getSprite().getBounds().width/2), parent.getSprite().y+(parent.getSprite().getBounds().height/2), 4, "#f00", 3, 0.1, 3, 15);
							sprite.gotoAndPlay("opening");
							hiddenForm = false;
							onInteractInterval = setInterval(onEnemyInteract, 50);
							currentBehavior = GET_PSYCHED;
							setUpWeapons();
							currentBehavior = -1;
							shootTimes = 0;
							healthBar.removeHP();
							manipulateSelfDestruct(false);
						}
					}
				});
			});
		}
		
		if(healthBar.getCurrentHealth() == 0)
		{
			parent.removeEnemyBehavior();
			setDeathAnimation();
		}
	}
	
	function onEnemyInteract()
	{
		if(miniMenu != null)
			return;
		
		if(!isObjectOutOfStage(parent, 0) && !active)
		{
			active = true;
			sprite.gotoAndPlay("intro");
			repositionCamera(parent, true, 5500);
			switchMusic("ost6");
		}
		
		if(active && sprite.currentAnimation != "unactive" && sprite.currentAnimation != "intro" && sprite.currentAnimation != "opening")
		{
			if(turretGun1 != null && turretGun2 != null && !rocketLauncher1 != null && !rocketLauncher2 != null)
				if(!turretGun1.isActive() && !turretGun2.isActive() && !rocketLauncher1.isActive() && !rocketLauncher2.isActive())
				{
					turretGun1.setWeapon(true);
					turretGun2.setWeapon(true);
					rocketLauncher1.setWeapon(true);
					rocketLauncher2.setWeapon(true);
					currentBehavior = GET_PSYCHED;
				}
				
			executeBehavior();
		}
	}
	
	function executeBehavior()
	{
		if(turretGun1 == null && turretGun2 == null && rocketLauncher1 == null && rocketLauncher2 == null)
		{
			startFollowing = false;
			clearInterval(onInteractInterval);
			sprite.gotoAndPlay("closing");
			return;
		}
		
		if(!shouldRest)
		{
			if(sprite.currentAnimation != "attack" && sprite.currentAnimation != "hurt" && !shouldRest && currentBehavior != GET_PSYCHED)
				sprite.gotoAndPlay("attack");
			
			switch(currentBehavior)
			{
			case GET_PSYCHED : 
				onInteractInterval = changeInterval(onInteractInterval, onEnemyInteract, 1000);
				currentBehavior = SHOOT_BULLETS;
				break;
			case SHOOT_BULLETS : 
				if(shootTimes == 15 || (turretGun1 == null && turretGun2 == null))
				{
					currentBehavior = SHOOT_ROCKETS;
					shootTimes = 0;
					shouldRest = true;
					break;
				}
					
				if(shootTimes == 0)
					onInteractInterval = changeInterval(onInteractInterval, onEnemyInteract, 150);
				
				if(fireWeapons(turretGun1, turretGun2))
					shootTimes++;
				break;
			case SHOOT_ROCKETS : 
				if(shootTimes == 5 || (rocketLauncher1 == null && rocketLauncher2 == null))
				{
					currentBehavior = SHOOT_FLAMES;
					shootTimes = 0;
					shouldRest = true;
					break;
				}
				
				if(shootTimes == 0)
					onInteractInterval = changeInterval(onInteractInterval, onEnemyInteract, 500);
				
				if(fireWeapons(rocketLauncher1, rocketLauncher2))
					shootTimes++;
				break;
			case SHOOT_FLAMES : 
				shootFromDirections(parent, ['up', 'down', 'left', 'right', 'up left', 'up right', 'down left', 'down right'], FLAMETHROWER_BULLET);
				currentBehavior = SHOOT_BULLETS;
				onInteractInterval = changeInterval(onInteractInterval, onEnemyInteract, 500);
				shouldRest = true;
				break;
			}
			
			startFollowing = false;
		}
		else
		{
			sprite.gotoAndPlay("idle");
			shouldRest = false;
			startFollowing = true;
			onInteractInterval = changeInterval(onInteractInterval, onEnemyInteract, 1000);
		}
	}
	
	var rotationSpeed = Math.random()*10;
	var rotationDir = false;
	
	function setDeathAnimation()
	{
		sprite.gotoAndStop("still");
		
		var animationStage = -1;
		var counter = 0;
		onDeathInterval = setInterval(onDeathAnimation, 80);
		
		function onDeathAnimation()
		{
			if(miniMenu != null)
				return;
			
			switch(animationStage)
			{
			case -1 : 
				setDefBounds();
				repositionCamera(parent, true, 7000);
				animationStage++;
				
				container.regX = sprite.getBounds().width/2;
				container.regY = sprite.getBounds().height/2;
				container.x += sprite.getBounds().width/2;
				container.y += sprite.getBounds().height/2;
				break;
			case 0 : 
				if(counter != 30)
				{
					if((counter % 2) == 0)
						container.x += 3;
					else
						container.x -= 3;
					counter++;
				}
				else
				{
					animationStage++;
					counter = 0;
				}
				break;
			case 1 : 
				if(counter == 0)
				{
					sprite.gotoAndStop("beingDestroyed");
					onDeathInterval = changeInterval(onDeathInterval, onDeathAnimation, 150);
					createjs.Ticker.addEventListener("tick", onRotation);
				}
				
				if(counter != 10)
				{
					playSoundEffect(EXPLOSION_SOUND);
					addGroupParticles(parent.getSprite().x, 
						parent.getSprite().y, 
						4, 
						"#ff9000", 
						3, 
						0.1, 
						3, 
						5);
					
					rotationSpeed = Math.random()*10;
					rotationDir = !rotationDir;
					counter++;
					
					if(rotationDir)
						rotationSpeed *= -1;
				}
				else
				{
					animationStage++;
					counter = 0;
				}
				break;
			case 2 : 
				if(counter == 0)
					rotationSpeed = 30;
				
				if(counter != 15)
				{
					playSoundEffect(EXPLOSION_SOUND);
					addGroupParticles(parent.getSprite().x, 
						parent.getSprite().y, 
						4, 
						"#ff9000", 
						3, 
						0.1, 
						3, 
						5);
					
					counter++;
				}
				else
				{
					createjs.Ticker.removeEventListener("tick", onRotation);
					animationStage++;
					counter = 0;
				}
				break;
			case 3 : 
				playSoundEffect(EXPLOSION_SOUND);
				addGroupParticles(parent.getSprite().x, 
						parent.getSprite().y, 
						4, 
						"#ff9000", 
						3, 
						0.1, 
						3, 
						30);
				
				shakeCamera();
				clearInterval(onDeathInterval);
				onDeathInterval = -1;
				parent.removeEnemy();
				break;
			}
		}
	}
	
	function onRotation()
	{
		if(miniMenu != null)
			return;
		
		container.rotation += rotationSpeed;
	}
	
	function weaponBulletCollision(bossWeapon, bullet)
	{
		if(bossWeapon != null && bossWeapon.isActive())
		{	
			if(checkIntersection(bullet, bossWeapon, true) && bullet.isPlayerBullet())
			{
				bossWeapon.hurtEnemy();
				bulletColFunctionality(bullet);
				playSoundEffect(TARGETSHOT_SOUND);

				if(bossWeapon.getDeath())
				{
					sprite.gotoAndPlay("hurt");
					return null;
				}
			}
		}
		
		return bossWeapon;
	}
	
	function fireWeapons(weapon1, weapon2)
	{
		var wasShot = false;
		
		if(weapon1 != null)
			if(weapon1.fireBullet())
				wasShot = true;
		
		if(weapon2 != null)
			if(weapon2.fireBullet())
				wasShot = true;
			
		return wasShot;
	}
	
	this.removeEnemyBehavior = function()
	{
		if(onDeathInterval != -1)
			clearInterval(onDeathInterval);
		
		createjs.Ticker.removeEventListener("tick", onRotation);
		clearInterval(onInteractInterval);
		createjs.Ticker.removeEventListener("tick", onConstantBehavior);
		manipulateSelfDestruct(false);
		
		if(turretGun1 != null)	
			turretGun1.removeEnemyBehavior();
		
		if(turretGun2 != null)	
			turretGun2.removeEnemyBehavior();
		
		if(rocketLauncher1 != null)	
			rocketLauncher1.removeEnemyBehavior();
		
		if(rocketLauncher2 != null)	
			rocketLauncher2.removeEnemyBehavior();
	};
	
	this.removeEnemy = removeEnemy;
}

function BossWeapon(x, y, imageUrl, bulletType, healthAmount, bossDisplayObject)
{
	var active = false;
	var dead = false;
	var manWeaponInterval = -1;
	var parent = this;
	
	var container = new createjs.Container();
	
	var graphics = new createjs.Bitmap(imageUrl);
	graphics.regX = graphics.getBounds().width/2;
	graphics.regY = graphics.getBounds().height/2;
	graphics.x = graphics.getBounds().width/2;
	graphics.y = graphics.getBounds().height/2;
	
	container.addChild(graphics);
	container.setBounds(0, 0, graphics.getBounds().width, graphics.getBounds().height);
	
	container.alpha = 0;
	graphics.regX = graphics.getBounds().height/2;
	graphics.regY = graphics.getBounds().height/2;
	
	container.x = x - container.getBounds().width/2;
	container.y = y - container.getBounds().height/2;
	
	this.fireBullet = function()
	{
		if(active)
		{
			var ltgPoint = this.getSprite().localToGlobal(0,0);
			createBullet(
				ltgPoint.x + container.getBounds().width/2, 
				ltgPoint.y + container.getBounds().height/2, 
				player.getSprite().x + player.getSprite().getBounds().width/2, 
				player.getSprite().y + player.getSprite().getBounds().height/2, 
				bulletType, 
				null);
			return true;
		}
		else
			return false;
	};
	this.getSprite = function(){return container;};
	this.setWeapon = function(shouldActivate)
	{
		if(manWeaponInterval == -1 && shouldActivate == !active)
		{
			active = shouldActivate;
			manWeaponInterval = setInterval(onManipulateWeapon, 25);
			tiltRotate(graphics, 10);
		}
	};
	this.isActive = function(){return active;};
	
	var healthBar = new EnemyHealthBar(this.getSprite().getBounds().width, healthAmount, 2, 5);
	container.addChild(healthBar.getHealthBar());
	this.getHealthBar = function(){ return healthBar; };
	
	createjs.Ticker.addEventListener("tick", onAimAtPlayer);
	
	function onAimAtPlayer()
	{
		if(miniMenu != null)
			return;
		
		if(active && manWeaponInterval == -1)
		{
			var ltgPoint = graphics.localToGlobal(0,0);
			rotateTargetTowards(
				graphics, 
				ltgPoint.x, 
				ltgPoint.y, 
				player.getSprite().x+player.getSprite().getBounds().width/2, 
				player.getSprite().y+player.getSprite().getBounds().height/2
				);
		}
	}
	
	function onManipulateWeapon()
	{
		if(active)
		{
			container.alpha += 0.05;
			if(container.alpha >= 1)
			{
				clearInterval(manWeaponInterval);
				manWeaponInterval = -1;
			}
		}
		else
		{
			container.alpha -= 0.05;
			if(container.alpha <= 0)
			{
				clearInterval(manWeaponInterval);
				manWeaponInterval = -1;
			}
		}
	}
	
	this.removeEnemyBehavior = function()
	{
		createjs.Ticker.removeEventListener("tick", onAimAtPlayer);
		clearInterval(manWeaponInterval);
		manWeaponInterval = -1;
	}
	
	this.hurtEnemy = hurtEnemy;
	this.removeEnemy = function()
	{
		this.removeEnemyBehavior();
		bossDisplayObject.removeChild(this.getSprite());
	};
	
	this.setDeath = function()
	{
		playSoundEffect(EXPLOSION_SOUND)
		var ltgPoint = this.getSprite().localToGlobal(0,0);
		addGroupParticles(ltgPoint.x+(this.getSprite().getBounds().width/2), ltgPoint.y+(this.getSprite().getBounds().height/2), 4, "#ff6600", 3, 0.1, 3, 3);
		addGroupParticles(ltgPoint.x+(this.getSprite().getBounds().width/2), ltgPoint.y+(this.getSprite().getBounds().height/2), 8, "#ff6600", 3, 0.025, 3, 0);
		this.removeEnemy();
		dead = true;
	};
	
	this.getDeath = function(){return dead;};
}

var BOSS_VULNER_LEFT = 0;
var BOSS_VULNER_UP = 1;
var BOSS_VULNER_RIGHT = 2;
var BOSS_VULNER_DOWN = 3;
var BOSS_VULNER_COUNT = 4;

function BossVulnerability(direction, act, bossClassReference)
{
	var active = act;
	
	var ss = new createjs.SpriteSheet({
		"animations":{
			"inactive": [direction],
			"active": [direction+BOSS_VULNER_COUNT]
		},
		"images": ["textures/enemies/boss/vulnerability.png"],
		"frames":{
			"regX": 0,
			"regY": 0,
			"width": 28,
			"height": 28,
			"count": 8
		}
	});
	
	var setAs = "inactive";
	
	if(active)
		setAs = "active";
	
	var sprite = new createjs.Sprite(ss, setAs);
	
	var vulnerX = -1;
	var vulnerY = -1;
	
	var bossBounds = bossClassReference.getSprite().getBounds();
	
	switch(direction)
	{
	case BOSS_VULNER_LEFT : 
		vulnerX = -15; 
		vulnerY = bossBounds.height; 
		break;
	case BOSS_VULNER_UP : 
		vulnerX = bossBounds.width/2 + 50; 
		vulnerY = bossBounds.y - 30; 
		break;
	case BOSS_VULNER_RIGHT : 
		vulnerX = bossBounds.x + bossBounds.width + 60; 
		vulnerY = bossBounds.height; 
		break;
	case BOSS_VULNER_DOWN : 
		vulnerX = bossBounds.width/2 + 50; 
		vulnerY = bossBounds.y + bossBounds.height; 
		break;
	}
	
	sprite.regX = sprite.getBounds().width/2;
	sprite.regY = sprite.getBounds().height/2;
	sprite.x = vulnerX + sprite.getBounds().width/2;
	sprite.y = vulnerY + sprite.getBounds().height/2;
	
	this.getSprite = function(){return sprite;};
	
	this.setActive = function(bool)
	{
		active = bool;
		
		if(active)
			sprite.gotoAndStop("active");
		else
			sprite.gotoAndStop("inactive");
	};
	
	this.getActive = function(){return active;};
	
	this.destroy = function()
	{
		playSoundEffect(EXPLOSION_SOUND);
		var ltgPoint = this.getSprite().localToGlobal(0,0);
		addGroupParticles(ltgPoint.x+(this.getSprite().getBounds().width/2), ltgPoint.y+(this.getSprite().getBounds().height/2), 4, "#ff6600", 3, 0.1, 3, 3);
		addGroupParticles(ltgPoint.x+(this.getSprite().getBounds().width/2), ltgPoint.y+(this.getSprite().getBounds().height/2), 8, "#ff6600", 3, 0.025, 3, 0);
		bossClassReference.getSprite().removeChild(this.getSprite());
	};
}