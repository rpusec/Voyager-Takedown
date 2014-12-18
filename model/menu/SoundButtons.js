function SoundToggleBtn(x, y, type)
{
	if(type != "music" && type != "sound")
		return;

	var container = new createjs.Container();
	var square = new createjs.Shape();
	square.soundType = type;
	
	createSquareGraphics(square);

	container.setBounds(0, 0, square.getBounds().width, square.getBounds().height);
	container.x = x;
	container.y = y;

	var sprite = createSoundIcon(type);

	this.getSprite = function(){return sprite;};
	this.onTS = onToggleSound;

	square.spriteReference = this.getSprite();

	square.addEventListener("click", this.onTS);

	container.addChild(square, sprite);
	stage.addChild(container);

	this.deleteBtn = function(){stage.removeChild(container);};
}

function onToggleSound(e)
{
	if(typeof e.target.soundType === 'undefined')
		return;

	if(e.target.soundType == "music")
	{
		if(musicOn)
		{
			e.target.spriteReference.gotoAndPlay("musicOff");
			bgMusic != null ? bgMusic.pause() : '';
		}
		else
		{
			e.target.spriteReference.gotoAndPlay("musicOn");
			bgMusic != null ? bgMusic.resume() : '';
		}

		musicOn = !musicOn;
	}
	else if(e.target.soundType == "sound")
	{
		if(soundOn)
			e.target.spriteReference.gotoAndPlay("soundOff");
		else
			e.target.spriteReference.gotoAndPlay("soundOn");

		soundOn = !soundOn;
	}
}

function createSoundIcon(soundType)
{
	var ss = new createjs.SpriteSheet({
		"images":['textures/misc/music_icon.png'],
		"frames":{
			"count": 4,
			"width" : 19,
			"height" : 18,
			"regX": 0,
			"regY": 0
		},
		"animations":{
			"musicOn": [0],
			"musicOff": [1],
			"soundOn": [2],
			"soundOff": [3],
		}
	});

	var sprite = new createjs.Sprite(ss, setAppropriateIcon());

	return sprite;

	function setAppropriateIcon()
	{
		if(soundType == "music")
		{
			if(musicOn)
				return "musicOn";
			else
				return "musicOff"; 
		}
		else if(soundType == "sound")
		{
			if(soundOn)
				return "soundOn";
			else
				return "soundOff"; 
		}
	}
}

function createSquareGraphics(squareShape)
{
	squareShape.graphics.beginStroke("#6cccff").beginFill("#000").drawRect(0, 0, 20, 20).endFill().endStroke();
	squareShape.setBounds(0, 0, 20, 20);
}