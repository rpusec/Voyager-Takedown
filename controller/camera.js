function positionCameraToPlayer()
{
	if(wallContainer == null || player == null)
		return;
	
	var playerXPos = Math.floor(player.getSprite().x-(stage.canvas.width/2)+(player.getSprite().getBounds().width/2));
	var playerYPos = Math.floor(player.getSprite().y-(stage.canvas.height/2)+(player.getSprite().getBounds().height/2));
	
	player.getSprite().x = Math.floor(player.getSprite().x-playerXPos);
	player.getSprite().y = Math.floor(player.getSprite().y-playerYPos);
	
	adjust(playerXPos, playerYPos, false);
}

function focusCameraTo(itemToFocus, shouldCenter)
{	
	var focusableX = Math.floor(player.getSprite().x - itemToFocus.getSprite().x - (shouldCenter ? itemToFocus.getSprite().getBounds().width/2 : 0));
	var focusableY = Math.floor(player.getSprite().y - itemToFocus.getSprite().y - (shouldCenter ? itemToFocus.getSprite().getBounds().height/2 : 0));
	
	adjust(focusableX, focusableY, true);
}

function adjust(newX, newY, shouldIncr)
{
	var adjustableEntities = environemntArr.slice(0);
	adjustableEntities.push(bulletArr);

	adjustableEntities.forEach(function(arrItem){
		arrItem.forEach(function(item){
			if(shouldIncr)
			{
				item.getSprite().x += newX;
				item.getSprite().y += newY;
			}
			else
			{
				item.getSprite().x -= newX;
				item.getSprite().y -= newY;
			}
		});
	});
	
	if(shouldIncr)
	{
		wallContainer.x += newX;
		wallContainer.y += newY;
	}
	else
	{
		wallContainer.x -= newX;
		wallContainer.y -= newY;
	}
}

function shakeCamera()
{	
	if(wallContainer == null)
		return;

	var shakeUp = false;
	var shakeCount = 0;

	createjs.Ticker.addEventListener("tick", onShakeCamera);
	
	function onShakeCamera()
	{
		if(shakeCount != 10)
		{
			if(shakeUp)
			{
				moveEnvir(0, 5);
				if(player != null)
					player.getSprite().y += 5;
				if(wallContainer != null)
					wallContainer.y += 10;
			}
			else
			{
				moveEnvir(0, -5);
				if(player != null)
					player.getSprite().y -= 5;
				if(wallContainer != null)
					wallContainer.y -= 10;
			}
			
			shakeCount++;
			shakeUp = !shakeUp;
		}
		else
			createjs.Ticker.removeEventListener("tick", onShakeCamera);
	}
}

function repositionCamera(target, shouldCenter, time)
{
	var targetWidth = 0;
	var targetHeight = 0;
	
	if(shouldCenter)
	{
		targetWidth = target.getSprite().getBounds().width;
		targetHeight = target.getSprite().getBounds().height;	
	}
	
	shouldMovePlayerTexture = true;
	
	var targetDistanceX = (target.getSprite().x + targetWidth) - stage.canvas.width/2;
	var targetDistanceY = (target.getSprite().y + targetHeight) - stage.canvas.height/2;
	
	var repInterval = setInterval(onRepositionCamera, 25);
	var sbInterval = setInterval(onSetBack, time);
	
	function onRepositionCamera()
	{
		if(Math.abs(targetDistanceX) > 0 || Math.abs(targetDistanceY) > 0)
		{
			targetDistanceX = targetDistanceX/2;
			targetDistanceY = targetDistanceY/2;
			adjust(targetDistanceX, targetDistanceY, false);
			player.getSprite().x -= targetDistanceX;
			player.getSprite().y -= targetDistanceY;
		}
		else
			clearInterval(repInterval);
	}
	
	function onSetBack()
	{
		clearInterval(repInterval);
		clearInterval(sbInterval);
		positionCameraToPlayer();
		shouldMovePlayerTexture = false;
	}
}