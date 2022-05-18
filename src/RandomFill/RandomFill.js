import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const listTeamPositions = ["TOP", "JUNGLE", "MIDDLE", "BOTTOM", "UTILITY"];

const getMultipleRandom = (num) => {
  const shuffled = [...listTeamPositions].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
};

export default ({ puuid }) => {
  const [firstRole, setFirstRole] = useState();
  const [secondRole, setSecondRole] = useState();
  const [firstRoleChamp, setFirstRoleChamp] = useState("");
  const [secondRoleChamp, setSecondRoleChamp] = useState("");

  useEffect(() => {
    if (puuid && puuid.length > 0 && firstRole && secondRole) {
      axios
        .get(
          `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`,
          {
            params: {
              api_key: process.env.REACT_APP_APIKEY,
              count: 1,
            },
            headers: {
              "Access-Control-Allow-Origin": "https://random-fill.onrender.com",
              "Access-Control-Allow-Methods": "POST, GET",
              "Access-Control-Allow-Headers":
                "Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods, X-Requested-With",
            },
          }
        )
        .then(({ data }) => {
          return data[0];
        })
        .then((id) => {
          axios
            .get(
              `https://europe.api.riotgames.com/lol/match/v5/matches/${id}`,
              {
                params: {
                  api_key: process.env.REACT_APP_APIKEY,
                  count: 1,
                },
                headers: {
                  "Access-Control-Allow-Origin":
                    "https://random-fill.onrender.com",
                  "Access-Control-Allow-Methods": "POST, GET",
                  "Access-Control-Allow-Headers":
                    "Content-Type, Access-Control-Allow-Headers, Authorization, Access-Control-Allow-Methods, X-Requested-With",
                },
              }
            )
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
    }
  }, [puuid, secondRole, firstRole]);

  const handleOnClick = () => {
    const [newFirstRole, newSecondRole] = getMultipleRandom(2);
    setFirstRole(newFirstRole);
    setSecondRole(newSecondRole);
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
      <Typography variant="h2">Random</Typography>
      <Button onClick={handleOnClick} variant="contained">
        Random
      </Button>

      <div style={{ paddingTop: "10px" }}>
        {firstRoleChamp && (
          <div style={{ width: "500px" }}>
            <img
              style={{ width: "100%" }}
              src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${firstRoleChamp}_0.jpg`}
            />
            {firstRole} | {firstRoleChamp}
          </div>
        )}
        {secondRoleChamp && (
          <div style={{ width: "500px" }}>
            <img
              style={{ width: "100%" }}
              src={`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${secondRoleChamp}_0.jpg`}
            />
            {secondRole} | {secondRoleChamp}
          </div>
        )}
      </div>
    </div>
  );
};
