import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";

export const useCart = () => {
  const initialCart = JSON.parse(localStorage.getItem("cart")) || [];

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  const MAX_QUANTITY = 5;
  const MIN_QUANTITY = 1;

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /**
   * Adds an item to the cart.
   * If the item already exists, it increases the quantity.
   * If the quantity reaches the maximum limit, it does not add more.
   * If the item does not exist, it adds it with a quantity of 1.
   *
   * @param {*} item
   * @returns
   */
  function addToCart(item) {
    const itemExists = cart.findIndex((cartItem) => cartItem.id === item.id);
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_QUANTITY) return;
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity++;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  }

  /**
   * Removes an item from the cart by its ID.
   * If the item is not found, it does nothing.
   * @param {number} id - The ID of the item to remove.
   * @return {void}
   */
  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id));
  }

  /**
   * Increases the quantity of an item in the cart by its ID.
   * If the item is not found or the quantity is already at the maximum,
   * it does nothing.
   * @param {number} id - The ID of the item to increase.
   * @return {void}
   */
  function increaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity < MAX_QUANTITY) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  }

  /**
   * Decreases the quantity of an item in the cart by its ID.
   * If the item is not found or the quantity is already at the minimum,
   * it does nothing.
   * @param {number} id - The ID of the item to decrease.
   * @return {void}
   */
  function decreaseQuantity(id) {
    const updatedCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_QUANTITY) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
  }

  /**
   * Clears the entire cart by setting it to an empty array.
   * @return {void}
   */
  function clearCart() {
    setCart([]);
  }

  //State derived
  const isEmpty = useMemo(() => cart.length === 0, [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    isEmpty,
    cartTotal
  };
}