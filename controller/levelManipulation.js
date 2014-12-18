function startLevel(lvlNum)
{
	var currSaveGame;
	
	if(typeof currentLevel === 'number')
	{
		if(saveGameSystem.getGame() != null)
			currSaveGame = saveGameSystem.getGame();
		else
			currSaveGame = 1;

		if(currSaveGame < currentLevel)
			saveGameSystem.saveGame();
	}

	createLevel(lvlNum);
	positionCameraToPlayer();
	
	if(player != null)
		stage.setChildIndex(player.getSprite(), stage.getNumChildren()-1);
	
	if(player != null)
		hud = new Hud();
	
	stage.canvas.addEventListener("mousedown", fireBullet);
	stage.update();
	
	if(typeof lvlNum === 'number')
		startGameUpdating();
	
	if(onCollisWallInterval == -1)
		onCollisWallInterval = setInterval(updateCollisionableObjects, 50);
	
	if(player != null && typeof lvlNum === 'number')
		addStartLevelAnnouncement(lvlNum);
}

function createLevel(levelId)
{
	background = new Background(levelId);
	stage.addChild(background.getSprite());
	
	createStars(20);
	
	var arrToUse = getLevel(levelId);
	
	if(arrToUse != null)
	{	
		var maxWidth = arrToUse.width;
		
		var TEXTURE_SIZE = 25;
		
		var currColumn = 0;
		var currRow = 0;
		
		wallContainer = new createjs.Container();
		
		for(var i = 0; i < arrToUse.level.length; i++)
		{
			if(currColumn != maxWidth)
			{
				var textureId = ("" + arrToUse.level[i]).substring(0,1);
				
				switch(textureId)
				{
				case a : 
					var newFloor = new Wall(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE, levelId);
					wallArr.push(newFloor);
					wallContainer.addChild(newFloor.getSprite());
					break;
				case p : 
					player = new Player(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					stage.addChild(player.getSprite());
					break;
					
				/*
					FLOWS
				*/
				case u : 
					var newFlow = new Flow(Flow.prototype.UP_TYPE, currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					flowArr.push(newFlow);
					stage.addChild(newFlow.getSprite());
					break;
				case o : 
					var newFlow = new Flow(Flow.prototype.DOWN_TYPE, currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					flowArr.push(newFlow);
					stage.addChild(newFlow.getSprite());
					break;
				case k : 
					var newFlow = new Flow(Flow.prototype.LEFT_TYPE, currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					flowArr.push(newFlow);
					stage.addChild(newFlow.getSprite());
					break;
				case l : 
					var newFlow = new Flow(Flow.prototype.RIGHT_TYPE, currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					flowArr.push(newFlow);
					stage.addChild(newFlow.getSprite());
					break;
					
				/*
					TELEPORTERS
				*/
				case t : 
					var newTelep = new Teleporter(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE, parseInt(arrToUse.level[i].substring(1,2)));
					telepArr.push(newTelep);
					stage.addChild(newTelep.getSprite());
					break;
				case d : 
					var newDest = new Destination(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE, parseInt(arrToUse.level[i].substring(1,2)));
					destArr.push(newDest);
					stage.addChild(newDest.getSprite());
					break;
				
				/*
					KEY CARDS
				*/
				case w : 
				case e : 
				case r : 
					addKeyTexture(textureId, KEY_CARD, currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					break;
					
				/*
					KEY INPUTS
				*/
				case s : 
				case q : 
				case f : 
					addKeyTexture(textureId, KEY_INPUT, currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					break;
					
				/*
					KEY WALLS
				*/
				case c : 
				case v : 
				case b : 
					addKeyTexture(textureId, KEY_WALL, currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					break;
				case m : 
					var endLevel = new EndLevel(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					endLevelContainer.push(endLevel);
					stage.addChild(endLevel.getSprite());
					break;
				case "1" : 
					var newTurret = new Turret(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					enemies.push(newTurret);
					stage.addChild(newTurret.getSprite());
					break;
				case "2" : 
					var newTermiBlaster = new TermiBlaster(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					enemies.push(newTermiBlaster);
					stage.addChild(newTermiBlaster.getSprite());
					break;
				case "3" : 
					var newBlackSphere = new Blacksphere(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					enemies.push(newBlackSphere);
					stage.addChild(newBlackSphere.getSprite());
					break;
				case "4" : 
					var newFlameThrower = new Flamethrower(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					enemies.push(newFlameThrower);
					stage.addChild(newFlameThrower.getSprite());
					break;
				case "5" : 
					var newTeleporto = new Teleporto(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					enemies.push(newTeleporto);
					stage.addChild(newTeleporto.getSprite());
					break;
				case "6" : 
					var newBoss = new Boss(currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					enemies.push(newBoss);
					stage.addChild(newBoss.getSprite());
					break;
				case "z": 
					var newDetail = new DetailTexture(arrToUse.level[i], currColumn*TEXTURE_SIZE, currRow*TEXTURE_SIZE);
					detailArr.push(newDetail);
					stage.addChild(newDetail.getSprite());
					stage.setChildIndex(newDetail.getSprite(), backgroundArr.length+1);
					break;
				}
					
				currColumn++;
			}
			else
			{
				currColumn = 0;
				currRow++;
				i--;
			}
		}
		
		stage.addChild(wallContainer);
		
		if(player != null)
		{
			crossHair = new CrossHair();
			stage.canvas.style.cursor = "none";
		}
	}

	loadView();
}

/**
 * This method is responsible for adding a key texture (can be input, key card, or wall, etc.)
 * 
 * @param textureId The ID of the texture
 * @param type The type (input, card, wall)
 */
function addKeyTexture(textureId, type, x, y)
{
	var keyItem = null;
	
	switch(textureId)
	{
	case w :
	case s :
	case c :
		switch(type)
		{
			case KEY_CARD : keyItem = new KeyCard(RED_KEY, x, y); break;
			case KEY_INPUT : keyItem = new KeyInput(RED_KEY, x, y); break;
			case KEY_WALL : keyItem = new KeyWall(RED_KEY, x, y); break;
		}
		break;
	case e : 
	case q : 
	case v : 
		switch(type)
		{
			case KEY_CARD : keyItem = new KeyCard(BLUE_KEY, x, y); break;
			case KEY_INPUT : keyItem = new KeyInput(BLUE_KEY, x, y); break;
			case KEY_WALL : keyItem = new KeyWall(BLUE_KEY, x, y); break;
		}
		break;
	case r : 
	case f : 
	case b : 
		switch(type)
		{
			case KEY_CARD : keyItem = new KeyCard(YELLOW_KEY, x, y); break;
			case KEY_INPUT : keyItem = new KeyInput(YELLOW_KEY, x, y); break;
			case KEY_WALL : keyItem = new KeyWall(YELLOW_KEY, x, y); break;
		}
		break;
	}
	
	if(keyItem != null)
	{
		switch(type)
		{
			case KEY_CARD : 
				keyCards.push(keyItem); 
				break;
			case KEY_INPUT : 
				keyInputs.push(keyItem); 
				break;
			case KEY_WALL : 
				
				switch(keyItem.getType())
				{
				case RED_KEY : 
					redKeyWalls.push(keyItem); 
					break;
				case BLUE_KEY : 
					blueKeyWalls.push(keyItem); 
					break;
				case YELLOW_KEY : 
					yellowKeyWalls.push(keyItem); 
					break;
				}
				break;
		}
		
		stage.addChild(keyItem.getSprite());
	}
}

function removeEverythingFromStage(delEvents)
{
	delEvents = typeof delEvents === 'undefined' ? true : false;
	delEvents ? createjs.Ticker.removeAllEventListeners() : null;

	moveUp = false;
	moveDown = false;
	moveLeft = false;
	moveRight = false;
	
	collisWallArr = [];
	
	if(onCollisWallInterval != -1)
	{
		clearInterval(onCollisWallInterval);
		onCollisWallInterval = -1;
	}
	
	wallArr = null;
	flowArr = null;
	backgroundArr = null;
	bulletArr = null;
	destArr = null;
	
	keyCards = null;
	keyInputs = null;

	redKeyWalls = null;
	blueKeyWalls = null;
	yellowKeyWalls = null;
	
	telepArr = null;
	
	wallArr = [];
	flowArr = [];
	backgroundArr = [];
	bulletArr = [];
	destArr = [];
	detailArr = [];
	
	keyCards = [];
	keyInputs = [];
	
	background = null;
	
	redKeyWalls = [];
	blueKeyWalls = [];
	yellowKeyWalls = [];
	
	telepArr = [];
	
	stage.removeAllChildren();
	
	hasRedKey = false;
	hasBlueKey = false;
	hasYellowKey = false;
	
	deathMatch = false;
	shouldMovePlayerTexture = false;

	noclip = false;
	enemyOneBulletDeath = false;
	
	if(hud != null)
		hud.removeHud();
	
	if(player != null)
		stage.removeChild(player.getSprite());
	
	if(endLevelContainer.length != 0)
	{	
		endLevelContainer[0].removeParticlesEvent();
		endLevelContainer = [];
	}
	
	enemies.forEach(function(item){
		item.removeEnemyBehavior();
	});
	
	enemies = [];
		
	resetEnvirArr();
	
	stageCompleted = false;
	
	if(player != null)
		player.onParticles.removeParticlesEvent();
	
	player = null;
	hud = null;
		
	endLevelAnnouncement = [];
	deathAnnouncement = [];
	
	wallContainer = null;
	
	if(crossHair != null)
		crossHair.removeCrossHair();
	
	crossHair = null;
	
	if(miniMenu != null)
		miniMenu.deleteMenu();
	
	if(mainMenu != null)
		mainMenu.deleteMenu();
	
	stage.canvas.style.cursor = "default";
}

function proceedToNextLevel(shouldProceed)
{
	//if true, user will proceed to the next stage
	if(shouldProceed && typeof currentLevel === 'number')
		currentLevel++;
	
	removeEverythingFromStage();
	startLevel(currentLevel);
}

function resetEnvirArr(){ environemntArr = [flowArr, telepArr, destArr, keyCards, keyInputs, redKeyWalls, blueKeyWalls, yellowKeyWalls, endLevelContainer, enemies, detailArr]; }

function getLevel(lvlNum)
{
	switch(lvlNum)
	{
		case 0 : switchMusic(null); return lvlZero;
		case 1 : switchMusic("ost3"); return lvlOne;
		case 2 : switchMusic("ost5"); return lvlTwo;
		case 3 : switchMusic("ost1"); return lvlThree;
		case 4 : switchMusic("ost2"); return lvlFour;
		case 5 : switchMusic("ost3"); return lvlFive;
		case 6 : switchMusic("ost6"); deathMatch = true; return lvlSix;
		case 7 : switchMusic("ost4"); return lvlSeven;
		case 8 : switchMusic("ost1"); return lvlEight;
		case 9 : switchMusic(null); deathMatch = true; return lvlNine;
		case 10: switchMusic("ost1"); playEndingScene(); return null;
		case 'es1': return null;
		case 'es2': return lvlES2;
		case 'es3': return lvlES3;
		case 'es4': return lvlES4;
		case 'es5': return lvlES5;
		default : switchMusic(null); return null;
	}
}