function rotateTargetTowards(rotateTarget, rotateTargetX, rotateTargetY, towardsTargetX, towardsTargetY)
{
	var radians = Math.atan2(rotateTargetY - towardsTargetY, rotateTargetX - towardsTargetX);
	var degrees = toDegrees(radians);
	rotateTarget.rotation = degrees;
}

function tiltRotate(entity, speed)
{
	entity.rotation = 90;
	createjs.Ticker.addEventListener("tick", onRotate);
	
	function onRotate()
	{
		if(entity.rotation > 0)
			entity.rotation -= speed;
		else
			createjs.Ticker.removeEventListener("tick", onRotate);
	}
}

function entityCollision(entityTarget, targetArray, shouldLTG)
{	
	for(var i = 0; i < targetArray.length; i++)
		if(checkIntersection(entityTarget, targetArray[i], shouldLTG))
			return true;
	
	return false;
}

function followEntity(targetFollower, targetEntity, speed)
{
	var angleRadians = Math.atan2(
		(targetEntity.getSprite().y + targetEntity.getSprite().getBounds().height/2) - (targetFollower.getSprite().y + targetFollower.getSprite().getBounds().height/2), 
		(targetEntity.getSprite().x + targetEntity.getSprite().getBounds().width/2) - (targetFollower.getSprite().x + targetFollower.getSprite().getBounds().width/2)
		);
				
	var cos = Math.cos(angleRadians);
	var sin = Math.sin(angleRadians);
	
	targetFollower.getSprite().x += Math.round(cos * speed);
	targetFollower.getSprite().y += Math.round(sin * speed);
}

function toDegrees(radians)
{
	return radians * 180 / Math.PI + 180;
}

function toRadians(degrees)
{
	return degrees * Math.PI / 180;
}

function changeInterval(intervalID, functionReference, speed)
{
	clearInterval(intervalID);
	var newIntervalId = setInterval(functionReference, speed);
	return newIntervalId;
}