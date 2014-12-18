var manifest;
var preload;
var progressText;
var loadedText;

function setupPreloadAttributes()
{
	progressText = new createjs.Text("0%", "20px Arial", "#fff");
	progressText.x = stage.canvas.width/2;
	progressText.y = stage.canvas.height/2 + 10;
	progressText.textAlign = 'center';

	loadedText = new createjs.Text("Loaded: ", "15px Arial", "#fff");
	loadedText.x = stage.canvas.width/2;
	loadedText.y = stage.canvas.height/2 - 10;
	loadedText.textAlign = 'center';

	stage.addChild(progressText, loadedText);
	stage.update();
}

function setupManifest()
{
	manifest = [{
		src: "textures/player/player.png",
		id: "Player graphics"
	}, {
		src: "textures/player/fire.png",
		id: "Player's fire texture"
	}, {
		src: "textures/player/bullet.png",
		id: "Player Bullet texture"
	}, {
		src: "textures/player/crosshair.png",
		id: "Player crosshair texture"
	}, {
		src: "textures/enemies/turret/bullet.png",
		id: "Turret Bullet texture"
	}, {
		src: "textures/envir/destination.png",
		id: "Destination texture"
	}, {
		src: "textures/envir/endLevel.png",
		id: "EndLevel texture"
	}, {
		src: "textures/envir/flow.png",
		id: "Flow texture"
	}, {
		src: "textures/envir/teleporter.png",
		id: "Teleporter texture"
	}, {
		src: "textures/envir/keys/keycards.png",
		id: "KeyCard texture"
	}, {
		src: "textures/envir/keys/keyhud.png",
		id: "KeyHud texture"
	}, {
		src: "textures/envir/keys/keyinputs.png",
		id: "KeyInputs texture"
	}, {
		src: "textures/envir/keys/keywalls.png",
		id: "KeyWalls texture"
	}, {
		src: "textures/envir/healthpoint.png",
		id: "HealthPoint texture"
	}, {
		src: "textures/enemies/turret/body.png",
		id: "Turret body texture"
	}, {
		src: "textures/enemies/turret/gun.png",
		id: "Turret gun texture"
	}, {
		src: "textures/enemies/termiblaster/termiblaster.png",
		id: "Termiblaster texture"
	}, {
		src: "textures/enemies/termiblaster/bullet.png",
		id: "Termiblaster bullet texture"
	}, {
		src: "textures/enemies/blacksphere/blacksphere.png",
		id: "Blacksphere graphics texture"
	}, {
		src: "textures/enemies/blacksphere/bullet.png",
		id: "Blacksphere bullet texture"
	}, {
		src: "textures/enemies/flamethrower/flamethrower.png",
		id: "Flamethrower body texture"
	}, {
		src: "textures/enemies/flamethrower/bullet.png",
		id: "Flamethrower bullet texture"
	}, {
		src: "textures/enemies/teleporto/teleporto.png",
		id: "Teleporto graphics texture"
	}, {
		src: "textures/enemies/boss/boss.png",
		id: "Boss graphics texture"
	}, {
		src: "textures/enemies/boss/turretGun.png",
		id: "Boss turretGun graphics texture"
	}, {
		src: "textures/enemies/boss/rocketLauncher.png",
		id: "Boss rocketLauncher graphics texture"
	}, {
		src: "textures/enemies/boss/vulnerability.png",
		id: "Boss vulnerability graphics texture"
	}, {
		src: "textures/misc/help_controls.png",
		id: "Help controls texture"
	}, {
		src: "textures/envir/backgrounds/menubg.png",
		id: "Menu background"
	}, {
		src: "textures/misc/destroyed_boss.png",
		id: "Boss destroyed texture"
	}, {
		src: "textures/misc/music_icon.png",
		id: "Sound toggle button graphics"
	}, {
		src: "textures/detail/large_comp.png",
		id: "Large Computer graphics texture"
	}, {
		src: "textures/detail/lights.png",
		id: "Lights graphics texture"
	}, {
		src: "textures/detail/mini_comp.png",
		id: "Mini Computer texture"
	}, {
		src: "textures/detail/pole_chains.png",
		id: "Pole chains texture"
	}, {
		src: "textures/detail/pole_normal.png",
		id: "Pole normal texture"
	}, {
		src: "textures/detail/power_beam.png",
		id: "Power beam texture"
	}, {
		src: GUN_RICOCHET_SOUND,
		id: "Ricochet gun sound",
		sound: true
	}, {
		src: BLASTER_SOUND,
		id: "Blaster gun sound",
		sound: true
	}, {
		src: TURRET_SOUND,
		id: "Turret gun sound",
		sound: true
	}, {
		src: EXPLOSION_SOUND,
		id: "Explosion gun sound",
		sound: true
	}, {
		src: ROCKET_SOUND,
		id: "Rocket sound",
		sound: true
	}, {
		src: FIREBALL_SOUND,
		id: "Fireball sound",
		sound: true
	}, {
		src: TARGETSHOT_SOUND,
		id: "Targetshot sound",
		sound: true
	}, {
		src: TELEPORT_SOUND,
		id: "Teleport sound",
		sound: true
	}, {
		src: ONFLOW_SOUND,
		id: "Onflow sound",
		sound: true
	}, {
		src: KEY_SOUND,
		id: "Key sound",
		sound: true
	}];

	for(var i = 1; i <= 3; i++)
	{
		manifest.push({src: "textures/envir/floors/floor" + i + ".png", id: "Wall texture #" + i});
		manifest.push({src: "textures/envir/backgrounds/bg" + i + ".png", id: "Background texture #" + i});
	}
	
	for(var i = 1; i <= 9; i++)
		manifest.push({src: "textures/misc/sgLvl" + i + ".png", id: "Start game thumbnail #" + i});

	for(var i = 1; i <= 6; i++)
		manifest.push({src: "audio/music/song" + i + ".mp3", id: "ost" + i, sound: true});
}

function startPreload()
{
	preload = new createjs.LoadQueue(true);
	preload.installPlugin(createjs.Sound);
	preload.on("fileload", handleFileLoad);
	preload.on("progress", handleFileProgress);
	preload.on("complete", loadComplete);
	preload.on("error", loadError);
	preload.loadManifest(manifest);
}

function handleFileLoad(e)
{
	loadedText.text = "Loaded: " + e.item.id;
	stage.update();
}

function handleFileProgress(e)
{
	progressText.text = (preload.progress*100|0) + "%";
	stage.update();
}

function loadError(e) {
	console.log("Error: " + e.text);
}

function loadComplete(event) {
	resetEnvirArr();
	mainMenu = new MainMenu();
	startGameUpdating();
	stage.removeChild(progressText);
	stage.removeChild(loadedText);
}