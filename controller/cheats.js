function lvlskip(lvlNum)
{
	currentLevel = lvlNum;
	proceedToNextLevel(false);
	console.log("Skipped to level " + lvlNum + "!");
}

function gimmeAllKeys()
{
	var keyRed = new KeyCard(RED_KEY, 0, 0); 
	var keyBlue = new KeyCard(BLUE_KEY, 0, 0); 
	var keyYellow = new KeyCard(YELLOW_KEY, 0, 0); 
	
	pickKey(keyRed);
	pickKey(keyBlue);
	pickKey(keyYellow);
	
	console.log("You have all of the keys!");
}

function godmode()
{
	if(!player.vulnerability)
	{
		player.vulnerability = true;
		console.log("Godmode on!");
	}
	else
	{
		player.vulnerability = false;
		console.log("Godmode off!");
	}
}

function gimmeNoClip()
{
	noclip = !noclip;

	if(noclip)
		console.log("Noclip on!");
	else
		console.log("Noclip off!");
}

function oneBulletDeath()
{
	enemyOneBulletDeath = !enemyOneBulletDeath;

	if(enemyOneBulletDeath)
		console.log("EnemyOneBulletDeath on!");
	else
		console.log("EnemyOneBulletDeath off!");
}