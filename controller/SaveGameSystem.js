var saveGameSystem = new SaveGameSystem();

function SaveGameSystem()
{
	var SAVE_GAME_LABEL = 'savegameVTD';

	this.saveGame = function()
	{
		localStorage.setItem(SAVE_GAME_LABEL, currentLevel);
	};
	
	this.deleteGame = function()
	{
		localStorage.removeItem(SAVE_GAME_LABEL);
	};
	
	this.getGame = function()
	{
		if(localStorage.getItem(SAVE_GAME_LABEL) != null)
			return parseInt(localStorage.getItem(SAVE_GAME_LABEL));
		else
			return null;
	};
}