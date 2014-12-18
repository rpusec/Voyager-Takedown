function hurtEnemy()
{
	var healthBar = this.getHealthBar();
	healthBar.removeHP();
	
	if(healthBar.getCurrentHealth() == 0 || enemyOneBulletDeath)
		this.setDeath();
}

function removeEnemy()
{
	this.removeEnemyBehavior();
	stage.removeChild(this.getSprite());
	enemies.splice($.inArray(this, enemies), 1);
}

function shootFromDirections(targetEnemy, chosenDirs, bulletType)
{
	var mainX = targetEnemy.getSprite().x + targetEnemy.getSprite().getBounds().width/2;
	var mainY = targetEnemy.getSprite().y + targetEnemy.getSprite().getBounds().height/2;
	var pointer = 500;
	var dirToApply = [];
			
	chosenDirs.forEach(function(dir){
		switch(dir)
		{
		case "up" : dirToApply.push([mainX, mainY-pointer]); break;
		case "down" : dirToApply.push([mainX, mainY+pointer]); break;
		case "left" : dirToApply.push([mainX-pointer, mainY]); break;
		case "right" : dirToApply.push([mainX+pointer, mainY]); break;
		case "up left" : dirToApply.push([mainX-pointer, mainY-pointer]); break;
		case "up right" : dirToApply.push([mainX+pointer, mainY-pointer]); break;
		case "down left" : dirToApply.push([mainX-pointer, mainY+pointer]); break;
		case "down right" : dirToApply.push([mainX+pointer, mainY+pointer]); break;
		}
	});
	
	for(var i = 0; i < dirToApply.length; i++)
	{
		createBullet(mainX, 
			mainY, 
			dirToApply[i][0], 
			dirToApply[i][1], 
			bulletType,
			null);
	}
}