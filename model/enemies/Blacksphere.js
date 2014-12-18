function Blacksphere(x, y)
{
	var dead = false;
	var active = false;
	var deathStageCount = 0;
	
	var container = new createjs.Container();
	container.x = x;
	container.y = y;
	
	var ss = new createjs.SpriteSheet({
		"images": ["textures/enemies/blacksphere/blacksphere.png"],
		"frames": {
			"regX": 0,
			"regY": 0,
			"width": 55,
			"height": 50,
			"count": 1
		}
	});
	
	var sprite = new createjs.Sprite(ss, 0);
	sprite.regX = sprite.getBounds().width/2;
	sprite.regY = sprite.getBounds().height/2;
	sprite.x = sprite.getBounds().width/2;
	sprite.y = sprite.getBounds().height/2;
	
	container.addChild(sprite);
	
	this.getSprite = function(){return container;};
	
	var healthBar = new EnemyHealthBar(this.getSprite().getBounds().width, 30, 2, 5);
	container.addChild(healthBar.getHealthBar());
	this.getHealthBar = function(){ return healthBar; };
	
	createjs.Ticker.addEventListener("tick", onEnemyInteract);
	var onShootInterval = -1;
	
	var parent = this;
	
	function onEnemyInteract()
	{
		if(miniMenu != null)
			return;
		
		if(!isObjectOutOfStage(parent, 0) && !active)
		{
			active = true;
			onShootInterval = setInterval(onEnemyShoot, 2000);
		}
		
		if(active && !player.isDead() && !stageCompleted)
		{
			if(!dead)
			{
				rotateTargetTowards(sprite, container.x, container.y, player.getSprite().x, player.getSprite().y);
				followEntity(parent, player, 3);
				
				if(entityCollision(parent, collisWallArr, true))
				{
					var radians = sprite.rotation * Math.PI / 180;
					container.x += Math.cos(radians) * 60;
					container.y += Math.sin(radians) * 60;
					addTeleportParticles(parent);
				}
			}
			else
			{
				clearInterval(onShootInterval);
				
				//death animation
				if(deathStageCount != 20)
				{
					if((deathStageCount % 2) == 0)
						container.x += 5;
					else
						container.x -= 5;
					
					if((deathStageCount % 5) == 0)
						addGroupParticles(parent.getSprite().x+(parent.getSprite().getBounds().width/2), parent.getSprite().y+(parent.getSprite().getBounds().height/2), 4, "#ff6600", 3, 0.1, 7, 2);
					
					deathStageCount++;
				}
				else
				{
					shakeCamera();
					addGroupParticles(parent.getSprite().x+(parent.getSprite().getBounds().width/2), parent.getSprite().y+(parent.getSprite().getBounds().height/2), 4, "#ff6600", 3, 0.1, 3, 5);
					parent.removeEnemy();
				}
				
				playSoundEffect(EXPLOSION_SOUND);
			}
		}
	}
	
	var bulletsCount = 0;
	
	function onEnemyShoot()
	{
		if(miniMenu != null)
			return;
		
		if(!player.isDead() && !stageCompleted)
		{
			if(bulletsCount == 5)
			{	
				shootFromDirections(parent, ['up', 'down', 'left', 'right'], BLACKSPHERE_BULLET);
				bulletsCount = 0;
				onShootInterval = changeInterval(onShootInterval, onEnemyShoot, 2000);
			}
			else
			{
				if(bulletsCount == 0)
					onShootInterval = changeInterval(onShootInterval, onEnemyShoot, 250);
				
				createBullet(container.x + sprite.getBounds().width/2, 
					container.y + sprite.getBounds().height/2, 
					stage.canvas.width/2, 
					stage.canvas.height/2, 
					BLACKSPHERE_BULLET,
					null);
				
				bulletsCount++;
			}
		}
	}
	
	this.removeEnemyBehavior = function()
	{
		createjs.Ticker.removeEventListener("tick", onEnemyInteract);
		clearInterval(onShootInterval);
	};
	
	this.hurtEnemy = hurtEnemy;
	this.removeEnemy = removeEnemy;
	
	this.setDeath = function()
	{
		dead = true;
	};
}