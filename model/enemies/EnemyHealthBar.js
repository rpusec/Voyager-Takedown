function EnemyHealthBar(entityWidth, healthAmount, strechFor, barHeight)
{
	var healthbarGraphics = new createjs.Shape();
	var currentHealth = healthAmount;
	
	adjustHB();
	
	this.removeHP = function()
	{
		//removing the last HP
		if(currentHealth != 0)
		{
			currentHealth--;
			adjustHB();
		}
	};
	
	function adjustHB()
	{
		healthbarGraphics.graphics.clear();
		healthbarGraphics.graphics.beginFill("#f00").drawRect(0, 0, currentHealth*strechFor, barHeight);
		healthbarGraphics.x = entityWidth/2 - (currentHealth*strechFor)/2;
		healthbarGraphics.alpha = 0.7;
	}
	
	this.getHealthBar = function(){return healthbarGraphics;};
	this.getCurrentHealth = function(){return currentHealth;};
}