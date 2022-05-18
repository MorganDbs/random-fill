import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "axios";

export default ({ setPuuid }) => {
  const [nameToFind, setNameToFind] = useState("");

  const handleOnChange = (e) => {
    setNameToFind(e.target.value);
  };

  const handleOnClick = () => {
    axios
      .get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${nameToFind}`,
        {
          params: { api_key: process.env.REACT_APP_APIKEY },
          headers: {
            "Access-Control-Allow-Origin": "https://random-fill.onrender.com",
            "Access-Control-Allow-Header": "https://random-fill.onrender.com",
          },
        }
      )
      .then(({ data }) => {
        localStorage.setItem("lol-puuid", data.puuid);
        setPuuid(data.puuid);
      })
      .catch(() => {
        setNameToFind("");
      });
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
      <Typography variant="h2">Username</Typography>
      <TextField value={nameToFind} onChange={handleOnChange} />
      <Button onClick={handleOnClick}>Find</Button>
    </div>
  );
};
