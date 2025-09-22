const express = require('express');
const sql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config()

const app = express();
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173"
}));

const db = sql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


app.get('/products', async (req, res) => {

    db.query('SELECT * FROM products', (err, result) => {
        if (err) return res.status(500).json({
            error: "Database Error"
        });

        res.json(result);
    })



})




app.listen(5000, () => console.log('app is listening'))