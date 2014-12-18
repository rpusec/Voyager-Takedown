function Hud()
{
	var MAX_HEALTH = 22;
	var currentHealth = MAX_HEALTH;
	
	var hpArr = [];
	var hud = new createjs.Container();
	
	var keyHeightOffset = stage.canvas.height - 40;
	var redKey = new KeyHud(RED_KEY, 10, keyHeightOffset);
	var blueKey = new KeyHud(BLUE_KEY, 40, keyHeightOffset);
	var yellowKey = new KeyHud(YELLOW_KEY, 70, keyHeightOffset);
	
	hud.addChild(redKey.getSprite(), blueKey.getSprite(), yellowKey.getSprite());
	
	var healthBar = new createjs.Container();
	
	for(var i = 0; i < MAX_HEALTH; i++)
	{
		var newHP = new HealthPoint(i*13, 0); //13 because we want to separate each HP item
		hpArr.push(newHP);
		healthBar.addChild(newHP.getSprite());
	}
	
	//changing the coordinates of healthBar
	healthBar.x = stage.canvas.width - healthBar.getBounds().width;
	
	hud.addChild(healthBar);
	
	stage.addChild(hud);
	
	this.setKeyAsActive = function(keyId, shouldActivate)
	{
		var activeLabel = "notActive";
		
		if(shouldActivate)
			activeLabel = "active";
		
		switch(keyId)
		{
		case RED_KEY : 
			redKey.getSprite().gotoAndPlay(activeLabel);
			break;
		case BLUE_KEY : 
			blueKey.getSprite().gotoAndPlay(activeLabel);
			break;
		case YELLOW_KEY : 
			yellowKey.getSprite().gotoAndPlay(activeLabel);
			break;
		}
	};
	
	var playerDamaged = false;
	var healthInterval = setInterval(onAutoIncrementHealth, 250);
	
	this.hurtPlayer = function(amount)
	{
		displayPlayerHurtness();

		if(currentHealth == 0 || player.isDead() || player.vulnerability || stageCompleted)
			return;
		
		//if amount is bigger than current health, we need to equalize
		//amount and currhealth to avoid indexoutofbounds exception
		if((currentHealth - amount) < 0)
			amount = currentHealth;
		
		for(var i = 0; i < amount; i++)
			hpArr[currentHealth-i-1].removePoint();
		
		currentHealth -= amount;
		
		if(currentHealth == 0)
			player.setDeath();
		
		player.setHurt();
		
		clearInterval(healthInterval);
		healthInterval = setInterval(onAutoIncrementHealth, 3000);
		playerDamaged = true;
	};
	
	function onAutoIncrementHealth()
	{
		if(miniMenu != null)
			return;
		
		if(player == null)
			return;
		
		if(!player.isDead())
		{
			if(currentHealth < MAX_HEALTH)
			{
				if(playerDamaged)
				{
					clearInterval(healthInterval);
					healthInterval = setInterval(onAutoIncrementHealth, 250);
					playerDamaged = false;
				}
				
				currentHealth++;
				hpArr[currentHealth-1].addPoint();
			}
		}
	}
	
	this.resetHud = function()
	{
		redKey.getSprite().gotoAndPlay("notActive");
		blueKey.getSprite().gotoAndPlay("notActive");
		yellowKey.getSprite().gotoAndPlay("notActive");
	};
	
	this.setHudAsFirst = function()
	{
		stage.setChildIndex(hud, stage.getNumChildren()-1);
	};
	
	this.removeHud = function()
	{
		stage.removeChild(hud);
	};
}