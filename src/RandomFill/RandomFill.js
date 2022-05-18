import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

const listTeamPositions = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];

const getMultipleRandom = (num) => {
  const shuffled = [...listTeamPositions].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
};

const getRoleName = (roleName) => {
  if (roleName === "UTILITY") {
    return "SUPPORT";
  }

  if (roleName === "BOTTOM") {
    return "ADC";
  }

  return roleName;
};

export default ({ puuid, newSummonerName }) => {
  const [firstRole, setFirstRole] = useState();
  const [secondRole, setSecondRole] = useState();
  const [firstRoleChamp, setFirstRoleChamp] = useState("");
  const [secondRoleChamp, setSecondRoleChamp] = useState("");
  const [gameId, setGameId] = useState(1);

  const fetch = (numberToFetch) => {
    axios
      .get(
        `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
        {
          params: {
            api_key: process.env.REACT_APP_APIKEY,
            count: numberToFetch,
          },
        }
      )
      .then(({ data }) => {
        return data[numberToFetch - 1];
      })
      .then((id) => {
        axios
          .get(`https://europe.api.riotgames.com/lol/match/v5/matches/${id}`, {
            params: {
              api_key: process.env.REACT_APP_APIKEY,
            },
          })
          .then(({ data }) => {
            let firstRoleLastPlayer;
            let secondRoleLastPlayer;
            const allyTeamId = data.info.participants.find(
              (p) => p.puuid === puuid
            ).teamId;
            const enemyTeamId = allyTeamId === 100 ? 200 : 100;

            data.info.participants.forEach((p) => {
              if (p.teamId === enemyTeamId) {
                if (p.teamPosition === firstRole) {
                  firstRoleLastPlayer = p;
                }
                if (p.teamPosition === secondRole) {
                  secondRoleLastPlayer = p;
                }
              }
            });

            setFirstRoleChamp(firstRoleLastPlayer.championName);
            setSecondRoleChamp(secondRoleLastPlayer.championName);
          });
      });
  };

  useEffect(() => {
    if (puuid && puuid.length > 0 && firstRole && secondRole) {
      fetch(1);
    }
  }, [puuid, secondRole, firstRole]);

  const handleOnClick = () => {
    const [newFirstRole, newSecondRole] = getMultipleRandom(2);
    setFirstRole(newFirstRole);
    setSecondRole(newSecondRole);
    setGameId(1);
  };

  const handlePrevious = () => {
    setGameId(gameId + 1);
    fetch(gameId + 1);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div>
        <Button onClick={handleOnClick} variant="contained">
          Random
        </Button>
        {firstRoleChamp && secondRoleChamp && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handlePrevious}
            style={{ marginLeft: "10px" }}
          >
            Previous Game
          </Button>
        )}

        <Button style={{ marginLeft: "10px" }} onClick={newSummonerName}>
          New summoner name
        </Button>
      </div>

      <div style={{ paddingTop: "10px", display: "flex" }}>
        {firstRoleChamp && (
          <div style={{ width: "500px", paddingRight: "10px" }}>
            <img
              style={{ width: "100%" }}
              src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${firstRoleChamp}_0.jpg`}
            />
            {getRoleName(firstRole)} | {firstRoleChamp}
          </div>
        )}
        {secondRoleChamp && (
          <div style={{ width: "500px", paddingLeft: "10px" }}>
            <img
              style={{ width: "100%" }}
              src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${secondRoleChamp}_0.jpg`}
            />
            {getRoleName(secondRole)} | {secondRoleChamp}
          </div>
        )}
      </div>
    </div>
  );
};
