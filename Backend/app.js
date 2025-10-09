const express = require('express');
const sql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
require('dotenv').config()
const cookieParser = require("cookie-parser")
const axios = require("axios");
const multer = require('multer');
const path = require("path");
const fs = require('fs')
if (!fs.existsSync("uploads/products")) {
    fs.mkdirSync("uploads/products", {
        recursive: true
    });
}


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use('/uploads', express.static('uploads'));



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/products");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    },
});
const upload = multer({
    storage
});


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

    if (!username || !email || !password) return res.status(400).json({
        error: "All fields required"
    });

    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({

            error: "Password must be at least 8 characters long and contain at least one special character (!@#$%^&*)"
        });
    }

    const role = "user"

    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
        'INSERT INTO users (name, email, password,role) VALUES (?, ?, ?,?)',
        [username, email, hashedPassword, role],
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
        products.id AS product_id, products.name, products.price,
        JSON_UNQUOTE(JSON_EXTRACT(products.images, '$[0]')) AS image,
        products.category_id
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



// Payment Gateway


async function getAccessToken() {
    try {
        const res = await axios.get(
            "https://ipguat.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken", {
                params: {
                    MERCHANT_ID: "102",
                    SECURED_KEY: "zWHjBp2AlttNu1sK"
                }
            }
        );
        console.log(res.data)
        return res.data.ACCESS_TOKEN;

    } catch (err) {
        console.error("Error getting token:", err.response.data || err.message);
        return null;
    }
}



app.get("/get-token", async (req, res) => {
    try {
        const token = await getAccessToken();
        if (!token) {
            return res.status(500).json({
                error: "Token generation failed"
            });
        }
        res.json({
            token
        });
    } catch (error) {
        console.error("Error generating token:", error.message);
        res.status(500).json({
            error: "Server error"
        });
    }
});




app.post('/orders', (req, res) => {
    const {
        user,
        paymentMethod,
        total,
        items
    } = req.body;

    console.log(req.body);

    if (!user || !paymentMethod || !total || !items) {
        return res.status(400).json({
            message: "Missing required fields"
        });
    }

    // Start transaction
    db.beginTransaction((err) => {
        if (err) {
            console.error("Transaction Error:", err);
            return res.status(500).json({
                message: "Transaction error"
            });
        }

        // Insert into orders
        const orderQuery = `
            INSERT INTO orders 
            (user_name, email, address, city, postal_code, payment_method, total_amount)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(orderQuery, [
            user.fullName,
            user.email,
            user.address,
            user.city,
            user.postalCode,
            paymentMethod,
            total
        ], (err, orderResult) => {
            if (err) {
                return db.rollback(() => {
                    console.error("Order Insert Error:", err);
                    res.status(500).json({
                        message: "Error placing order"
                    });
                });
            }

            const orderId = orderResult.insertId;

            // Insert items
            const itemQuery = `
                INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
                VALUES ?
            `;

            const itemValues = items.map(item => [
                orderId,
                item.product_id,
                item.name,
                item.quantity,
                item.price
            ]);

            db.query(itemQuery, [itemValues], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error("Order Items Insert Error:", err);
                        res.status(500).json({
                            message: "Error saving order items"
                        });
                    });
                }

                // Commit
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Commit Error:", err);
                            res.status(500).json({
                                message: "Commit failed"
                            });
                        });
                    }

                    res.json({
                        success: true,
                        message: "Order placed successfully"
                    });
                });
            });
        });
    });
});







// admin panel work



app.post('/addproduct', upload.array("images", 5), (req, res) => {
    try {
        const {
            productName,
            category,
            subcategory,
            price,
            description,
            quantity
        } = req.body;

        if (!productName || !category || !subcategory || !price || !description || !quantity) {
            return res.status(400).json({
                error: 'Please fill all required fields'
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                error: 'Please upload at least one image'
            });
        }

        const imagePaths = req.files.map(file => `/uploads/products/${file.filename}`);

        const sql = `
      INSERT INTO products 
      (name, price, subcategory_id, description, quantity, images,category_id) 
      VALUES (?, ?, ?, ?, ?, ?,?)
    `;

        const values = [
            productName,
            price,
            subcategory,
            description,
            quantity,
            JSON.stringify(imagePaths),
            category
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({
                    error: "Database insert failed"
                });
            }
            res.status(200).json({
                message: "Product added successfully",
                productId: result.insertId,
            });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({
            error: 'Something went wrong'
        });
    }
});





// order details api



app.get('/ordersplaced', (req, res) => {
    db.query('SELECT * FROM orders', (err, result) => {
        if (err) {
            return res.status(400).json({
                error: "No orders to display"
            });
        }
        res.status(200).json(result);
    });
});



// update orders

app.put('/ordersplaced/:id', (req, res) => {
    const orderId = req.params.id;
    const {
        order_status
    } = req.body;

    const sql = 'UPDATE orders SET order_status = ? WHERE order_id = ?';

    db.query(sql, [order_status, orderId], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Error updating order status');
        }
        res.send('Order status updated successfully');
    });
});


// product edit 

// Edit product API
app.put('/editproduct/:id', upload.array("images", 5), (req, res) => {
    const {
        id
    } = req.params;
    const {
        productName,
        category,
        subcategory,
        price,
        description,
        quantity
    } = req.body;

    if (!productName || !category || !subcategory || !price || !description || !quantity) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    // Handle uploaded images
    let imagePaths = null;
    if (req.files && req.files.length > 0) {
        imagePaths = JSON.stringify(
            req.files.map(file => `/uploads/products/${file.filename}`)
        );
    }

    // Build SQL query dynamically
    let sql = `
        UPDATE products
        SET name = ?, price = ?, subcategory_id = ?, description = ?, quantity = ?, category_id = ?
    `;
    const values = [productName, price, subcategory, description, quantity, category];

    if (imagePaths) {
        sql += `, images = ?`;
        values.push(imagePaths);
    }

    sql += ` WHERE id = ?`;
    values.push(id);

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating product:", err);
            return res.status(500).json({
                message: "Error updating product"
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.json({
            message: "Product updated successfully"
        });
    });
});




//delete api

// Delete product API
app.delete('/delproduct/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({
        error: "Invalid product ID"
    });

    // Step 1: delete product from cart first
    db.query('DELETE FROM cart WHERE product_id = ?', [id], (err) => {
        if (err) {
            console.error("Error deleting from cart:", err);
            return res.status(500).json({
                error: "Failed to remove product from cart"
            });
        }

        // Step 2: delete from products
        db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error("Error deleting product:", err);
                return res.status(500).json({
                    error: "Failed to delete product"
                });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }
            res.status(200).json({
                message: "Product deleted successfully"
            });
        });
    });
});


// users display


app.get('/users', (req, res) => {

    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            return res.status(400).json({
                error: 'no data found'
            })

        }
        res.status(200).json(result)
    })
})






// Categories

app.get('/categories', (req, res) => {

    db.query('SELECT * FROM categories', (err, result) => {
        if (err) {
            return res.status(400).json("categories not fetched")
        } else {
            return res.status(200).json(result)
        }
    })

})


app.get('/subcategories', (req, res) => {
    const categoryId = req.query.category_id;
    let query = 'SELECT * FROM sub_categories';
    let params = [];

    if (categoryId) {
        query += ' WHERE category_id = ?';
        params.push(categoryId);
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({
            error: 'DB error'
        });
        res.json(results);
    });
});






app.listen(5000, () => console.log('app is listening'))