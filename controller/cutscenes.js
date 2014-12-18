function playEndingScene()
{
	removeEverythingFromStage();

	var tempPlayer = new Player(stage.canvas.width/2 + 100, stage.canvas.height/2);
	var tpSprite = tempPlayer.getSprite();
	var tpSpeed = 10;
	var sceneDurationHelper = 0; //used for certain purposes
	var sceneTuring = 0;
	var currScene = 0;
	var explMomentum = 0;
	var currExplMomentum = Math.random()*10;
	var sceneBegun = false;

	var destroyedBossTexture = new createjs.Bitmap("textures/misc/destroyed_boss.png");
	destroyedBossTexture.regX = destroyedBossTexture.getBounds().width/2;
	destroyedBossTexture.regY = destroyedBossTexture.getBounds().height/2;
	destroyedBossTexture.x = 130;
	destroyedBossTexture.y = stage.canvas.height/2;

	createjs.Ticker.addEventListener('tick', onAnimateEnding);

	function onAnimateEnding()
	{
		if(miniMenu != null)
			return;

		addRandExplosion();

		switch(currScene)
		{
		case 0 : 
			changeScene('es1');

			if(stage.contains(destroyedBossTexture))
				destroyedBossTexture.rotation += 0.25;
			else
				stage.addChild(destroyedBossTexture);

			if(sceneDurationHelper < 70)
				sceneDurationHelper++;
			else
			{
				if(tpSprite.x < stage.canvas.width)
				{
					tpSprite.x += tpSpeed;
					tempPlayer.changePos(tempPlayer.RIGHT);
					moveRight = true;
				}
				else
				{
					nextScene();
					tpSprite.x = 0;
					tpSprite.y += 80;
				}
			}
			break;
		case 1 : 
			changeScene('es2');

			switch(sceneTuring)
			{
			case 0 : 
				if(tpSprite.x < 260)
					moveTTP(tempPlayer.RIGHT);
				else
				{
					sceneTuring++;
					tempPlayer.hideFire();
				}
				break;
			case 1 : 
				if(tpSprite.y > tpSprite.getBounds().width * -1)
					moveTTP(tempPlayer.UP);
				else
				{
					nextScene();
					tpSprite.x = stage.canvas.width/2 - 20;
					tpSprite.y = stage.canvas.height;
				}
				break;
			}
			break;
		case 2 : 
			changeScene('es3');

			switch(sceneTuring)
			{
			case 0 : 
				if(tpSprite.y > 160)
					moveTTP(tempPlayer.UP);
				else
				{
					sceneTuring++;
					tempPlayer.hideFire();
				}
				break;
			case 1 : 
				if(tpSprite.x < stage.canvas.width - 120)
					moveTTP(tempPlayer.RIGHT);
				else
				{
					sceneTuring++;
					tempPlayer.hideFire();
				}
				break;
			case 2 : 
				if(tpSprite.y > tpSprite.getBounds().height * -1)
					moveTTP(tempPlayer.UP);
				else
				{
					tpSprite.x = stage.canvas.width/2;
					tpSprite.y = stage.canvas.height + tpSprite.getBounds().height;
					nextScene();
				}
				break;
			}
			break;
		case 3 : 
			changeScene('es4');

			tempPlayer.changePos(tempPlayer.UP);

			if(tpSprite.y > tpSprite.getBounds().height * -1)
				tpSprite.y -= tpSpeed;
			else
			{
				tpSprite.y = stage.canvas.height + tpSprite.getBounds().height;
				nextScene();
			}
			break;
		case 4 : 
			changeScene('es5');

			tempPlayer.changePos(tempPlayer.UP);

			if(tpSprite.y > tpSprite.getBounds().height * -1)
				tpSprite.y -= tpSpeed;
			else
			{
				stage.removeChild(tpSprite);
				createjs.Ticker.removeEventListener('tick', onAnimateEnding);
				addGroupParticles(stage.canvas.width/2, stage.canvas.height/2, 4, "#ff6600", 10, 0.1, 3, 6);
				playSoundEffect(EXPLOSION_SOUND);
				showEndingText();
			}
			break;
		}
	}

	function changeScene(sceneId)
	{
		if(!sceneBegun)
		{
			removeEverythingFromStage(false);
			startLevel(sceneId);
			stage.addChild(tempPlayer.getSprite());
			sceneDurationHelper = 0;
			sceneTuring = 0;
			sceneBegun = true;
		}
	}

	function moveTTP(direction)
	{
		moveUp = true;
		tempPlayer.changePos(direction);

		switch(direction)
		{
			case tempPlayer.UP : tpSprite.y -= tpSpeed; break;
			case tempPlayer.DOWN : tpSprite.y += tpSpeed; break;
			case tempPlayer.LEFT : tpSprite.x -= tpSpeed; break;
			case tempPlayer.RIGHT : tpSprite.x += tpSpeed; break;
		}
	}

	function nextScene()
	{
		currScene++; //switches to the following case
		sceneBegun = false;
		tempPlayer.hideFire();
	}

	function addRandExplosion()
	{
		if(wallContainer == null)
			return;

		if(explMomentum == Math.round(currExplMomentum))
		{
			if(wallContainer.children.length == 0)
				return;

			var elemToFocus = wallContainer.children[Math.round(Math.random()*(wallContainer.children.length-1))];
			addGroupParticles(elemToFocus.x, elemToFocus.y, 4, "#ff6600", 3, 0.1, 3, 3);
			currExplMomentum = Math.random()*10;
			explMomentum = 0;
			playSoundEffect(EXPLOSION_SOUND);
			shakeCamera();
			wallContainer.removeChild(elemToFocus);
		}
		else
			explMomentum++;
	}

	function showEndingText()
	{
		var endingText = new createjs.Text("Congratulations, you have made it through all eight stages, plus the final boss stage! Very good work!", "18px Arial", "#fff");
		endingText.shadow = new createjs.Shadow("#47b8ff", 0, 0, 5);
		endingText.textAlign = "center";
		endingText.textBaseline = "middle";
		endingText.lineWidth = 300;
		endingText.x = stage.canvas.width/2;
		endingText.y = stage.canvas.height/2;
		endingText.alpha = 0;
		stage.addChild(endingText);
		
		createjs.Ticker.addEventListener("tick", onShowEndingText);

		function onShowEndingText()
		{
			if(miniMenu != null)
				return;

			if(endingText.alpha < 1)
				endingText.alpha += 0.1;
			else
				createjs.Ticker.removeEventListener("tick", onShowEndingText);
		}
	}
}