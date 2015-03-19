var viewerApp = angular.module("viewerApp", []);

viewerApp.controller("mainCtrl", function($scope) {
    $scope.entry = "";
    $scope.entryPossibilities = [];
    $scope.teamOne = "";
    $scope.teamTwo = "";
    $scope.message = "Predictions will appear here after you choose two teams.";

    var seeds = [];
    var allTeams = [];
    d3.json('static/assets/preds.json', function (error, json) {
        if (error) return console.warn(error);
        seeds = json["seeds"];
        var u = {},
            team = "";

        var keys = ["team_one", "team_two"];
        for (var i = 0; i < seeds.length; i++) {
            for (var j = 0; j < keys.length; j++) {
                team = seeds[i][keys[j]];
                if (u.hasOwnProperty(team)) {
                    continue;
                }
                allTeams.push(team);
                u[team] = 1;
            }
        }
    });

    $scope.clearChoices = function () {
        $scope.entryPossibilities = [];
    };

    $scope.updateChoices = function () {
        $scope.entryPossibilities = [];
        if ($scope.entry.length > 0){
            for (var i = 0; i < allTeams.length; i++) {
                var team = allTeams[i];
                if (team.toLowerCase().indexOf($scope.entry.toLowerCase()) > -1 && $scope.teamOne !== team && $scope.teamTwo !== team) {
                    $scope.entryPossibilities.push(team);
                }
            }
        }
    };

    $scope.addTeam = function (team) {
        if ($scope.teamOne.length > 0 && $scope.teamTwo.length > 0){
            $scope.teamOne = team;
            $scope.teamTwo = ""
        } else if ($scope.teamOne.length === 0) {
            $scope.teamOne = team;
        } else if ($scope.teamTwo.length === 0) {
            $scope.teamTwo = team;
        }
        $scope.updateChoices();
        $scope.updateProbabilities();
    };

    $scope.reset = function () {
        $scope.teamOne = "";
        $scope.teamTwo = "";
        $scope.updateChoices();
        $scope.updateProbabilities();
    };

    $scope.updateProbabilities = function () {
        $scope.message = "Predictions will appear here after you choose two teams.";
        if ($scope.teamOne.length > 0 && $scope.teamTwo.length > 0) {
            for (var i = 0; i < seeds.length; i++) {
                var gameData = seeds[i];
                if (gameData["team_one"] == $scope.teamOne || gameData["team_one"] == $scope.teamTwo){
                    if (gameData["team_two"] == $scope.teamOne || gameData["team_two"] == $scope.teamTwo) {
                        var pred = gameData["prediction"];
                        var winner = "";
                        var loser = "";
                        var prefix = "";
                        var suffix = ".";
                        if(pred > 50) {
                            winner = gameData["team_one"];
                            loser = gameData["team_two"];
                        } else {
                            winner = gameData["team_two"];
                            loser = gameData["team_one"];
                            pred = 100 - pred;
                        }
                        if(winner == "(1) Duke"){
                            prefix = "Unfortunately, ";
                        } else if (winner === "(4) North Carolina") {
                            suffix = ". Go Heels!";
                        } else if (winner === "(3) Notre Dame") {
                            suffix = ". Go Irish!";
                        }
                        $scope.message = prefix + winner + " has a " + pred.toFixed(1) + "% chance of beating " + loser + suffix
                    }
                }

            }
        }
    }
});