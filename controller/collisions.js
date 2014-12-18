function playerCollision()
{
	if(noclip)
		return;

	[redKeyWalls, blueKeyWalls, yellowKeyWalls].forEach(function(arrItem){
		arrItem.forEach(function(item){
			if(checkIntersection(player, item))
			{
				if(Math.abs(player.xSpeed) > MAX_SPEED || Math.abs(player.ySpeed) > MAX_SPEED)
					hud.hurtPlayer(1);
					
				bouncePlayer();
			}
		});
	});
	
	collisWallArr.forEach(function(wall){
		if(checkIntersection(player, wall, true))
		{
			if(Math.abs(player.xSpeed) > MAX_SPEED || Math.abs(player.ySpeed) > MAX_SPEED)
					hud.hurtPlayer(1);
				
			bouncePlayer();
		}
	});
}

function bulletCollision()
{
	for(var b = 0; b < bulletArr.length; b++)
		for(var w = 0; w < collisWallArr.length; w++)
			if(checkIntersection(bulletArr[b], collisWallArr[w], true))
			{
				playSoundEffect(GUN_RICOCHET_SOUND);
				bulletColFunctionality(bulletArr[b]);
				break;
			}
	
	for(var b = 0; b < bulletArr.length; b++)
		for(var e = 0; e < enemies.length; e++)
			if(checkIntersection(enemies[e], bulletArr[b]) && bulletArr[b].isPlayerBullet())
			{	
				//being tested for the Boss
				if(typeof enemies[e].hurtEnemy === "function")
				{
					enemies[e].hurtEnemy();
					bulletColFunctionality(bulletArr[b]);
					playSoundEffect(TARGETSHOT_SOUND);
				}
				break;
			}
	
	for(var b = 0; b < bulletArr.length; b++)
		if(checkIntersection(player, bulletArr[b]) && !bulletArr[b].isPlayerBullet())
		{
			playSoundEffect(TARGETSHOT_SOUND);
			hurtPlayerAmount(bulletArr[b].getBulletType());
			bulletColFunctionality(bulletArr[b]);
			break;
		}
}

function hurtPlayerAmount(bulletType)
{
	switch(bulletType)
	{
	case TURRET_BULLET : hud.hurtPlayer(1); break;
	case TERMIBLASTER_BULLET : hud.hurtPlayer(2); break;
	case BLACKSPHERE_BULLET : hud.hurtPlayer(3); break;
	case FLAMETHROWER_BULLET : hud.hurtPlayer(5); break;
	}
}

function flowCollision()
{
	if(noclip)
		return;
	
	flowArr.forEach(function(item){
		if(checkIntersection(player, item) && !player.isDead())
			if(item.getActive())
			{
				onFlowActive(item);
				playSoundEffect(ONFLOW_SOUND);
			}
	});
}

function telepCollision()
{
	if(noclip)
		return;

	telepArr.forEach(function(telepItem){
		if(checkIntersection(player, telepItem))
		{
			destArr.forEach(function(destItem){
				if(destItem.getId() == telepItem.getId() && !player.isDead())
				{
					player.getSprite().x = destItem.getSprite().x;
					player.getSprite().y = destItem.getSprite().y;
					player.xSpeed = 0;
					player.ySpeed = 0;
					positionCameraToPlayer();
					player.setTelep();
					updateCollisionableObjects();
					addTeleportParticles(player);
					playSoundEffect(TELEPORT_SOUND);
					return;
				}
			});
		}
	});
}

function keyCardCollision()
{
	if(noclip)
		return;

	keyCards.forEach(function(item){
		if(checkIntersection(player, item) && !player.isDead())
		{
			pickKey(item);
			playSoundEffect(KEY_SOUND);
		}
	});
}

function keyInputCollision()
{
	if(noclip)
		return;

	if(hasRedKey || hasBlueKey || hasYellowKey)
	{
		keyInputs.forEach(function(keyInput){
			if(checkIntersection(player, keyInput) && !player.isDead())
			{
				switch(keyInput.getType()) 
				{
				case RED_KEY : 
					removeKeyWall(RED_KEY, keyInput);
					break;
				case BLUE_KEY : 
					removeKeyWall(BLUE_KEY, keyInput);
					break;
				case YELLOW_KEY : 
					removeKeyWall(YELLOW_KEY, keyInput);
					break;
				}
			}
		});
	}
}

function endLevelCollision()
{
	if(noclip)
		return;

	if(endLevelContainer.length != 0 && !player.isDead())
	{
		if(checkIntersection(player, endLevelContainer[0]) && !stageCompleted)
			endLevelProcess();
	}
}

function checkIntersection(obj1, obj2, shouldLTG)
{
	var obj1X = obj1.getSprite().x + obj1.getSprite().getBounds().x;
	var obj1Y = obj1.getSprite().y + obj1.getSprite().getBounds().y;
	var obj1Width = obj1.getSprite().getBounds().width;
	var obj1Height = obj1.getSprite().getBounds().height;
	
	var obj2X;
	var obj2Y;
	var obj2Width = obj2.getSprite().getBounds().width;
	var obj2Height = obj2.getSprite().getBounds().height;
	
	if(shouldLTG)
	{
		var globalPoint = obj2.getSprite().localToGlobal(0, 0);
		obj2X = globalPoint.x + obj2.getSprite().getBounds().x;
		obj2Y = globalPoint.y + obj2.getSprite().getBounds().y;
	}
	else
	{
		obj2X = obj2.getSprite().x + obj2.getSprite().getBounds().x;
		obj2Y = obj2.getSprite().y + obj2.getSprite().getBounds().y;
	}
	
	if(obj1X >= obj2X + obj2Width || 
	obj1X + obj1Width <= obj2X || 
	obj1Y >= obj2Y + obj2Height || 
	obj1Y + obj1Height <= obj2Y)
		return false;
	else
		return true;
}