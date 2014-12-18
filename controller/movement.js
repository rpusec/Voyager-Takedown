$(document).on("ready", function(){
	$(document).on("keydown", function(e){
		if(player == null)	
			return;
			
		if(!stageCompleted && !player.isDead())
		{
			if(e.which == W || e.which == UP)
				moveUp = true;
			if(e.which == S || e.which == DOWN)
				moveDown = true;
			if(e.which == A || e.which == LEFT)
				moveLeft = true;
			if(e.which == D || e.which == RIGHT)
				moveRight = true;
		}
	});
	
	$(document).on("keyup", function(e){
		if(player == null)	
			return;
			
		if(!stageCompleted && !player.isDead())
		{
			if(e.which == W || e.which == UP)
			{
				moveUp = false;
				player.setFireVisibility("up", false);
			}
			if(e.which == S || e.which == DOWN)
			{
				moveDown = false;
				player.setFireVisibility("down", false);
			}
			if(e.which == A || e.which == LEFT)
			{
				moveLeft = false;
				player.setFireVisibility("left", false);
			}
			if(e.which == D || e.which == RIGHT)
			{
				moveRight = false;
				player.setFireVisibility("right", false);
			}
			
			if(player != null)
				if(player.getSprite().currentAnimation != "telep")
					player.changePos(player.IDLE);
		}
	});
	
	$(document).on("mousemove", function(e){
		mousePosition.x = e.pageX;
		mousePosition.y = e.pageY;
	});
});