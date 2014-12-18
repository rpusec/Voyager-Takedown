function Particle(x, y, color, size, decrSpeed, range, expandFor)
{
	var particle = new createjs.Shape();
	particle.graphics.beginFill(color).drawCircle(0, 0, size);
	particle.x = x;
	particle.y = y;
	
	var moveX = (Math.random()*range) - range/2;
	var moveY = (Math.random()*range) - range/2;
	
	createjs.Ticker.addEventListener("tick", onDisappear);
	
	function onDisappear()
	{
		if(miniMenu != null)
			return;
		
		particle.alpha -= decrSpeed;
		particle.x += moveX;
		particle.y += moveY;
		
		if(player != null)
		{
			particle.x -= player.xSpeed;
			particle.y -= player.ySpeed;
		}
		
		particle.scaleX += expandFor;
		particle.scaleY += expandFor;
		
		if(particle.alpha <= 0)
		{
			createjs.Ticker.removeEventListener("tick", onDisappear);
			stage.removeChild(particle);
		}
	}
	
	this.getShape = function(){ return particle; };
}

function addGroupParticles(x, y, amount, color, size, decrSpeed, range, expandFor)
{
	if(miniMenu != null)
		return;
	
	for(var i = 0; i < amount; i++)
	{
		var newParticle = new Particle(x, y, color, size, decrSpeed, range, expandFor);
		stage.addChild(newParticle.getShape());
		player != null ? stage.setChildIndex(newParticle.getShape(), stage.getChildIndex(player.getSprite())) : '';
	}
}

function OnParticles(colorsArr, amount, speed, decrSpeed, size, range, entity, entityW, entityH, expandFor)
{
	var particleColors = colorsArr;
	var particleCounter = 0;
	
	var intervalId = -1;
	
	var onParticles = function(){
		
		if(miniMenu != null)
			return;
		
		addGroupParticles(entity.x + (entityH/2), entity.y + (entityW/2), amount, particleColors[particleCounter], size, decrSpeed, range, expandFor);
		
		if(particleCounter == particleColors.length-1)
			particleCounter = 0;
		else
			particleCounter++;
		
	};
	
	this.addParticlesEvent = function(){ 
		intervalId = setInterval(onParticles, speed); 
	};
	
	this.removeParticlesEvent = function(){ 
		clearInterval(intervalId); 
		intervalId = -1; 
	};
	
	this.getId = function(){
		return intervalId;
	};
}

function addKeyParicles(key)
{
	switch(key.getType())
	{
	case RED_KEY : 
		addGroupParticles(key.getSprite().x + (key.getSprite().getBounds().width/2), 
				key.getSprite().y + (key.getSprite().getBounds().height/2), 1, "#ff282e", 4, 0.1, 5, 2);
		addGroupParticles(key.getSprite().x + (key.getSprite().getBounds().width/2), 
				key.getSprite().y + (key.getSprite().getBounds().height/2), 4, "#ff282e", 4, 0.025, 7, 0.050);
		break;
	case BLUE_KEY : 
		addGroupParticles(key.getSprite().x + (key.getSprite().getBounds().width/2), 
				key.getSprite().y + (key.getSprite().getBounds().height/2), 1, "#4297ff", 4, 0.1, 5, 2);
		addGroupParticles(key.getSprite().x + (key.getSprite().getBounds().width/2), 
				key.getSprite().y + (key.getSprite().getBounds().height/2), 4, "#4297ff", 4, 0.025, 7, 0.050);
		break;
	case YELLOW_KEY : 
		addGroupParticles(key.getSprite().x + (key.getSprite().getBounds().width/2), 
				key.getSprite().y + (key.getSprite().getBounds().height/2), 1, "#ffd900", 4, 0.1, 5, 2);
		addGroupParticles(key.getSprite().x + (key.getSprite().getBounds().width/2), 
				key.getSprite().y + (key.getSprite().getBounds().height/2), 4, "#ffd900", 4, 0.025, 7, 0.050);
		break;
	}
}

function addTeleportParticles(entity)
{
	addGroupParticles(entity.x+(entity.getBounds().width/2), entity.y+(entity.getBounds().height/2), 4, "#66FF99", 3, 0.1, 10, 3);
	addGroupParticles(entity.x+(entity.getBounds().width/2), entity.y+(entity.getBounds().height/2), 8, "#66FF99", 3, 0.025, 15, 0);
}