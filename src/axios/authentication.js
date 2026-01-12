import axios from "axios";

// Autentiseringsrelaterade API-anrop.
export default function authentication() {

    const client = axios.create({
        baseURL: "https://dt193ggamestorebackend-production.up.railway.app/user",
        withCredentials: true
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Logga in användare.
    async function login(user) {
        const res = await client.post('/login', user, config);
        return res;
    }

    // Logga ut användare.
    async function logout() {
        const res = await client.post('/logout', config);
        return res;
    }

    // Kolla om användare är inloggad.
    async function is_user_logged_in() {
        const res = await client.post('/check', config);
        return res;
    }

    return { login, logout, is_user_logged_in };
}