import axios from "axios";

// Spelrelaterade API-anrop.
export default function games() {

    const client = axios.create({
        baseURL: "https://dt193ggamestorebackend-production.up.railway.app/game",
        withCredentials: true
    });

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    // Hämta spel, sorterade efter angivet fält.
    async function get(order) {
        const res = await client.get(`/products?order_by=${order}`, config);
        return res.data;
    }

    // Lägg till nytt spel.
    async function post(fields) {
        const fd = new FormData();
        fd.append('file', fields.image);
        fd.append('title', fields.title);
        fd.append('description', fields.description);
        fd.append('price', String(fields.price));
        fd.append('stock', String(fields.stock));
        fd.append('age_ratingID', String(fields.age_ratingID));
        const genreIds = fields.genres.map(g => g.id);
        fd.append("genres", JSON.stringify(genreIds));
        const res = await client.post('/product', fd);
        return res.data;
    }

    // Ta bort spel.
    async function remove(id) {
        const res = await client.delete(`/products?id=${id}`, config);
        return res.data;
    }

    // Uppdatera spel.
    async function put(id, fields) {
        console.log(fields);
        const fd = new FormData();
        if (fields.image) {
            fd.append('file', fields.image);
        }
        fd.append('title', fields.title);
        fd.append('description', fields.description);
        fd.append('price', String(fields.price));
        fd.append('stock', String(fields.stock));
        fd.append('age_ratingID', String(fields.age_ratingID));
        if (!fields.genres || fields.genres.length === 0) {
            fd.append("genres", JSON.stringify([]));
        } else {
            const genreIds = fields.genres.map(g => g.id);
            fd.append("genres", JSON.stringify(genreIds));
        }
        const res = await client.put(`/products?id=${id}`, fd);
        return res.data;
    }


    return { get, post, remove, put };
}