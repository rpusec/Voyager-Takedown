function Turret(x, y)
{
	var bodyImg = new createjs.Bitmap("textures/enemies/turret/body.png");
	
	var gunImg = new createjs.Bitmap("textures/enemies/turret/gun.png");
	gunImg.regX = gunImg.getBounds().height/2;
	gunImg.regY = gunImg.getBounds().height/2;
	gunImg.x = bodyImg.getBounds().width/2;
	gunImg.y = bodyImg.getBounds().height;
	
	var container = new createjs.Container();
	container.x = x;
	container.y = y;
	
	container.addChild(bodyImg, gunImg);
	container.setBounds(0, 0, bodyImg.getBounds().width, bodyImg.getBounds().height + gunImg.getBounds().width);
	
	this.getSprite = function(){return container;};
	
	var healthBar = new EnemyHealthBar(this.getSprite().getBounds().width, 10, 2, 5);
	container.addChild(healthBar.getHealthBar());
	this.getHealthBar = function(){ return healthBar; };
	
	createjs.Ticker.addEventListener("tick", onEnemyInteract);
	var onShootInterval = setInterval(onTurretShoot, 2000);
	var activated = false;
	var parent = this;
	
	function onEnemyInteract()
	{
		if(miniMenu != null)
			return;
		
		if(container.y < player.getSprite().y)
		{
			if(!activated)
			{
				onShootInterval = changeInterval(onShootInterval, onTurretShoot, 250);
				activated = true;
			}
			
			var playerY = player.getSprite().y + player.getSprite().getBounds().height/2;
			var playerX = player.getSprite().x + player.getSprite().getBounds().width/2;	
			rotateTargetTowards(gunImg, container.x + gunImg.x, container.y + gunImg.y, playerX, playerY);
		}
		else
		{
			if(activated)
			{
				clearInterval(onShootInterval);
				activated = false;
			}
		}
	}
	
	function onTurretShoot()
	{
		if(miniMenu != null)
			return;
		
		if(!isObjectOutOfStage(parent, 50) && !player.isDead())
		{
			var containerBounds = container.getBounds();
			var playerBounds = player.getSprite().getBounds();
			createBullet(container.x + containerBounds.width/2, 
				container.y + containerBounds.height/2, 
				player.getSprite().x + playerBounds.width/2, 
				player.getSprite().y + playerBounds.height/2, 
				TURRET_BULLET,
				null);
			
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
		this.removeEnemy();
	};
}