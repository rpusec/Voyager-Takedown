function Background(levelId)
{
	switch(levelId)
	{
		case -1 : 
			bgImg = "textures/envir/backgrounds/menubg.png";
			break;
		case 0 :
		case 1 :
		case 2 :
		case 3 :
		case 'es4' :
		case 'es5' :
			bgImg = "textures/envir/backgrounds/bg1.png"; 
			break;
		case 4 :
		case 5 :
		case 6 :
		case 'es2' :
		case 'es3' :
			bgImg = "textures/envir/backgrounds/bg2.png"; 
			break;
		case 7 :
		case 8 :
		case 9 :
		case 10 :
		case 'es1' :
			bgImg = "textures/envir/backgrounds/bg3.png"; 
			break;
	}
	
	var bg = new createjs.Bitmap(bgImg);
	this.getSprite = function(){return bg;};
}