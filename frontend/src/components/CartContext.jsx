import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    // cart API call
    useEffect(() => {
        axios
            .get("http://localhost:5000/cart", { withCredentials: true })
            .then((res) => setCart(res.data))
            .catch((err) => console.error("Failed to fetch cart:", err));
    }, []);

    return (
        <CartContext.Provider value={{ cart, setCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
