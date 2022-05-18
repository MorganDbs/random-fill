import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Password from "./Password";
import FindUser from "./FindUser";
import RandomFill from "./RandomFill";

export default () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [puuid, setPuuid] = useState("");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newPuuid = localStorage.getItem("lol-puuid");
    setPuuid(newPuuid);
    if (!newPuuid && connected) {
      navigate("/find-user");
    }
  }, [connected]);

  useEffect(() => {
    if (
      puuid &&
      puuid.length &&
      location.pathname !== "/random-fill" &&
      connected
    ) {
      navigate("/random-fill");
    }
  }, [puuid, connected]);

  useEffect(() => {
    if (!connected) {
      navigate("/password");
    }
  }, [connected]);

  const newSummonerName = () => {
    localStorage.setItem("lol-puuid", null);
    setPuuid("");
    navigate("/find-user");
  };

  return (
    <Routes>
      <Route
        path="/password"
        element={<Password setConnected={setConnected} />}
      />
      <Route path="/find-user" element={<FindUser setPuuid={setPuuid} />} />
      <Route
        path="/random-fill"
        element={<RandomFill puuid={puuid} newSummonerName={newSummonerName} />}
      />
    </Routes>
  );
};
