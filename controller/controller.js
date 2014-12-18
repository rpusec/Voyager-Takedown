var stage;

var W = 87;
var S = 83;
var A = 65;
var D = 68;

var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;

var moveUp = false;
var moveDown = false;
var moveLeft = false;
var moveRight = false;

var incrSpeedFor = 1;
var MAX_SPEED = 20;

var wallArr = [];
var flowArr = [];
var backgroundArr = [];
var bulletArr = [];
var telepArr = [];
var destArr = [];
var keyCards = [];
var keyInputs = [];
var redKeyWalls = [];
var blueKeyWalls = [];
var yellowKeyWalls = [];
var detailArr = [];

var collisWallArr = [];
var onCollisWallInterval = -1;

var hasRedKey = false;
var hasBlueKey = false;
var hasYellowKey = false;

var currentLevel = 1;

var player;
var environemntArr; 
var hud;
var endLevelContainer = [];

var background;

var stageCompleted = false;
var deathMatch = false;
var shouldMovePlayerTexture = false;

var wallContainer = null;

var enemies = [];

var mousePosition = {x : -1, y : -1};
var crossHair;

var miniMenu = null;
var mainMenu = null;

var bgMusic = null;

var musicOn = true;
var soundOn = true;

var noclip = false;
var enemyOneBulletDeath = false;

$(document).ready(function(){ init(); });

function init()
{
	stage = new createjs.Stage("gameStage");
	setupPreloadAttributes();
	setupManifest();
	startPreload();
}

function onAnimateGame()
{
	if(player != null && wallContainer != null && miniMenu == null)
	{
		playerMovement();
		if(!shouldMovePlayerTexture)
		{
			moveEnvir(player.xSpeed, player.ySpeed);
			moveBg();
			moveBullets();
		}
		else
			movePlayerTexture();
		playerCollision();
		bulletCollision();
		flowCollision();
		telepCollision();
		keyCardCollision();
		keyInputCollision();
		endLevelCollision();
		processDeathMatch();
	}

	stage.update();
}

function startGameUpdating()
{
	createjs.Ticker.addEventListener("tick", onAnimateGame);
	createjs.Ticker.setFPS(30);
}

function playerMovement()
{
	if(moveUp)
	{
		player.changePos(player.UP);
		if(player.ySpeed >= MAX_SPEED*-1)
			player.ySpeed -= incrSpeedFor;
	}
	if(moveDown)
	{
		player.changePos(player.DOWN);
		if(player.ySpeed <= MAX_SPEED)
			player.ySpeed += incrSpeedFor;
	}
	if(moveLeft)
	{
		player.changePos(player.LEFT);
		if(player.xSpeed >= MAX_SPEED*-1)
			player.xSpeed -= incrSpeedFor;
	}
	if(moveRight)
	{
		player.changePos(player.RIGHT);
		if(player.xSpeed <= MAX_SPEED)
			player.xSpeed += incrSpeedFor;
	}
	
	player.shouldFireParticles();
}

function movePlayerTexture()
{
	player.getSprite().x += player.xSpeed;
	player.getSprite().y += player.ySpeed;
}

function bouncePlayer()
{
	environemntArr.forEach(function(arrItem){
		arrItem.forEach(function(item){
			item.getSprite().x += player.xSpeed;
			item.getSprite().y += player.ySpeed;
		});
	});
	
	wallContainer.x += player.xSpeed;
	wallContainer.y += player.ySpeed;

	player.xSpeed = Math.floor((player.xSpeed/2)*-1);
	player.ySpeed = Math.floor((player.ySpeed/2)*-1);

	player.animateHurt();
	addGroupParticles(player.getSprite().x + (player.getSprite().getBounds().width/2), player.getSprite().y + (player.getSprite().getBounds().width/2), 5, "#FFF", 4, 0.1, 5, 0.07);
	playSoundEffect(TARGETSHOT_SOUND);
}

function moveBg()
{
	backgroundArr.forEach(function(item){
		if(item.size == "big")
		{
			item.getSprite().x -= Math.floor(player.xSpeed/2);
			item.getSprite().y -= Math.floor(player.ySpeed/2);
		}
		else
		{
			item.getSprite().x -= Math.floor(player.xSpeed/4);
			item.getSprite().y -= Math.floor(player.ySpeed/4);
		}
		
		isStarOutOfStage(item);
	});
}

function moveEnvir(forX, forY)
{
	environemntArr.forEach(function(arrItem){
		arrItem.forEach(function(item){
			item.getSprite().x -= forX;
			item.getSprite().y -= forY;
		});
	});

	wallContainer.x -= forX;
	wallContainer.y -= forY;
}

function moveBullets()
{
	bulletArr.forEach(function(item){
		item.getSprite().x -= player.xSpeed;
		item.getSprite().y -= player.ySpeed;
		
		if(isObjectOutOfStage(item, 400))
			item.removeBullet(false);
	});
}

function isObjectOutOfStage(item, distanceAmount, shouldLTG)
{
	var obj1X;
	var obj1Y;
	var obj1Width = item.getSprite().getBounds().width;
	var obj1Height = item.getSprite().getBounds().height;
	
	if(shouldLTG)
	{
		var globalPoint = item.getSprite().localToGlobal(0, 0);
		obj1X = globalPoint.x;
		obj1Y = globalPoint.y;
	}
	else
	{
		obj1X = item.getSprite().x;
		obj1Y = item.getSprite().y;
	}
	
	if(obj1X < (obj1Width*-1) - distanceAmount || 
		obj1X > stage.canvas.width + distanceAmount || 
		obj1Y < (obj1Height*-1) - distanceAmount || 
		obj1Y > stage.canvas.height + distanceAmount)
		return true;
	else
		return false;
}

function fireBullet(e)
{
	if(player == null)
		return;
	
	if(!stageCompleted && !player.isDead() && miniMenu == null)
	{
		player.changePos(player.FIRE);
		createBullet(
			player.getSprite().x + player.getSprite().getBounds().width/2, 
			player.getSprite().y + player.getSprite().getBounds().height/2, 
			mousePosition.x, 
			mousePosition.y, 
			PLAYER_BULLET, 
			null);
	}
}

function processDeathMatch()
{
	if(deathMatch)
	{
		if(enemies.length == 0)
		{
			endLevelProcess();
			deathMatch = false;
		}
	}
}

/**
*
*	This method updates the array that contains Wall objects
*	which can be collided. 
*
*/
function updateCollisionableObjects()
{
	if(wallContainer == null)
		return;
		
	if(collisWallArr.length == 0)
	{
		clearInterval(onCollisWallInterval);
		onCollisWallInterval = setInterval(updateCollisionableObjects, 800);
	}
	
	//we need to reset the array so that new Wall objects would arrive
	collisWallArr = null;
	collisWallArr = [];
	
	for(var i = 0; i < wallArr.length; i++)
	{
		if(!isObjectOutOfStage(wallArr[i], 600, true))
		{
			collisWallArr.push(wallArr[i]);
			wallArr[i].getSprite().visible = true;
		}
		else
			wallArr[i].getSprite().visible = false;
	}

	for(var i = 0; i < detailArr.length; i++)
	{
		if(!isObjectOutOfStage(detailArr[i], 600, false))
			detailArr[i].getSprite().visible = true;
		else
			detailArr[i].getSprite().visible = false;
	}
}

function switchMusic(newSongLink)
{
	if(bgMusic != null)
		bgMusic.stop();
		
	if(newSongLink == null)
		bgMusic = null;
	else
		bgMusic = createjs.Sound.play(newSongLink, {loop:-1, volume: 0.6});

	if(!musicOn && bgMusic != null)
		bgMusic.pause();
}

function playSoundEffect(src)
{
	if(soundOn)
		createjs.Sound.play(src, {volume: 0.5});
}

function loadView()
{
	stage.alpha = 0.5;

	createjs.Ticker.addEventListener("tick", onLoadView);

	function onLoadView()
	{
		if(stage.alpha < 1)
			stage.alpha += 0.025;
		else
			createjs.Ticker.removeEventListener("tick", onLoadView);
	}
}

$(document).on("ready", function(){
	$(document).on("keydown", function(e){
		if(e.which == 13)
		{
			if(player == null)
				return;

			if(stageCompleted)
				proceedToNextLevel(true);
			else if(player.isDead())
				proceedToNextLevel(false);
		}
		
		if(e.which == 27 && mainMenu == null) //esc key
		{
			if(miniMenu == null)
				miniMenu = new MenuMini();
			else
				miniMenu.deleteMenu();
		}
	});
});