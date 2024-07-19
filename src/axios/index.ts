import axios from 'axios'

const  BASE_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GOOGLE_KEY}`;

export const api_client = axios.create({

    baseURL : BASE_URL

})