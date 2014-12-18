function Player(x, y)
{
	var ANIM_SPEED = 0.1;
	
	this.xSpeed = 0;
	this.ySpeed = 0;
	
	this.IDLE = 0;
	this.UP = 1;
	this.DOWN = 2;
	this.LEFT = 3;
	this.RIGHT = 4;
	this.FIRE = 5;

	var dead = false;
	
	var container = new createjs.Container();
	
	var firess = new createjs.SpriteSheet({
		"images": ["textures/player/fire.png"],
		"animations": {"normal": [0,1]},
		"frames": {"regX": 0, "regY": 0, "height": 22, "width": 9, "count": 2}
	});
	
	var plss = new createjs.SpriteSheet({
		"images": ["textures/player/player.png"],
		"animations": 
		{
			"idle": [0,3], 
			"right": [4,7], 
			"left": [8,11], 
			"up": [12,15], 
			"down": [16,19], 
			"hurt": [20,23,"idle"],
			"attack": [24,27,"idle"],
			"telep": [28,31,"idle"],
			"awwyeah": [32,39,"idle"],
			"fRight": [4,7,"idle"], 
			"fLeft": [8,11,"idle"], 
			"fUp": [12,15,"idle"], 
			"fDown": [16,19,"idle"]
		},
		"frames": 
		{
			"regX": 0, 
			"regY": 0, 
			"height": 30, 
			"width": 29, 
			"count": 40
		}
	});
	
	plss.getAnimation("idle").speed = ANIM_SPEED;
	plss.getAnimation("right").speed = ANIM_SPEED;
	plss.getAnimation("left").speed = ANIM_SPEED;
	plss.getAnimation("up").speed = ANIM_SPEED;
	plss.getAnimation("down").speed = ANIM_SPEED;
	plss.getAnimation("telep").speed = ANIM_SPEED*2;
	plss.getAnimation("awwyeah").speed = ANIM_SPEED*2;
	plss.getAnimation("fRight").speed = ANIM_SPEED*2;
	plss.getAnimation("fLeft").speed = ANIM_SPEED*2;
	plss.getAnimation("fUp").speed = ANIM_SPEED*2;
	plss.getAnimation("fDown").speed = ANIM_SPEED*2;
	
	var fireUp = new createjs.Sprite(firess, "normal");
	var fireDown = new createjs.Sprite(firess, "normal");
	var fireLeft = new createjs.Sprite(firess, "normal");
	var fireRight = new createjs.Sprite(firess, "normal");
	
	container.addChild(fireUp);
	container.addChild(fireDown);
	container.addChild(fireLeft);
	container.addChild(fireRight);
	
	var sprite = new createjs.Sprite(plss, "idle");
	container.addChild(sprite);
	container.setBounds(0, 0, sprite.getBounds().width, sprite.getBounds().height);
	container.x = Math.round(x);
	container.y = Math.round(y);
	
	adjustFire();	
	
	this.onParticles = new OnParticles(["#ff5a00", "#ff9c00", "#ffcc00", "#ffea00"], 1, 100, 0.025, 5, 3, container, container.getBounds().height, container.getBounds().width, 0.07);

	this.shouldFireParticles = function(){
		if(moveUp || moveDown || moveLeft || moveRight)
		{
			if(this.onParticles.getId() == -1)
				this.onParticles.addParticlesEvent();
		}
		else
			this.onParticles.removeParticlesEvent();
	};
	
	var onFlowParticles = new OnParticles(["#fff9a6", "#fff146", "#ffdc17"], 1, 25, 0.025, 5, 3, container, container.getBounds().height, container.getBounds().width, 0.25);
	var onFlowInterval = -1;
	
	this.onFlow = function()
	{
		if(onFlowInterval != -1)
		{
			onFlowParticles.removeParticlesEvent();
			clearInterval(onFlowInterval);
		}
		
		onFlowParticles.addParticlesEvent();
		onFlowInterval = setInterval(function(){
			
		onFlowParticles.removeParticlesEvent();
		clearInterval(onFlowInterval);
			
		}, 500);
	};
	
	this.changePos = function(direction)
	{
		if(!dead)
		{
			switch(direction)
			{
				case this.UP : 
					if(disallowedAnimations("up"))
						sprite.gotoAndPlay("up");
					fireUp.visible = true;
					break;
				case this.DOWN : 
					if(disallowedAnimations("down"))
						sprite.gotoAndPlay("down");
					fireDown.visible = true;
					break;
				case this.LEFT : 
					if(disallowedAnimations("left"))
						sprite.gotoAndPlay("left");
					fireLeft.visible = true;
					break;
				case this.RIGHT : 
					if(disallowedAnimations("right"))
						sprite.gotoAndPlay("right");
					fireRight.visible = true;
					break;
				case this.FIRE : 
					if(disallowedAnimations("attack"))
						sprite.gotoAndPlay("attack");
					break;
				case this.IDLE : 
					if(disallowedAnimations("idle"))
						sprite.gotoAndPlay("idle");
					break;
			}
		}
	};
	
	this.setFlow = function(direction)
	{
		if(!dead)
		{
			switch(direction)
			{
				case this.UP : 
					sprite.gotoAndPlay("fUp");
					break;
				case this.DOWN : 
					sprite.gotoAndPlay("fDown");
					break;
				case this.LEFT : 
					sprite.gotoAndPlay("fLeft");
					break;
				case this.RIGHT : 
					sprite.gotoAndPlay("fRight");
					break;
			}
		}
	};

	this.setHurt = function(){sprite.gotoAndPlay("hurt");};
	this.setTelep = function(){sprite.gotoAndPlay("telep");};
	
	function disallowedAnimations(animDirectionLabel)
	{
		if(
		sprite.currentAnimation != animDirectionLabel && 
		sprite.currentAnimation != "hurt" && 
		sprite.currentAnimation != "attack" && 
		sprite.currentAnimation != "telep" && 
		sprite.currentAnimation != "awwyeah" &&
		sprite.currentAnimation != "fRight" &&
		sprite.currentAnimation != "fLeft" &&
		sprite.currentAnimation != "fUp" &&
		sprite.currentAnimation != "fDown"
		)
			return true;
		else
			return false;
	}
	
	function adjustFire()
	{
		fireUp.rotation = 360;
		fireDown.rotation = 180;
		fireLeft.rotation = 270;
		fireRight.rotation = 90;
		
		fireUp.regX = fireUp.getBounds().width/2;
		fireDown.regX = fireDown.getBounds().width/2;
		fireLeft.regX = fireLeft.getBounds().width/2;
		fireRight.regX = fireRight.getBounds().width/2;

		fireUp.x = sprite.getBounds().width/2;
		fireDown.x = sprite.getBounds().width/2;
		fireLeft.x = sprite.getBounds().width/2;
		fireRight.x = sprite.getBounds().width/2;
		
		fireUp.y = sprite.getBounds().height/2;
		fireDown.y = sprite.getBounds().height/2;
		fireLeft.y = sprite.getBounds().height/2;
		fireRight.y = sprite.getBounds().height/2;
		
		fireUp.visible = false;
		fireDown.visible = false;
		fireLeft.visible = false;
		fireRight.visible = false;
	}
	
	this.getSprite = function() { return container; };
	
	this.vulnerability = false;
	
	this.animateHurt = function()
	{
		if(!dead && !this.vulnerability)
			sprite.gotoAndPlay("hurt");
	};
	
	this.setFireVisibility = function(fireDir, bool)
	{
		if(!dead)
		{
			switch(fireDir)
			{
			case "up" : fireUp.visible = bool; break;
			case "down" : fireDown.visible = bool; break;
			case "left" : fireLeft.visible = bool; break;
			case "right" : fireRight.visible = bool; break;
			}
		}
	};
	
	this.hideFire = function()
	{
		fireUp.visible = false; 
		fireDown.visible = false;
		fireLeft.visible = false;
		fireRight.visible = false;
	};
	
	this.setDeath = function()
	{
		if(dead)
			return;
		
		moveUp = false;
		moveDown = false;
		moveLeft = false;
		moveRight = false;
		
		this.hideFire();
		
		dead = true;
		
		var deathStages = 0;
		var shakeTimes = 0;
		
		this.xSpeed /= 2;
		this.ySpeed /= 2;
		
		createjs.Ticker.addEventListener("tick", onDeathAnimate);
		
		function onDeathAnimate()
		{
			switch(deathStages)
			{
			case 0 : 
				sprite.gotoAndStop("idle");
				
				if(shakeTimes <= 10)
				{
					if((shakeTimes % 2) == 0)
						sprite.x += 2;
					else
						sprite.x -= 2;
					
					shakeTimes++;
				}
				else
					deathStages++;
				break;
			case 1 : 
				playSoundEffect(EXPLOSION_SOUND);
				addGroupParticles(container.x+(container.getBounds().width/2), container.y+(container.getBounds().height/2), 4, "#ff6600", 3, 0.1, 3, 3);
				addGroupParticles(container.x+(container.getBounds().width/2), container.y+(container.getBounds().height/2), 8, "#ff6600", 3, 0.025, 3, 0);
				sprite.alpha = 0.5;
				deathStages++;
				break;
			case 2 : 
				addDeathAnnouncement();
				createjs.Ticker.removeEventListener("tick", onDeathAnimate);
				break;
			}
		}
	};
	
	this.isDead = function()
	{
		return dead;
	};
	
	this.startShrinking = function()
	{
		if(!stageCompleted)
			return;
		
		var incrRotation = 1;
		
		createjs.Ticker.addEventListener("tick", onShrinkPlayer);
		
		sprite.regX = sprite.getBounds().width/2;
		sprite.regY = sprite.getBounds().height/2;
		
		container.x = stage.canvas.width/2;
		container.y = stage.canvas.height/2;
		
		sprite.gotoAndPlay("awwyeah");
		
		function onShrinkPlayer()
		{
			sprite.alpha -= 0.0025;
			
			sprite.rotation -= incrRotation;
			incrRotation += 0.05;
			
			if(sprite.alpha <= 0)
				createjs.Ticker.removeEventListener("tick", onShrinkPlayer);
		}
	};
}

function displayPlayerHurtness()
{
	var rect = new createjs.Shape();
	rect.graphics.beginFill("#f00").drawRect(0, 0, stage.canvas.width, stage.canvas.height).endFill();
	rect.alpha = 0.15;
	stage.addChild(rect);

	createjs.Ticker.addEventListener("tick", onDisplay);

	function onDisplay()
	{
		if(rect.alpha > 0)
			rect.alpha -= 0.05;
		else
		{
			stage.removeChild(rect);
			createjs.Ticker.removeEventListener("tick", onDisplay);
		}
	}
}