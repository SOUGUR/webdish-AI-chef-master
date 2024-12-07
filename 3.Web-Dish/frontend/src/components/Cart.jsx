import React, { useState } from "react";
import { IoIosAdd, IoIosRemove, IoIosTrash } from "react-icons/io";
import toast from "react-hot-toast";

const Cart = ({ cartItems, handlePlaceOrder, navigateBack }) => {
  const [cart, setCart] = useState(cartItems);

  // Increase item quantity
  const increaseQuantity = (item) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.name === item.name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  // Decrease item quantity
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.name === item.name
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    } else {
      removeItem(item);
    }
  };

  // Remove item from the cart
  const removeItem = (item) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.name !== item.name));
    toast.success(`${item.name} removed from the cart.`);
  };

  // Handle place order
  const placeOrder = () => {
    handlePlaceOrder(cart);
    toast.success("Order placed successfully!");
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Your Cart</h2>
      {cart.length > 0 ? (
        <div>
          <ul>
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex justify-between items-center border-b py-4"
              >
                <span className="text-lg">{item.name}</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => decreaseQuantity(item)}
                    className="bg-red-500 text-white px-2 py-1 rounded-full"
                  >
                    <IoIosRemove />
                  </button>
                  <span className="text-lg">{item.quantity}</span>
                  <button
                    onClick={() => increaseQuantity(item)}
                    className="bg-green-500 text-white px-2 py-1 rounded-full"
                  >
                    <IoIosAdd />
                  </button>
                  <button
                    onClick={() => removeItem(item)}
                    className="bg-gray-400 text-white px-2 py-1 rounded-full"
                  >
                    <IoIosTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={navigateBack}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              Back to Inventory
            </button>
            <button
              onClick={placeOrder}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg"
            >
              Place Order
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-lg text-gray-600">Your cart is empty.</p>
          <button
            onClick={navigateBack}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            Back to Inventory
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
