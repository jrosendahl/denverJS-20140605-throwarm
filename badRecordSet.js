function getSeasonRounds(seasonID, callback) {
	//test = seasonTest.js
	var selQ = 'select SeasonID, Rounds.RoundID, RoundName, GameID, FieldID, GameDateTime, HomeTeamID, AwayTeamID ' + 
		'from Rounds ' + 
		'left Join Games on Games.RoundID = Rounds.RoundID ' + 
		'Where SeasonID = ? ' + 
		'Order By Rounds.SortOrder';
	pool.getConnection(function (err, connection) {
		if(err) {
			callback(err);
			return false;
		}
		connection.query(selQ,seasonID, function(err,results) {
			if(err) {
				connection.release();
				callback(err);
			}
			else {
				var rounds = [];
				for(var i =0; i < results.length; i++) {
					var roundSet = false;
					var gameInfo = {};
					gameInfo.GameID = results[i].GameID;
					gameInfo.FieldID = results[i].FieldID;
					gameInfo.GameDateTime = results[i].GameDateTime;
					gameInfo.HomeTeamID = results[i].HomeTeamID;
					gameInfo.AwayTeamID = results[i].AwayTeamID;
					for(var j=0;j < rounds.length; j ++) {
						if(rounds[j].RoundID == results[i].RoundID) {
							rounds[j].games.push(gameInfo);
							roundSet = true;
						}
					}
					if(!roundSet) {
						var roundsInfo = {};
						roundsInfo.RoundID = results[i].RoundID;
						roundsInfo.RoundName = results[i].RoundName;
						roundsInfo.games = [];
						roundsInfo.games.push(gameInfo);
						rounds.push(roundsInfo);
					}

				}
				connection.release();
				callback(null,rounds);
			}
		});
	});

}