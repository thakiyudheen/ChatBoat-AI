import axios from 'axios'

const  BASE_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=AIzaSyDDZHa5M8IPcG93yUIcoRRZnbSTfyyubbM";

export const api_client = axios.create({

    baseURL : BASE_URL

})