import axios from "axios";

const instance = axios.create({
  params: {
    api_key: "RGAPI-7a3b4c01-7205-4e48-88c8-b9364062bf28",
  },
});

export default instance;
