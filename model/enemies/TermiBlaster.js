function TermiBlaster(x, y)
{
	var speed = 5;
	var isActive = false;
	var distanceActivation = 0;
	
	var container = new createjs.Container();
	container.x = x;
	container.y = y;
	
	var ss = new createjs.SpriteSheet({
		"animations": {
			"rightIdle":[0],
			"rightAttack":[1],
			"leftIdle":[2],
			"leftAttack":[3],
		},
		"images": ["textures/enemies/termiblaster/termiblaster.png"],
		"frames": {
			"regX": 0,
			"regY": 0,
			"width": 41,
			"height": 39,
			"count": 4
		}
	});
	
	var sprite = new createjs.Sprite(ss, 0);
	container.addChild(sprite);
	container.setBounds(0, 0, sprite.getBounds().width, sprite.getBounds().height);
	
	this.getSprite = function(){return container;};
	createjs.Ticker.addEventListener("tick", onEnemyInteract);
	var enemyShootInterval = -1;
	
	var healthBar = new EnemyHealthBar(this.getSprite().getBounds().width, 18, 2, 5);
	container.addChild(healthBar.getHealthBar());
	this.getHealthBar = function(){ return healthBar; };
	
	var parent = this;
	var shouldShoot = false;
	var bulletsCounts = 0;
	
	var shouldTurn = false;
	var turnInterval = -1;
	
	function onEnemyInteract()
	{
		if(miniMenu != null)
			return;
		
		if(!isObjectOutOfStage(parent, distanceActivation) && !player.isDead() && !stageCompleted)
		{
			if(!isActive)
			{
				isActive = true;
				distanceActivation = 20;
				enemyShootInterval = setInterval(onEnemyShoot, 3000);
			}
			
			if(!shouldShoot)
			{
				if(player.getSprite().x < container.x)
				{
					if(sprite.currentAnimation != "leftIdle")
						sprite.gotoAndStop("leftIdle");
				}
				else
				{
					if(sprite.currentAnimation != "rightIdle")
						sprite.gotoAndStop("rightIdle");
				}
				
				var angleRadians = Math.atan2(
					(player.getSprite().y + player.getSprite().getBounds().height/2) - (parent.getSprite().y + parent.getSprite().getBounds().height/2), 
					(player.getSprite().x + player.getSprite().getBounds().width/2) - (parent.getSprite().x + parent.getSprite().getBounds().width/2)
					);
				
				if(shouldTurn)
				{
					var degrees = toDegrees(angleRadians);
					degrees += 360;
					angleRadians = toRadians(degrees);
				}
				
				parent.getSprite().x += Math.round(Math.cos(angleRadians) * speed);
				parent.getSprite().y += Math.round(Math.sin(angleRadians) * speed);
				
				if(entityCollision(parent, collisWallArr, true))
				{
					onTurn();
					addGroupParticles(parent.getSprite().x + (parent.getSprite().getBounds().width/2), parent.getSprite().y + (parent.getSprite().getBounds().width/2), 5, "#FFF", 4, 0.1, 5, 0.07);
				}
			}
		}
	}
	
	function onTurn()
	{	
		if(shouldTurn && turnInterval != -1)
			clearInterval(turnInterval);
		else
			turnInterval = setInterval(onTurn, 500);
			
		shouldTurn = !shouldTurn;
	}
	
	function onEnemyShoot()
	{
		if(miniMenu != null)
			return;
		
		if(isActive && !player.isDead() && !stageCompleted && !isObjectOutOfStage(parent, distanceActivation))
		{	
			if(!shouldShoot)
			{
				if(sprite.currentAnimation == "leftIdle")
					sprite.gotoAndStop("leftAttack");
				else if(sprite.currentAnimation == "rightIdle")
					sprite.gotoAndStop("rightAttack");
				
				shouldShoot = true;
				enemyShootInterval = changeInterval(enemyShootInterval, onEnemyShoot, 100);
			}
			
			if(bulletsCounts != 10)
			{
				createBullet(container.x + container.getBounds().width/2, 
					container.y + container.getBounds().height/2, 
					player.getSprite().x+player.getSprite().getBounds().width/2, 
					player.getSprite().y+player.getSprite().getBounds().height/2, 
					TERMIBLASTER_BULLET,
					null);
				bulletsCounts++;
			}
			else
			{
				shouldShoot = false;
				bulletsCounts = 0;
				enemyShootInterval = changeInterval(enemyShootInterval, onEnemyShoot, 3000);
			}
		}
	}
	
	this.hurtEnemy = hurtEnemy;
	this.removeEnemy = removeEnemy;
	
	this.setDeath = function()
	{
		playSoundEffect(EXPLOSION_SOUND);
		addGroupParticles(this.getSprite().x+(this.getSprite().getBounds().width/2), this.getSprite().y+(this.getSprite().getBounds().height/2), 4, "#ff6600", 3, 0.1, 3, 5);
		addGroupParticles(this.getSprite().x+(this.getSprite().getBounds().width/2), this.getSprite().y+(this.getSprite().getBounds().height/2), 8, "#ff6600", 3, 0.025, 3, 0);
		this.removeEnemy();
	};
	
	this.removeEnemyBehavior = function()
	{
		createjs.Ticker.removeEventListener("tick", onEnemyInteract);
		clearInterval(enemyShootInterval);
	}
}