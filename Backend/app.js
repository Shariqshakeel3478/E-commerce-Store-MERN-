const express = require('express');
const sql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config()
const cookieParser = require("cookie-parser")


const app = express();
app.use(express.json());
app.use(cookieParser())



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
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
            expiresIn: '30m'
        });

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 60 * 1000
        });


        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }

        });
    });
});

const authenticate = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({
        error: "Unauthorized"
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            error: "Invalid token"
        });
    }
};


// authentication check

app.get("/check-auth", (req, res) => {

    res.setHeader("Access-Control-Allow-Credentials", "true");

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            loggedIn: false
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({
            loggedIn: true,
            user: decoded
        });
    } catch (err) {
        res.status(401).json({
            loggedIn: false
        });
    }
});



app.post("/cart/add", authenticate, (req, res) => {
    const userId = req.user.id;

    const {
        productId
    } = req.body;
    console.log("userId:", userId, "productId:", productId);

    db.query(
        "INSERT INTO cart (user_id, product_id,quantity) VALUES (?, ?,1) ON DUPLICATE KEY UPDATE quantity = quantity + ?",
        [userId, productId, 1],
        (err) => {
            if (err) return res.status(500).json({
                error: "DB Error"
            });
            res.json({
                message: "Added to cart"
            });
        }
    );

});

app.put("/cart/update", authenticate, (req, res) => {
    const {
        productId,
        quantity
    } = req.body;
    const userId = req.user.id;

    db.query(
        "UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?",
        [quantity, userId, productId],
        (err, result) => {
            if (err) return res.status(500).json({
                error: "DB Error"
            });
            res.json({
                message: "Cart updated"
            });
        }
    );
});



app.delete("/cart/remove/:productId", authenticate, (req, res) => {
    const userId = req.user.id;
    const productId = req.params.productId;

    db.query(
        "DELETE FROM cart WHERE user_id = ? AND product_id = ?",
        [userId, productId],
        (err, result) => {
            if (err) return res.status(500).json({
                error: "DB Error"
            });
            res.json({
                message: "Item removed from cart"
            });
        }
    );
});




app.get("/cart", authenticate, (req, res) => {

    const userId = req.user.id;
    const query = `
    SELECT cart.id AS cart_id, cart.quantity,
    products.id AS product_id, products.name, products.price, products.image_url, products.category
    FROM cart
    JOIN products ON cart.product_id = products.id
    WHERE cart.user_id = ?;
    `;
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({
            error: "DB Error"
        });

        res.json(results);
        console.log("Cart API userId:", userId);
        console.log("Cart Results:", results);

    });
});



app.post("/logout", authenticate, (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.json({
        message: "Logged out successfully"
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