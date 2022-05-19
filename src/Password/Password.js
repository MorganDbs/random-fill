import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default ({ setConnected }) => {
  const [password, setPassword] = useState("");

  const handleOnClick = () => {
    if (process.env.REACT_APP_PASSWORD === password) {
      setConnected(true);
    }
    setPassword("");
  };

  const handleOnChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <div
      className="pw"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "16px",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography variant="h2">Password</Typography>
        <TextField value={password} onChange={handleOnChange} type="password" />
        <Button onClick={handleOnClick} type="submit">
          Enter
        </Button>
      </div>
    </div>
  );
};
