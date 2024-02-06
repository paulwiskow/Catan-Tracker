import react from "react";
import { nanoid } from "nanoid";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack,
} from "victory"; // https://commerce.nearform.com/open-source/victory/docs/
import "./style/App.css";
import "./style/dice.css";
import DieButton from "./components/DieButton";
import Player from "./components/Player";
import Build from "./components/Build";

function App() {
  const [players, setPlayers] = react.useState(() => createPlayerArray());
  const [toggle, setToggle] = react.useState(true);

  const style_main = toggle ? { backgroundColor: "#6f746f8f" } : {};
  const style_graph = !toggle ? { backgroundColor: "#6f746f8f" } : {};

  function createPlayerArray() {
    const temp = [];
    for (let i = 0; i < 4; i++) {
      temp.push(createPlayer(i + 1));
    }

    return temp;
  }

  function createPlayer(num) {
    return {
      playerNum: num,
      name: `Player ${num}`,
      resourcesGained: [0, 0, 0, 0, 0], // [wood, brick, sheep, wheat, ore]
      resourcesBlocked: [0, 0, 0, 0, 0], // same format as gained, will use this later
      buildings: [null], // Building objects, can upgrade into city, keeps track of resources and numbers
    };
  }

  function handlePlayerState(num, newBuildings) {
    setPlayers((oldPlayers) =>
      oldPlayers.map((player) => {
        if (player.playerNum === num) {
          return { ...player, buildings: newBuildings };
        }

        return player;
      })
    );
  }

  function updateResourcesGain(num, newResGained) {
	setPlayers((oldPlayers) =>
      oldPlayers.map((player) => {
        if (player.playerNum === num) {
          return { ...player, resourcesGained: newResGained };
        }

        return player;
      })
    );
  }

  function createNewBuilding(playerIndex) {
    const tileArray = [createNewTile(0), createNewTile(1), createNewTile(2)];

    let newBuilding = {
      index: players[playerIndex].buildings.length - 1,
      isCity: false,
      tiles: tileArray,
    };
    let tempArr = Array.from(players[playerIndex].buildings);
    tempArr[tempArr.length - 1] = newBuilding;
    if (tempArr.length !== 9) {
      tempArr.push(null);
    }

    handlePlayerState(playerIndex + 1, tempArr);
  }

  function createNewTile(index) {
    return {
      resource: "desert",
      diceRoll: -1,
      index: index,
    };
  }

  function updateBuilding(building, playerIndex) {
    let tempArr = Array.from(players[playerIndex].buildings);
    tempArr[building.index] = building;
    handlePlayerState(playerIndex + 1, tempArr);
  }

  function changeName(newName, num) {
    setPlayers((oldPlayers) =>
      oldPlayers.map((player) => {
        if (player.playerNum === num) {
          return Object.assign(player, { name: newName });
        }

        return player;
      })
    );
  }

  const playerComponents = players.map((player) => {
    // console.log("success")
    const index = player.playerNum - 1;
    const buildingComponents = player.buildings.map((building) => {
      return (
        <Build
          object={building}
          create={() => createNewBuilding(index)}
          update={(localBuild) => updateBuilding(localBuild, index)}
        />
      );
    });

    return (
      <Player
        key={nanoid()}
        buildings={buildingComponents}
        num={player.playerNum}
        name={player.name}
        nameChange={(newName, num) => changeName(newName, num)}
      />
    );
  });

  const [tracker, setTracker] = react.useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const dieData = formDiceData();
  const playerResourceData = formPlayerData() // formatted as [wood, brick, sheep, wheat, ore]
  const playerNames = players.map((player) => player.name)

  function formPlayerData() {
	let temp = [[], [], [], [], []]

	for(const element of players) {
		for(let j = 0; j < 5; j++) {
			temp[j].push({ player: element.num, resource: element.resourcesGained[j] })
		}
	}

	console.log(temp)

	return temp
  }

  function formDiceData() {
    let temp = [0, 0]; // Need this for formatting the chart

    for (let i = 0; i < numbers.length; i++) {
      temp.push({ number: numbers[i], frequency: tracker[i] });
    }

    return temp;
  }

  function changeDieValue(num, increase) {
    setTracker((oldTracker) => {
      let newArr = Array.from(oldTracker);
      for (let i = 0; i < oldTracker.length; i++) {
        if (i === num - 2) {
          if (newArr[i] > 0 && !increase) {
            newArr[i] -= 1;
            trackResources(num, false);
          } else if (increase) {
            newArr[i] += 1;
            trackResources(num, true);
          }
          break;
        }
      }
      return newArr;
    });
  }

  function trackResources(dieNum, increment) {
    for (const player of players) {
      for (const building of player.buildings) {
        if (building === null) {
          break;
        } else {
          for (let tile in building.tiles) {
            if (tile.diceRoll === dieNum) {
              if (building.isCity) {
                if (increment) {
                  player.resourcesGained[
                    convertResourceToIndex(tile.resource)
                  ] += 2;
                } else {
                  player.resourcesGained[
                    convertResourceToIndex(tile.resource)
                  ] -= 2;
                }
              } else {
                if (increment) {
                  player.resourcesGained[
                    convertResourceToIndex(tile.resource)
                  ] += 1;
                } else {
                  player.resourcesGained[
                    convertResourceToIndex(tile.resource)
                  ] -= 1;
                }
              }

			  console.log(player)
              updateResourcesGain(player.num, player.resourcesGained) // create different function for updating all this IMPORTANT ***********
            }
          }
        }
      }
    }
  }

  function convertResourceToIndex(resource) {
    if (resource === "wood") {
    	return 0;
    } else if (resource === "brick") {
      	return 1;
    } else if (resource === "sheep") {
      	return 2;
    } else if (resource === "wheat") {
      	return 3;
    } else {
      	return 4;
    }
  }

  const dieElements = numbers.map((num) => (
    <DieButton
      key={nanoid()}
      value={num}
      track={tracker[num - 2]}
      increase={() => changeDieValue(num, true)}
    />
  ));

  return (
    <main>
		<h1>IRL Catan Tracker</h1>
		<div className="toggle-container">
			<p
			className="toggle-page-button"
			style={style_main}
			onClick={() => setToggle(true)}
			>
			toggle1
			</p>
			<p
			className="toggle-page-button"
			style={style_graph}
			onClick={() => setToggle(false)}
			>
			toggle2
			</p>
		</div>
		{toggle && (
			<div className="player-edit-container">
			{playerComponents}
			<div className="die-container">
				{dieElements}
				<button className="undo-button">Undo</button>
			</div>
			</div>
		)}

		{!toggle && <div className="graph-container">
			<div className="die-chart-container">
				<VictoryChart domain={{ x: [2, 12] }} domainPadding={{ x: 20}}>
					<VictoryAxis 
						tickFormat={numbers} 
						label="Die" 
						style={{
							axisLabel: {fontSize: 15, padding: 20},
							tickLabels: {fontSize: 10, padding: 5}
						}}
					/> 
					<VictoryAxis 
						dependentAxis 
						tickFormat={(x) => `${x}`} 
						label="Frequency" 
						style={{
							axisLabel: {fontSize: 15, padding: 20},
							tickLabels: {fontSize: 10, padding: 5}
						}}
					/>
					<VictoryBar data={dieData} x="Number" y="frequency" />
				</VictoryChart>
			</div>
			<div className="player-resource-chart-container">
				<VictoryChart>
					<VictoryAxis 
						tickValues={[1, 2, 3, 4]} 
						tickFormat={playerNames} 
						label="Player Names" 
						style={{
							axisLabel: {fontSize: 15, padding: 20},
							tickLabels: {fontSize: 10, padding: 5}
						}}
					/> 
					<VictoryAxis 
						dependentAxis 
						tickFormat={(x) => `${x}`} 
						label="Resources Gained" 
						style={{
							axisLabel: {fontSize: 15, padding: 20},
							tickLabels: {fontSize: 10, padding: 5}
						}}
					/>
					<VictoryStack>
						<VictoryBar data={playerResourceData[0]} x="Player" y="Resources Gained" />
						<VictoryBar data={playerResourceData[1]} x="Player" y="Resources Gained" />
						<VictoryBar data={playerResourceData[2]} x="Player" y="Resources Gained" />
						<VictoryBar data={playerResourceData[3]} x="Player" y="Resources Gained" />
						<VictoryBar data={playerResourceData[4]} x="Player" y="Resources Gained" />
					</VictoryStack>
					
				</VictoryChart>
			</div>
		</div>}
    </main>
  );
}

export default App;
