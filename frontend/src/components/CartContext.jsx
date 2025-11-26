import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [cartLoading, setCartLoading] = useState(true);


    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await axios.get("http://localhost:5000/cart", {
                    withCredentials: true
                });
                setCart(res.data);
            } catch (err) {
                console.error("Failed to fetch cart:", err);
            } finally {
                setCartLoading(false);
            }
        };
        fetchCart();
    }, []);

    // Add to cart function
    const addToCart = async (product) => {
        try {
            // Check authentication
            const authRes = await fetch("http://localhost:5000/check-auth", {
                method: "GET",
                credentials: "include",
            });
            const authData = await authRes.json();

            if (!authData.loggedIn) {
                Swal.fire({
                    title: "Please login first",
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });
                return;
            }

            // Check if already in cart
            const alreadyInCart = cart.some(
                (item) => item.product_id === product.product_id
            );
            if (alreadyInCart) return;

            // Add to cart API call
            const res = await fetch("http://localhost:5000/cart/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ productId: product.product_id }),
            });

            const data = await res.json();

            if (res.ok) {
                Swal.fire({
                    title: "Item added to cart",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                    toast: true,
                    position: "top-end",
                });

                // Update local cart state
                setCart((prevCart) => [
                    ...prevCart,
                    { ...product, quantity: 1 },
                ]);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Update quantity function
    const updateQuantity = async (item, newQty) => {
        if (newQty < 1) return;

        try {
            await axios.put("http://localhost:5000/cart/update", {
                productId: item.product_id,
                quantity: newQty
            }, { withCredentials: true });

            // Update local cart state
            setCart(prevCart =>
                prevCart.map(p =>
                    p.product_id === item.product_id
                        ? { ...p, quantity: newQty }
                        : p
                )
            );
        } catch (err) {
            console.log("Error updating quantity", err);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await axios.delete(`http://localhost:5000/cart/remove/${productId}`, {
                withCredentials: true
            });

          
            setCart(prevCart =>
                prevCart.filter(item =>
                    Number(item.product_id) !== Number(productId)
                )
            );

            Swal.fire({
                title: "Item removed from cart",
                icon: "success",
                timer: 1000,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
            });
        } catch (err) {
            console.error("Error removing item from cart:", err);
            Swal.fire({
                title: "Failed to remove item",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: "top-end",
            });
        }
    };



    return (
        <CartContext.Provider value={{
            cart,
            setCart,
            cartLoading,
            addToCart,
            updateQuantity,
            removeFromCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}