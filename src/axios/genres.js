import axios from "axios";

// Genrerelaterade API-anrop.
export default function genres() {

    const client = axios.create({
        baseURL: "https://dt193ggamestorebackend-production.up.railway.app/genre",
        withCredentials: true
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Hämta genrer.
    async function get() {
        const res = await client.get('/genres', config);
        return res.data;
    }

    // Lägg till ny genre.
    async function post(name) {
        const res = await client.post('/genre', name, config);
        return res.data;
    }

    // Ta bort genre.
    async function remove(id) {
        const res = await client.delete(`/genres?id=${id}`, config);
        return res.data;
    }

    // Uppdatera genre.
    async function put(id, name) {
        const res = await client.put(`/genres?id=${id}`, name, config);
        return res.data;
    }

    return { get, post, remove, put };
}