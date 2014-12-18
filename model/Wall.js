function Wall(x, y, textureId)
{
	var textureImg = null;
	
	//we're referencing the currentLevel variable to 
	//get the specified texture
	switch(textureId)
	{
		case 0 :
		case 1 :
		case 2 :
		case 3 :
		case 'es4' :
		case 'es5' :
			textureImg = "textures/envir/floors/floor1.png"; 
			break;
		case 4 :
		case 5 :
		case 6 :
		case 'es2' :
		case 'es3' :
			textureImg = "textures/envir/floors/floor2.png"; 
			break;
		case 7 :
		case 8 :
		case 9 :
		case 10 :
		case 'es1' :
			textureImg = "textures/envir/floors/floor3.png"; 
			break;
	}
	
	var texture = new createjs.Bitmap(textureImg);
	texture.x = x;
	texture.y = y;
	
	texture.visible = false;
	
	this.getSprite = function() { return texture; };
}