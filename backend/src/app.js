import express, { json } from "express";

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Bienvenido a mi servidor');
})

app.get('/golpe', (req, res) => {
    res.send()
})

export default app