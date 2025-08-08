import { useState, useEffect } from "react";
import Guitar from "./components/Guitar";
import { Header } from "./components/Header";
import { db } from "./data/db";

function App() {

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

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        clearCart={clearCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart} />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
