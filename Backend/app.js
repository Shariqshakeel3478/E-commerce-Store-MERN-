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


// Signup
app.post('/signup', async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;
    console.log('allmydata', req.body);
    if (!username || !email || !password) return res.status(400).json({
        error: "All fields required"
    });

    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({

            error: "Password must be at least 8 characters long and contain at least one special character (!@#$%^&*)"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        (err, result) => {
            if (err) {
                console.error("DB Error Details:", err);
                return res.status(500).json({
                    error: "Database error"
                });
            }
            res.json({
                message: "User registered successfully"
            });
        }
    );

});


//login

app.post('/login', (req, res) => {
    const {
        email,
        password
    } = req.body;
    if (!email || !password) return res.status(400).json({
        error: "All fields required"
    });

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({
            error: "Database error"
        });
        if (results.length === 0) return res.status(400).json({
            error: "User not found"
        });

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({
            error: "Wrong password"
        });

        const token = jwt.sign({
            id: user.id,
            name: user.name
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });


        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }

        });
    });
});










// Products api
app.get('/products', async (req, res) => {

    db.query('SELECT * FROM products', (err, result) => {
        if (err) return res.status(500).json({
            error: "Database Error"
        });

        res.json(result);
    })



})




app.listen(5000, () => console.log('app is listening'))