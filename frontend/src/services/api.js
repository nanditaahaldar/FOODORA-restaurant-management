import axios from "axios";

const API = axios.create({
  baseURL: "https://foodora-restaurant-management.onrender.com/api"
});

export default API;