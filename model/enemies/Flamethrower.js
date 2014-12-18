function Flamethrower(x, y)
{	
	var body = new createjs.Bitmap("textures/enemies/flamethrower/flamethrower.png");
	body.regX = body.getBounds().width/2;
	body.regY = body.getBounds().height/2;
	body.x = body.getBounds().width/2;
	body.y = body.getBounds().height/2;
	
	var container = new createjs.Container();
	container.addChild(body);
	container.setBounds(0, 0, body.getBounds().width, body.getBounds().height);
	container.x = x;
	container.y = y;
	
	this.getSprite = function(){return container;};
	
	var healthBar = new EnemyHealthBar(this.getSprite().getBounds().width, 40, 2, 5);
	container.addChild(healthBar.getHealthBar());
	this.getHealthBar = function(){ return healthBar; };
	
	createjs.Ticker.addEventListener("tick", onEnemyInteract);
	var onShootInterval = -1;
	var shootTimes = 0;
	var parent = this;
	var isActive = false;
	var distanceActivation = 0;
	var speed = 2;
	
	function onEnemyInteract()
	{
		if(miniMenu != null || player.isDead())
			return;
		
		if(!isObjectOutOfStage(parent, distanceActivation) && !stageCompleted)
		{
			if(!isActive)
			{
				isActive = true;
				onShootInterval = setInterval(onEnemyShoot, 3000);
				distanceActivation = 400;
			}
			else
			{
				rotateTargetTowards(body, container.x, container.y, player.getSprite().x, player.getSprite().y);
				followEntity(parent, player, speed);
			
				if(checkIntersection(parent, player))
					player.setDeath();
				
				if(entityCollision(parent, collisWallArr, true))
				{
					var angleRadians = Math.atan2(player.getSprite().y - container.y, player.getSprite().x - container.x);
					container.x -= Math.floor(Math.cos(angleRadians) * speed);
					container.y -= Math.floor(Math.sin(angleRadians) * speed);
				}
			}
		}
	}
	
	function onEnemyShoot()
	{
		if(miniMenu != null || player.isDead())
			return;
		
		if(isObjectOutOfStage(parent, distanceActivation) || stageCompleted)
			return;
		
		if(shootTimes != 10)
		{
			if(shootTimes == 0)
				onShootInterval = changeInterval(onShootInterval, onEnemyShoot, 500);
			
			if((shootTimes % 2) == 0)
			{
				var angleRadians = Math.atan2(player.getSprite().y - container.y, player.getSprite().x - container.x);
				var degrees = toDegrees(angleRadians) - 180;
				
				var degreesToShootLeft = (degrees - 40);
				var degreesToShootRight = (degrees + 40);
				
				createBullet(container.x + container.getBounds().width/2, 
					container.y + container.getBounds().height/2, 
					null, 
					null, 
					FLAMETHROWER_BULLET,
					toRadians(degreesToShootLeft));
				
				createBullet(container.x + container.getBounds().width/2, 
					container.y + container.getBounds().height/2, 
					null, 
					null, 
					FLAMETHROWER_BULLET,
					toRadians(degreesToShootRight));
			}
			else
			{
				var attackTargetX = player.getSprite().x + player.getSprite().getBounds().width/2;
				var attackTargetY = player.getSprite().y + player.getSprite().getBounds().height/2;
				
				createBullet(container.x + container.getBounds().width/2, 
					container.y + container.getBounds().height/2, 
					attackTargetX, 
					attackTargetY, 
					FLAMETHROWER_BULLET,
					null);
			}
				
			shootTimes++;
		}
		else
		{
			shootTimes = 0;
			onShootInterval = changeInterval(onShootInterval, onEnemyShoot, 3000);
		}
		
	}
	
	this.removeEnemyBehavior = function()
	{
		createjs.Ticker.removeEventListener("tick", onEnemyInteract);
		clearInterval(onShootInterval);
	}
	
	this.hurtEnemy = hurtEnemy;
	this.removeEnemy = removeEnemy;
	
	this.setDeath = function()
	{
		playSoundEffect(EXPLOSION_SOUND);
		addGroupParticles(this.getSprite().x+(this.getSprite().getBounds().width/2), this.getSprite().y+(this.getSprite().getBounds().height/2), 4, "#ff6600", 3, 0.1, 3, 5);
		addGroupParticles(this.getSprite().x+(this.getSprite().getBounds().width/2), this.getSprite().y+(this.getSprite().getBounds().height/2), 8, "#ff6600", 3, 0.025, 3, 0);
		shakeCamera();
		this.removeEnemy();
	};
}