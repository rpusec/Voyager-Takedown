function Star(size)
{
	this.size = size;
	var sizeValue;
	
	if(size == "big")
		sizeValue = 2;
	else
		sizeValue = 1;
	
	var circle = new createjs.Shape();
	circle.graphics.beginFill("#fff").drawCircle(0, 0, sizeValue);
	circle.x = Math.floor(Math.random() * stage.canvas.width);
	circle.y = Math.floor(Math.random() * stage.canvas.height);
	
	this.getSprite = function() { return circle; };
}

function createStars(amount)
{
	var starsToReturn = [];
	
	for(var i = 0; i < amount; i++)
	{
		var size;
		
		if(Math.random() < 0.5)
			size = "big";
		else
			size = "small";
		
		var newStar = new Star(size);
		backgroundArr.push(newStar);
		starsToReturn.push(newStar);
		stage.addChild(newStar.getSprite());
	}
	
	return starsToReturn;
}

function isStarOutOfStage(star)
{
	if(star.getSprite().x < 0)
		star.getSprite().x = stage.canvas.width;
	else if(star.getSprite().x > stage.canvas.width)
		star.getSprite().x = 0;
	
	if(star.getSprite().y < 0)
		star.getSprite().y = stage.canvas.height;
	else if(star.getSprite().y > stage.canvas.height)
		star.getSprite().y = 0;
}