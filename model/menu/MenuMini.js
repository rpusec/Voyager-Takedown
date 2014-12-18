function MenuMini()
{
	var musicToggle;
	var soundToggle;

	stage.enableMouseOver();
	
	var container = new createjs.Container();
	
	var bg = new createjs.Shape();
	bg.graphics.beginStroke("#3da6ff");
	bg.graphics.beginFill("#000");
	bg.graphics.setStrokeStyle(1);
	bg.snapToPixel = true;
	bg.graphics.drawRect(0, 0, 300, 200);
	bg.alpha = 0.7;
	bg.setBounds(0, 0, 300, 200);
	
	container.addChild(bg);
	
	container.x = Math.round((stage.canvas.width/2) - (container.getBounds().width/2));
	container.y = Math.round((stage.canvas.height/2) - (container.getBounds().height/2));

	var titleText = new createjs.Text("Game Paused", "30px Arial", "#fff");
	titleText.shadow = new createjs.Shadow("#3da6ff", 0, 0, 5);
	titleText.x = container.getBounds().width/2 - titleText.getBounds().width/2;
	titleText.y = titleText.getBounds().height;
	
	container.addChild(titleText);
	
	this.deleteMenu = function()
	{
		stage.enableMouseOver(0);
		stage.canvas.style.cursor = "none";
		stage.removeChild(container);
		musicToggle.deleteBtn();
		soundToggle.deleteBtn();
		miniMenu = null;
	};
	
	createMenuOption("Reset Game", this.deleteMenu, 95);
	createMenuOption("Back to main menu", window.setMainMenu, 115);

	function createMenuOption(text, functionCall, y)
	{
		var optionText = new createjs.Text(text, "14px Arial", "#aadcff");
		optionText.addEventListener("click", functionCall);
		
		var hitArea = new createjs.Shape();
		hitArea.graphics.beginFill("#000").drawRect(0, 0, optionText.getMeasuredWidth(), optionText.getMeasuredHeight());
		
		optionText.hitArea = hitArea;
		
		optionText.addEventListener("mouseover", function(e){
			optionText.color = "#fff";
		});
		
		optionText.addEventListener("mouseout", function(e){
			optionText.color = "#aadcff";
		});
		
		optionText.x = container.getBounds().width/2 - optionText.getBounds().width/2;
		optionText.y = y;
		
		container.addChild(optionText);
	}
	
	stage.addChild(container);

	var locX = container.x + container.getBounds().width;
	var locY = container.y + container.getBounds().height;

	musicToggle = new SoundToggleBtn(locX-30, locY-30, "music");
	soundToggle = new SoundToggleBtn(locX-60, locY-30, "sound");
}

function setMainMenu()
{
	if(mainMenu != null)
		return;
	
	removeEverythingFromStage();
	mainMenu = new MainMenu();
	startGameUpdating();
}