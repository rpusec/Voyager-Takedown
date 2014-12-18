function CrossHair()
{
	var chGraphics = new createjs.Bitmap("textures/player/crosshair.png");
	chGraphics.regX = Math.floor(chGraphics.getBounds().width/2);
	chGraphics.regY = Math.floor(chGraphics.getBounds().height/2);
	
	this.getSprite = function(){return chGraphics; };
	createjs.Ticker.addEventListener("tick", onManipulate);
	
	stage.addChild(chGraphics);
	
	function onManipulate()
	{
		if(miniMenu != null)
			return;
		
		chGraphics.rotation += 2;
		chGraphics.x = Math.round(mousePosition.x);
		chGraphics.y = Math.round(mousePosition.y);
	}
	
	this.removeCrossHair = function()
	{
		createjs.Ticker.removeEventListener("tick", onManipulate);
		stage.removeChild(chGraphics);
	};
}