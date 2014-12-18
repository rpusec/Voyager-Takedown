function Teleporto(x, y)
{
	var container = new createjs.Container();
	
	var ss = new createjs.SpriteSheet({
		"images": ["textures/enemies/teleporto/teleporto.png"],
		"frames": {
			"regX": 0,
			"regY": 0,
			"width": 53,
			"height": 49,
			"count": 2
		}
	});
	
	var sprite = new createjs.Sprite(ss, 0);
	sprite.regX = sprite.getBounds().width/2;
	sprite.regY = sprite.getBounds().height/2;
	sprite.x = sprite.getBounds().width/2;
	sprite.y = sprite.getBounds().height/2;
	container.addChild(sprite);
	container.setBounds(0, 0, sprite.getBounds().width, sprite.getBounds().height);
	container.x = x;
	container.y = y;
	
	this.getSprite = function(){return container;};
	
	var healthBar = new EnemyHealthBar(this.getSprite().getBounds().width, 30, 2, 5);
	container.addChild(healthBar.getHealthBar());
	this.getHealthBar = function(){ return healthBar; };
	
	createjs.Ticker.addEventListener("tick", onEnemyTeleport);
	
	var enemyInteractInterval = -1;
	var interactStage = 0;
	var shootTimes = 0;
	var active = false;
	var parent = this;
	
	function onEnemyTeleport()
	{
		if(miniMenu != null)
			return;
		
		if(!isObjectOutOfStage(parent, 0) && !active)
		{
			active = true;
			enemyInteractInterval = setInterval(onEnemyIntreact, 1000);
		}
		
		if(isObjectOutOfStage(parent, 0) && active)
			teleport();
		
		if(checkIntersection(parent, player))
		{
			teleport();
			hud.hurtPlayer(3);
		}
	}
	
	function onEnemyIntreact()
	{
		if(miniMenu != null)
			return;
		
		if(!active || player.isDead() || stageCompleted)
			return;
			
		switch(interactStage)
		{
		case 0 : 
			if(shootTimes != 3)
			{
				if(shootTimes == 0)
				{
					sprite.gotoAndStop(1);
					enemyInteractInterval = changeInterval(enemyInteractInterval, onEnemyIntreact, 150);
				}
				
				createBullet(container.x + container.getBounds().width/2, 
					container.y + container.getBounds().height/2, 
					player.getSprite().x + player.getSprite().getBounds().width/2, 
					player.getSprite().y + player.getSprite().getBounds().height/2, 
					TERMIBLASTER_BULLET,
					null);
				
				shootTimes++;
			}
			else
			{
				enemyInteractInterval = changeInterval(enemyInteractInterval, onEnemyIntreact, 1000);
				interactStage++;
				shootTimes = 0;
				sprite.gotoAndStop(0);
			}
			break;
		case 1 : 
			teleport();
			interactStage = 0;
			break;
		}
	}
	
	function teleport()
	{
		if(miniMenu != null)
			return;
		
		tiltRotate(sprite, 5);
		container.x = Math.floor(Math.random() * (stage.canvas.width/2));
		container.y = Math.floor(Math.random() * (stage.canvas.height/2));
		addTeleportParticles(parent);
		playSoundEffect(TELEPORT_SOUND);
	}
	
	this.hurtEnemy = hurtEnemy;
	this.removeEnemy = removeEnemy;
	
	this.setDeath = function()
	{
		playSoundEffect(TELEPORT_SOUND);
		addTeleportParticles(this);
		this.removeEnemy();
	};
	
	this.removeEnemyBehavior = function()
	{
		createjs.Ticker.removeEventListener("tick", onEnemyTeleport);
		clearInterval(enemyInteractInterval);
	};
}