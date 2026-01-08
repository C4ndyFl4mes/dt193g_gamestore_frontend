import axios from "axios";


export default function authentication() {

    const client = axios.create({
        baseURL: "https://dt193ggamestorebackend-production.up.railway.app",
        withCredentials: true
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    async function login(user) {
        const res = await client.post('/user/login', user, config);
        return res;
    }

    async function logout() {
        const res = await client.post('/user/logout', config);
        return res;
    }

    async function is_user_logged_in() {
        const res = await client.post('/user/check', config);
        return res;
    }

    return { login, logout, is_user_logged_in };
}