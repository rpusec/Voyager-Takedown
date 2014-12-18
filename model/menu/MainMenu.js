var startGameOpt;
var specialThxOpt;
var helpOpt;
var tabs = [];
var menuWH = {width: 400, height: 350};

var optionsArr = [];

var frameSGD;

function MainMenu()
{
	loadView();

	switchMusic("ost5");

	stage.enableMouseOver();

	background = new Background(-1);
	stage.addChild(background.getSprite());
	
	var starsArr = createStars(15);
	
	var logo = new createjs.Bitmap("textures/misc/logo.png");
	logo.x = -5;
	logo.y = -5;
	stage.addChild(logo);

	createjs.Ticker.addEventListener("tick", onMoveStars);
	
	function onMoveStars()
	{
		var speed = 2;
		
		starsArr.forEach(function(item){
			if(item.size == "big")
			{
				item.getSprite().x += speed;
				item.getSprite().y += speed/2;
			}
			else
			{
				item.getSprite().x += speed/2;
				item.getSprite().y += speed/4;
			}
			
			isStarOutOfStage(item);
		});
	}
	
	this.deleteMenu = function()
	{
		createjs.Ticker.removeEventListener("tick", onMoveStars);
		createjs.Ticker.removeEventListener('tick', onMovePlayerAround);
		optionsArr.forEach(function(item){item.deleteEvents();});
		tabs = [];
		optionsArr = [];
		stage.enableMouseOver(0);
		mainMenu = null;
	};
	
	var sigTxt = new createjs.Text("Copyright 2014, rpusec (Miketinovic)", "10px Arial", "#fff");
	sigTxt.x = stage.canvas.width - sigTxt.getMeasuredWidth();
	sigTxt.y = stage.canvas.height - sigTxt.getMeasuredHeight();
	
	stage.addChild(sigTxt);
	
	prepareTabs();
	
	var frameHelp = new MenuFrame("Help", [tabs[0], tabs[1]]);
	var frameST = new MenuFrame("Special Thanks", [tabs[2]]);
	
	var yAlignment = 50;
	optionsArr.push(new MenuOption("Start Game", window.openStartGame, yAlignment+30, "left", 17));
	optionsArr.push(new MenuOption("Help", frameHelp, yAlignment+90, "right", 17));
	optionsArr.push(new MenuOption("Special Thanks", frameST, yAlignment+150, "left", 17));
	optionsArr.push(new MenuOption("Delete Savegames", window.deleteSavegames, stage.canvas.height-50, "right", 13, 155, 30));
	
	optionsArr.forEach(function(item){item.addElement();});

	frameSGD = new MenuFrame("Save games deleted! ", [tabs[3]]);

	SoundToggleBtn(stage.canvas.width - 30, 10, "music");
	SoundToggleBtn(stage.canvas.width - 65, 10, "sound");

	var menuPlayer = new Player();
	var mpSprite = menuPlayer.getSprite();

	var flyingDir;
	var DIVIDE_SPEED_BY = 5;
	var opposingSpeed;
	var stopPlayerFor;
	resetPlAttributes();

	createjs.Ticker.addEventListener('tick', onMovePlayerAround);

	function onMovePlayerAround()
	{
		if(stopPlayerFor != 0)
		{
			stopPlayerFor--;
			return;
		}

		if(!stage.contains(mpSprite))
		{
			stage.addChild(mpSprite);
			stage.setChildIndex(mpSprite, backgroundArr.length+1);
		}

		if(flyingDir == -1)
		{
			flyingDir = Math.floor(Math.random()*4);

			switch(flyingDir)
			{
				case 0 : 
					mpSprite.x = stage.canvas.width + mpSprite.getBounds().width; 
					mpSprite.y = stage.canvas.height/2;
					menuPlayer.changePos(menuPlayer.LEFT);
					break; //right-left
				case 1 : 
					mpSprite.x = mpSprite.getBounds().width * -1; 
					mpSprite.y = stage.canvas.height/2;
					menuPlayer.changePos(menuPlayer.RIGHT);
					break; //left-right
				case 2 : 
					mpSprite.y = mpSprite.getBounds().height * -1;
					mpSprite.x = stage.canvas.width/2;
					menuPlayer.changePos(menuPlayer.DOWN);
					break; //up-down
				case 3 : 
					mpSprite.y = stage.canvas.height + mpSprite.getBounds().height;
					mpSprite.x = stage.canvas.width/2;
					menuPlayer.changePos(menuPlayer.UP);
					break; //down-up
			}
		}
		else
		{
			switch(flyingDir)
			{
				case 0 :
					if(mpSprite.x > mpSprite.getBounds().width * -1)
					{
						mpSprite.x -= MAX_SPEED/DIVIDE_SPEED_BY; 
						mpSprite.y += opposingSpeed;
					}
					else
						resetPlAttributes();
					break; //right-left
				case 1 : 
					if(mpSprite.x < stage.canvas.width + mpSprite.getBounds().width)
					{
						mpSprite.x += MAX_SPEED/DIVIDE_SPEED_BY; 
						mpSprite.y += opposingSpeed;
					}
					else
						resetPlAttributes();
					break; //left-right
				case 2 : 
					if(mpSprite.y < stage.canvas.height + mpSprite.getBounds().height)
					{
						mpSprite.y += MAX_SPEED/DIVIDE_SPEED_BY; 
						mpSprite.x += opposingSpeed;
					}
					else
						resetPlAttributes();
					break; //up-down
				case 3 : 
					if(mpSprite.y > mpSprite.getBounds().height * -1)
					{
						mpSprite.y -= MAX_SPEED/DIVIDE_SPEED_BY; 
						mpSprite.x += opposingSpeed;
					}
					else
						resetPlAttributes();
					break; //down-up
			}
		}
	}

	function resetPlAttributes()
	{
		flyingDir = -1;
		stopPlayerFor = 300;
		menuPlayer.hideFire();
		opposingSpeed = Math.random() * 4;
		opposingSpeed *= Math.floor(Math.random()*2) == 0 ? -1 : 1;
	}
}

function prepareTabs()
{
	var save_games_txt = "Your savegames are stored using HTML5's localStorage. " + 
	"Your savegames are always stored in your browser without any exparation date, unless you manually decide to delete them. ";
	
	var hp1 = "Unfortunately, the game doesn't provide you the ability to change your settings. ";
	
	var sp1 = "Special thanks to CreateJS for building the three JS libraries used to build this game (EaselJS, PreloadJS, and SoundJS). ";
	var sp2 = "And also thanks to \"mokrosuhibrijac\" for the PS lightning in the background. http://mokrosuhibrijac.deviantart.com/";
	var sp3 = "Thanks to freeSFX(http://www.freesfx.co.uk/) for the sound effects. ";
	
	var help_controlsImg = new createjs.Bitmap("textures/misc/help_controls.png");
	var hp1Txt = new createjs.Text(hp1, "14px Arial", "#fff");
	
	var save_games_txtTxt = new createjs.Text(save_games_txt, "14px Arial", "#fff");
	
	var sp1Txt = new createjs.Text(sp1, "14px Arial", "#fff");
	var sp2Txt = new createjs.Text(sp2, "14px Arial", "#fff");
	var sp3Txt = new createjs.Text(sp3, "14px Arial", "#fff");
	
	var sgdTxt = new createjs.Text("Your savegames are successfully deleted! ", "14px Arial", "#fff");
	
	help_controlsImg.x = Math.round(help_controlsImg.getBounds().width/2) * -1;
	
	sp2Txt.y = 50;
	hp1Txt.y = 90;
	sp3Txt.y = 100;
	
	var frameContent1 = [help_controlsImg, hp1Txt];
	var frameContent2 = [save_games_txtTxt];
	var frameContent3 = [sp1Txt, sp2Txt, sp3Txt];
	var frameContent4 = [sgdTxt];
	
	tabs.push(new MenuTab("Controls", frameContent1));
	tabs.push(new MenuTab("Where are my savegames?", frameContent2));
	tabs.push(new MenuTab("Special Thanks", frameContent3));
	tabs.push(new MenuTab("Save games deleted!", frameContent4));
}

function openStartGame(lvlAmountNum)
{
	maninpulateOptions(true);
	
	var yOffset = 40;
	var currColumn = 0;
	var currRow = 0;
	var separateFor = 100;
	var container = new createjs.Container();
	container.sgButtons = [];
	
	for(var i = 1; i <= 9; i++)
	{
		var sgLevel = new StartGameLevel((currColumn*separateFor), (currRow*separateFor)-yOffset, i, i*125, 85, 85, 20, false);
		container.addChild(sgLevel.getSprite());
		container.sgButtons.push(sgLevel);
		
		if((i % 3) != 0)
			currColumn++;
		else
		{
			currRow++;
			currColumn = 0;
		}
	}
	
	container.setBounds(0, 0, separateFor*3, separateFor*3);
	
	var sgClose = new StartGameLevel(container.getBounds().width - 10, -70, "X", 9*125, 25, 30, 20, true);
	container.addChild(sgClose.getSprite());
	
	container.x = stage.canvas.width/2 - container.getBounds().width/2;
	container.y = stage.canvas.height/2 - container.getBounds().height/2;
	
	stage.addChild(container);
	
	container.deleteEvents = function()
	{
		container.sgButtons.forEach(function(item){
			item.deleteEvents();
		});
	};
}

function StartGameLevel(x, y, lvlNum, appearDelay, width, height, fontWidth, shouldCenter)
{
	var container = new createjs.Container();
	var graphics = new createjs.Shape();
	createGraphics(graphics, "#b1d5e8", "rgba(0,0,0,0)", width, height, true);
	container.setBounds(0, 0, graphics.getBounds().width, graphics.getBounds().height);
	var numTxt = new createjs.Text(lvlNum, fontWidth + "px Arial", "#fff");
	numTxt.shadow = new createjs.Shadow("#000", 2, 2, 0);
	
	if(shouldCenter)
	{
		numTxt.x = graphics.getBounds().width/2 - numTxt.getMeasuredWidth()/2;
		numTxt.y = graphics.getBounds().height/2 - numTxt.getMeasuredHeight()/2;
	}
	
	if(typeof lvlNum === 'number')
	{
		var thumbnail = new createjs.Bitmap("textures/misc/sgLvl" + lvlNum + ".png");
		thumbnail.alpha = 0.1;
		container.addChild(thumbnail);
		
		if(saveGameSystem != null)
		{
			if(lvlNum <= saveGameSystem.getGame() || lvlNum == 1)
			{
				thumbnail.alpha = 1;
				container.addEventListener("click", onSkipLevel);
			}
		}
	}
	
	container.x = x;
	container.y = y;
	
	container.addChild(graphics, numTxt);
	
	this.getSprite = function(){return container;};
	
	var onMoveDownInterval = setInterval(onMoveDown, appearDelay);
	var moveDownCounter = 0;
	
	container.alpha = 0;
	
	function onMoveDown()
	{
		if(moveDownCounter <= 15)
		{
			if(moveDownCounter == 0)
				onMoveDownInterval = changeInterval(onMoveDownInterval, onMoveDown, 25);
			
			container.y += 5;
			container.alpha += 0.06;
			moveDownCounter++;
		}
		else
			clearInterval(onMoveDownInterval);
	}
	
	if(typeof lvlNum === 'string')
		container.addEventListener("click", onBackToMenu);
		
	function onSkipLevel()
	{
		currentLevel = lvlNum;
		proceedToNextLevel(false);
	}
	
	container.addEventListener("mouseover", onMouseOver);
	container.addEventListener("mouseout", onMouseOut);
	
	function onMouseOver(){createGraphics(graphics, "#fff", "rgba(255,255,255,0.5)", width, height, true);}
	function onMouseOut(){createGraphics(graphics, "#b1d5e8", "rgba(0,0,0,0)", width, height, true);}
	
	this.deleteEvents = function()
	{
		container.removeEventListener("mouseover", onMouseOver);
		container.removeEventListener("mouseout", onMouseOut);
		
		if(typeof lvlNum === 'number')
			container.removeEventListener("click", onSkipLevel);
		else
			container.removeEventListener("click", onBackToMenu);
	};
	
	function onBackToMenu()
	{
		maninpulateOptions(false);
		container.parent.deleteEvents();
		
		createjs.Ticker.addEventListener("tick", animateBTM);
		
		function animateBTM()
		{
			if(container.parent.alpha > 0)
			{
				container.parent.x -= 5;
				container.parent.alpha -= 0.05;
			}
			else
			{
				createjs.Ticker.removeEventListener("tick", animateBTM);
				stage.removeChild(container.parent);
			}
		}
	}
}

function MenuOption(text, functionCall, y, direction, fontHeight, width, height)
{
	var animating = false;
	var textContainer = new createjs.Container();
	var optText = new createjs.Text(text, fontHeight + "px Arial", "#fff");
	
	var hoverColor = "#b1d5e8";
	
	var optGraphics = new createjs.Shape();
	updateGraphics(hoverColor, width, height);
	
	textContainer.addChild(optGraphics, optText);
	textContainer.setBounds(0, 0, optGraphics.getBounds().width, optGraphics.getBounds().height);
	textContainer.x = 10;
	textContainer.y = Math.round(y);
	
	optText.x = 10;
	optText.y = Math.round(textContainer.getBounds().height/2 - optText.getMeasuredHeight()/2 - 1);
	
	textContainer.addEventListener("click", onOpenFrame);
	
	function onOpenFrame()
	{
		if(animating)
			return;

		if(typeof functionCall !== 'function')
		{
			functionCall.manElement(false);
			maninpulateOptions(true);
		}
		else
			functionCall();
	}
		
	this.addElement = function()
	{
		stage.addChild(textContainer);
	};
	
	this.manElement = function(shouldHide)
	{
		if(shouldHide && !animating)
		{
			animating = true;
			createjs.Ticker.addEventListener("tick", onHideElement);
		}
		else if(!shouldHide && !animating)
		{
			animating = true;
			createjs.Ticker.addEventListener("tick", onShowElement);
		}
		
		updateGraphics(hoverColor);
	};
	
	this.deleteEvents = function()
	{
		createjs.Ticker.removeEventListener("tick", onHideElement);
		createjs.Ticker.removeEventListener("tick", onShowElement);
		textContainer.removeEventListener("click", onOpenFrame);
		stage.removeChild(textContainer);
	};
	
	function onHideElement()
	{
		if(textContainer.alpha > 0)
		{
			if(direction == "left")
				textContainer.x -= 2;
			else if(direction == "right")
				textContainer.x += 2;
			
			textContainer.alpha -= 0.05;
		}
		else
		{
			createjs.Ticker.removeEventListener("tick", onHideElement);
			animating = false;
		}
	}
	
	function onShowElement()
	{
		if(textContainer.alpha < 1)
		{
			if(direction == "left")
				textContainer.x += 2;
			else if(direction == "right")
				textContainer.x -= 2;
			
			textContainer.alpha += 0.05;
		}
		else
		{
			createjs.Ticker.removeEventListener("tick", onShowElement);
			animating = false;
		}
	}
	
	textContainer.addEventListener("mouseover", onMouseOver);
	textContainer.addEventListener("mouseout", onMouseOut);
	
	function onMouseOver(){if(!animating){updateGraphics("#fff");}}
	function onMouseOut(){if(!animating){updateGraphics(hoverColor);}}
	
	function updateGraphics(newColor)
	{
		var currWidth = 300;
		var currHeight = optText.getMeasuredHeight()*3;
		
		if(typeof width !== 'undefined')
			currWidth = width;
		
		if(typeof height !== 'undefined')
			currHeight = height;
		
		optGraphics.graphics.clear();
		createGraphics(optGraphics, newColor, "rgba(0,0,0,0.5)", currWidth, currHeight, true);
	}
}

/*
	arrTabs => {name, content}
	content => {cont1, cont2, cont3...}
*/
function MenuFrame(titleStr, arrTabs)
{
	var animating = false;
	var parent = this;
	var currContent = [];
	
	var container = new createjs.Container();
	container.tabs = [];
	
	var menuG = new createjs.Shape();
	createGraphics(menuG, "#b1d5e8", "rgba(0,0,0,0.8)", menuWH.width, menuWH.height, true);
	
	var closeIcon = new createjs.Container();
	var closeG = new createjs.Shape();
	createGraphics(closeG, "#b1d5e8", "#000", 20, 20, true);
	var xTxt = new createjs.Text("x", "14px Arial", "#fff");
	xTxt.x = closeG.getBounds().width/2 - xTxt.getMeasuredWidth()/2;
	closeIcon.addChild(closeG, xTxt);
	closeIcon.x = menuG.getBounds().width - closeIcon.getBounds().width;
	closeIcon.y = closeIcon.getBounds().width * -1;
	
	container.addChild(menuG, closeIcon);
	container.setBounds(0, 0, menuG.getBounds().width, menuG.getBounds().height);
	
	container.x = stage.canvas.width/2 - container.getBounds().width/2;
	container.y = stage.canvas.height/2 - container.getBounds().height/2;
	
	var titleText = new createjs.Text(titleStr, "25px Arial", "#fff");
	titleText.x = 10;
	titleText.y = 40;
	
	container.addChild(titleText);
	
	for(var i = 0; i < arrTabs.length; i++)
	{
		var tabCont = new createjs.Container();
		tabCont.tabContent = arrTabs[i].content;
		
		var tabTemplate = new createjs.Shape();
		
		if(i == 0)
		{
			changeTabContent(tabCont.tabContent);
			createGraphics(tabTemplate, "#fff", "#000", menuWH.width/arrTabs.length, 30, true);
		}
		else
			createGraphics(tabTemplate, "#b1d5e8", "#000", menuWH.width/arrTabs.length, 30, true);
		
		tabCont.x = i*tabTemplate.getBounds().width;
		
		var tabTitle = new createjs.Text(arrTabs[i].name, "14px Arial", "#fff");
		tabTitle.x = tabTemplate.getBounds().width/2 - tabTitle.getBounds().width/2;
		tabTitle.y = tabTemplate.getBounds().height/2 - tabTitle.getBounds().height/2;
		
		tabCont.addEventListener("click", onOpenTab);
		
		tabCont.addChild(tabTemplate, tabTitle);
		container.addChild(tabCont);
		
		container.tabs.push(tabCont);
		
		if(arrTabs.length == 1)
			tabCont.visible = false;
	}
	
	container.alpha = 0;
	
	stage.addChild(container);
	
	this.manElement = function(shouldHide)
	{	
		if(shouldHide && !animating)
		{
			animating = true;
			createjs.Ticker.addEventListener("tick", onHideElement);
		}
		else if(!shouldHide && !animating)
		{
			animating = true;
			createjs.Ticker.addEventListener("tick", onShowElement);
		}
	};
	
	closeIcon.addEventListener("click", onHideFrame);
	
	function onHideFrame()
	{
		parent.manElement(true);
		maninpulateOptions(false);
	}
	
	function onHideElement()
	{
		if(container.alpha > 0)
			container.alpha -= 0.05;
		else
		{
			createjs.Ticker.removeEventListener("tick", onHideElement);
			animating = false;
		}
	}
	
	function onShowElement()
	{
		if(container.alpha < 1)
			container.alpha += 0.05;
		else
		{
			createjs.Ticker.removeEventListener("tick", onShowElement);
			animating = false;
		}
	}
	
	function onOpenTab(e)
	{
		container.tabs.forEach(function(tab){
			createGraphics(tab.children[0], "#b1d5e8", "#000", tab.children[0].getBounds().width, tab.children[0].getBounds().height);
		});
		
		createGraphics(e.target.parent.children[0], "#fff", "#000", e.target.parent.children[0].getBounds().width, e.target.parent.children[0].getBounds().height);
		
		changeTabContent(e.target.parent.tabContent);
	}
	
	function changeTabContent(newContentArr)
	{
		if(currContent.length != 0)
		{
			//removing all previous items
			currContent.forEach(function(item){
				container.removeChild(item);
			});
		}
		
		currContent = newContentArr;
			
		currContent.forEach(function(item){
			container.addChild(item);
		});
	}
}

function MenuTab(name, content)
{
	this.name = name;
	this.content = content;
	
	content.forEach(function(item){
		
		item.lineWidth = menuWH.width - 20;
		item.textAlign = "center";
		item.x += Math.round(menuWH.width/2);
		item.y += 90;
	});
}

function createGraphics(objReference, borderColor, bgColor, width, height, shouldSetBounds)
{	
	objReference.graphics.clear();
	objReference.graphics.beginStroke(borderColor).beginFill(bgColor).setStrokeStyle(2).drawRect(0, 0, width, height);
	
	if(shouldSetBounds)
		objReference.setBounds(0, 0, width, height);
}

function deleteSavegames()
{
	frameSGD.manElement(false);
	saveGameSystem.deleteGame();
}

function maninpulateOptions(shouldHide)
{
	optionsArr.forEach(function(item){
		item.manElement(shouldHide);
	});
}