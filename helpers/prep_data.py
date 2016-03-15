import csv
import json
import os

SEASON = 2016
DIR = os.path.dirname(os.path.abspath(__file__))
TEAMS = os.path.join(DIR, 'Teams.csv')
SEEDS = os.path.join(DIR, 'TourneySeeds.csv')
PREDS = os.path.join(DIR, 'preds.csv')
WRITE = os.path.join(DIR, '..', 'static', 'assets', 'preds.json')

with open(TEAMS, 'r') as buff:
    teams = {row['Team_Id']: row['Team_Name'] for row in csv.DictReader(buff)}

with open(SEEDS, 'r') as buff:
    seeds = {row['Team']: int(row['Seed'][1:3]) for
             row in csv.DictReader(buff) if int(row['Season']) == SEASON}

preds = []
with open(PREDS, 'r') as buff:
    for row in csv.DictReader(buff):
        _, team_one, team_two = row['Id'].split("_")
        preds.append({
            "team_one": "({}) {}".format(seeds[team_one], teams[team_one]),
            "team_two": "({}) {}".format(seeds[team_two], teams[team_two]),
            "prediction": 100 * float(row["Pred"])
        })

with open(WRITE, 'w') as buff:
    json.dump({"seeds": preds}, buff)
