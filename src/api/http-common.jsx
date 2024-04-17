import axios from "axios";
// const BASE_URL = 'http://localhost:8080/API'
const BASE_URL = 'http://103.143.207.183:8082/API'

// const BASE_URL = 'http://192.168.1.104:8080/API' //computer host
// const BASE_URL = 'https://attendance-8iks.onrender.com/API' //deploy host



export default axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type":"application/json" 
    }
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});