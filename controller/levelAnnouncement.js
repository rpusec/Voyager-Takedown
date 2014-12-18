var endLevelAnnouncement = [];
var deathAnnouncement = [];

/**
 * This method creates the text you see in the beginning of every level. 
 * 
 * @param levelNum The number of the level. 
 */
function addStartLevelAnnouncement(levelNum)
{
	var stageCounter = 0;
	var shakeCounter = 1;
	var incrCounter = 0;
	
	var announcementText = new createjs.Text("Welcome To Stage " + levelNum + "!", "bold 60px Arial", "#fff");
	var container = new createjs.Container();
	container.addChild(announcementText);
	
	centerText(container);
	
	var shadowColor = borderColorToUse(currentLevel);
	
	container.rotation -= 40;
	container.shadow = new createjs.Shadow(shadowColor, 0, 0, 20);
	
	stage.addChild(container);
	
	createjs.Ticker.addEventListener("tick", onAnimateTitle);
	
	function onAnimateTitle()
	{
		if(miniMenu != null)
			return;

		switch(stageCounter)
		{
		case 0 :
			container.rotation /= 1.15;
			container.scaleX -= 0.01;
			container.scaleY -= 0.01;
			
			if(container.rotation > -0.5)
			{
				shakeCamera();
				stageCounter++;
			}
			break;
		case 1 :
			if((shakeCounter % 2) == 0)
				container.y += 5;
			else
				container.y -= 5;
			
			if(shakeCounter == 5)
				stageCounter++;
			else
				shakeCounter++;
			break;
		case 2 : 
			container.scaleX += 0.001;
			container.scaleY += 0.001;
			incrCounter++;
			
			if(incrCounter == 60)
				stageCounter++;
			break;
		case 3 : 
			container.alpha -= 0.05;
			
			if(container.alpha <= 0)
				stageCounter++;
			break;
		case 4 : 
			stage.removeChild(container);
			createjs.Ticker.removeEventListener("tick", onAnimateTitle);
			break;
		}
	}
}

/**
 * This function is activated whenever the stage is completed. 
 * It renders the text that you see in the end of each stage. 
 * 
 * @param levelNum The number of the completed stage. 
 */
function addEndLevelAnnouncement(levelNum)
{		
	var stageCounter = 0;
	var announcementText = new createjs.Text("Stage " + levelNum + " Completed!", "bold 60px Arial", "#fff");
	var subText = new createjs.Text("Press ENTER to continue. ", "bold 30px Arial", "#fff");
	
	centerText(announcementText);
	centerText(subText);
	announcementText.y = stage.canvas.height/4;
	subText.y = stage.canvas.height - (stage.canvas.height/4);
	
	var shadowColor = borderColorToUse(currentLevel);
	
	announcementText.shadow = new createjs.Shadow(shadowColor, 0, 0, 20);
	announcementText.alpha = 0;
	subText.shadow = new createjs.Shadow(shadowColor, 0, 0, 20);
	subText.alpha = 0;
	
	stage.addChild(announcementText);
	stage.addChild(subText);
	
	endLevelAnnouncement.push(announcementText);
	endLevelAnnouncement.push(subText);
	
	createjs.Ticker.addEventListener("tick", onAnimateTitle);
	
	function onAnimateTitle()
	{
		if(miniMenu != null)
			return;

		switch(stageCounter)
		{
		case 0 : 
			if(announcementText.alpha < 1)
				announcementText.alpha += 0.05;
			else
				stageCounter++;
			break;
		case 1 : 
			addGroupParticles(announcementText.x, announcementText.y, 16, shadowColor, 3, 0.025, 15, 0);
			stageCounter++;
			break;
		case 2 : 
			if(subText.alpha < 1)
				subText.alpha += 0.05;
			else
				stageCounter++;
			break;
		case 3 : 
			createjs.Ticker.removeEventListener("tick", onAnimateTitle);
			break;
		}
	}
}

function addDeathAnnouncement()
{
	if(!player.isDead())
		return;
	
	var stageCounter = 0; 
	
	var redScreen = new createjs.Shape();
	redScreen.graphics.beginFill("#ba0000").drawRect(0, 0, stage.canvas.width, stage.canvas.height).endFill(); 
	redScreen.alpha = 0;
	
	var announcementText = new createjs.Text("You are dead. ", "bold 60px Arial", "#fff");
	announcementText.shadow = new createjs.Shadow("#ff5151", 0, 0, 20);
	announcementText.alpha = 0;
	
	var subText = new createjs.Text("Press ENTER to restart level. ", "bold 15px Arial", "#fff");
	subText.shadow = new createjs.Shadow("#ff5151", 0, 0, 20);
	subText.alpha = 0;
	subText.rotation += 30;
	
	centerText(announcementText);
	centerText(subText);
	
	subText.y += 100;
	
	stage.addChild(redScreen);
	stage.addChild(announcementText);
	stage.addChild(subText);
	
	deathAnnouncement.push(redScreen);
	deathAnnouncement.push(announcementText);
	deathAnnouncement.push(subText);
	
	createjs.Ticker.addEventListener("tick", onAnimateTitle);
	
	function onAnimateTitle()
	{
		if(miniMenu != null)
			return;
		
		switch(stageCounter)
		{
		case 0: 
			if(redScreen.alpha < 0.5)
				redScreen.alpha += 0.025;
			else
				stageCounter++;
			break;
		case 1: 
			if(announcementText.alpha < 1)
			{
				announcementText.alpha += 0.025;
				announcementText.scaleX += 0.01;
				announcementText.scaleY += 0.01;
			}
			else
				stageCounter++;
			break;
		case 2: 
			if(subText.rotation != 0 && subText.alpha < 1)
			{
				subText.alpha += 0.05;
				subText.scaleX += 0.01;
				subText.rotation -= 2.5;
			}
			else
				stageCounter++;
			break;
		case 3: 
			createjs.Ticker.removeEventListener("tick", onAnimateTitle);
			break;
		}
	}
}

/**
 * Aligns the text to center. 
 * 
 * @param input Text to input. 
 * 
 */
function centerText(input)
{
	input.x = stage.canvas.width/2;
	input.y = stage.canvas.height/2;
	
	input.regX = input.getBounds().width/2;
	input.regY = input.getBounds().height/2;
}

function borderColorToUse(levelId)
{
	switch(levelId)
	{
		case 0 :
		case 1 :
		case 2 :
		case 3 :
			return "#3dafff"; 
		case 4 :
		case 5 :
		case 6 :
			return "#fff06f"; 
		case 7 :
		case 8 :
		case 9 :
		case 10 :
			return "#ff4343"; 
	}
}