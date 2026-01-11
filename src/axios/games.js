import axios from "axios";

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

    async function get() {
        const res = await client.get('/products', config);
        return res.data;
    }

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


    return { get, post };
}