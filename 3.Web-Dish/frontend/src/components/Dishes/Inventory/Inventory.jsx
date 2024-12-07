import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosAdd, IoIosClose } from "react-icons/io";
import toast from "react-hot-toast";
import BannerCard from "../../BannerCard";
import Footer from "../../FooterItem/Footer";

const Inventory = ({ navigateToCart }) => {
  const [ingredientName, setIngredientName] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [cart, setCart] = useState([]); // State for the cart
  const [suggestions, setSuggestions] = useState([]); // New state for suggestions
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false); // Loading state

  const navigate = useNavigate();

  const handleViewCart = () => {
    navigateToCart(cart);
    navigate("/Cart");
  };

  // Function to clean ingredient names
  const cleanIngredient = (ingredient) =>
    ingredient
      ?.toLowerCase()
      .trim()
      .replace(
        /[\u{1F300}-\u{1F6FF}|\u{1F900}-\u{1F9FF}|\u{1F700}-\u{1F77F}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]+/gu,
        ""
      )
      .replace(/[^\w\s]/g, "");

  // Function to fetch suggestions from the backend
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/ingredient-suggestions?q=${query}`
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data); // Set the suggestions
      } else {
        toast.error("Failed to fetch suggestions.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching suggestions.");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Add ingredient from suggestion
  const addFromSuggestion = (suggestion) => {
    setIngredients((prev) => [...prev, suggestion]);
    setIngredientName("");
    setSuggestions([]); // Clear suggestions after selection
  };

  // Handle ingredient input change
  const handleIngredientChange = (e) => {
    setIngredientName(e.target.value);
    fetchSuggestions(e.target.value); // Fetch suggestions when typing
  };

  // Add ingredient to the list
  const handleIngredientSubmit = () => {
    if (ingredientName.trim()) {
      setIngredients((prev) => [...prev, ingredientName.trim()]);
      setIngredientName("");
    } else {
      toast.error("Please enter an ingredient name.");
    }
  };

  // Remove an ingredient from the list
  const handleRemoveIngredient = (ingredient) => {
    setIngredients((prev) => prev.filter((item) => item !== ingredient));
  };

  // Fetch recipes from the backend
  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/compare-ingredients",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      } else {
        toast.error("Failed to fetch recipes.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching recipes.");
    }
  };

  // Handle dish selection for popup
  const handleDishSelection = (dish) => {
    setSelectedDish(dish);
    setShowPopup(true);
  };

  // Add item to cart
  const addToCart = (item, quantity) => {
    if (quantity > 0) {
      setCart((prevCart) => [
        ...prevCart.filter((cartItem) => cartItem.name !== item),
        { name: item, quantity },
      ]);
      toast.success(`${item} added to cart!`);
    }
  };

  // Close the popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedDish(null);
  };

  return (
    <div className="bg-[#f7f3cd] max-w-full overflow-x-hidden">
      <div>
        <BannerCard
          slides={[
            { imageUrl: "https://wallpapercave.com/wp/wp6866158.jpg" },
            { imageUrl: "https://wallpapercave.com/wp/wp6557471.jpg" },
            {
              imageUrl:
                "https://static.vecteezy.com/system/resources/previews/031/734/445/non_2x/spices-and-herbs-on-dark-background-food-and-cuisine-ingredients-colorful-collection-spices-and-herbs-on-background-black-table-ai-generated-free-photo.jpg",
            },
          ]}
          subtitle="Cooking what's in your kitchen into delicious meals."
          title={
            <img
              src="https://see.fontimg.com/api/renderfont4/Gg5D/eyJyIjoiZnMiLCJoIjoxOTEsInciOjEyNTAsImZzIjoxNTMsImZnYyI6IiMwMDAwMDAiLCJiZ2MiOiIjRkZGRkZGIiwidCI6MX0/SW5kaWFu/samarkan-normal.png"
              className=" filter invert w-96 flex"
              alt="Indian"
            />
          }
        />
      </div>

      <div className="flex flex-column items-center justify-center">
        <div className="pt-4 w-[90%] lg:w-[75%] xl:w-1/2 my-20 bg-[#f9f6ee]">
          <div className="py-6 text-center">
            <p className="custom-text text-3xl font-medium">
              Manage Your Ingredients
            </p>
            <p className="custom-text-secondary text-sm italic font-semibold py-1">
              *Add ingredients to your inventory and manage them easily.
            </p>
          </div>

          {/* Form */}
          <div className="custom-bg p-1 md:p-2 lg:p-4 w-full rounded-lg shadow-xl">
            <div className="p-4 pt-0 pb-0 lg:px-8">
              {/* Ingredients Input */}
              <div className="flex flex-col pt-4 relative">
                <label className="custom-text text-md font-medium pb-2">
                  Ingredients <span className="text-rose-600">*</span>
                </label>
                <div className="w-full flex items-center gap-4">
                  <input
                    name="ingredients"
                    value={ingredientName}
                    onChange={handleIngredientChange}
                    autoComplete="off"
                    placeholder="e.g. Onion, Garlic, Tomato"
                    className="custom-input custom-text flex-1 border px-2 py-1 placeholder:italic text-lg border-black rounded-md placeholder:text-gray-400 outline-none focus:border-orange-400"
                  />
                  <button onClick={handleIngredientSubmit} type="button">
                    <IoIosAdd className="text-green-500 text-3xl rounded-full border border-green-600 hover:bg-green-200" />
                  </button>
                </div>

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-full z-10">
                    {isLoadingSuggestions && (
                      <p className="text-center text-sm italic py-2">
                        Loading...
                      </p>
                    )}
                    {!isLoadingSuggestions &&
                      suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                          onClick={() => addFromSuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* List of Ingredients */}
              <ul className="flex flex-wrap gap-2 my-2 w-full">
                {ingredients.map((ingredient, index) => (
                  <li
                    key={index}
                    className="bg-amber-300 font-medium flex flex-row rounded-md items-center gap-2 px-2 py-1"
                  >
                    <span>{ingredient}</span>
                    <IoIosClose
                      onClick={() => handleRemoveIngredient(ingredient)}
                      className="text-xl cursor-pointer border border-black hover:bg-amber-500 rounded-full"
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center my-5">
              <button
                onClick={fetchRecipes}
                className="bg-green-600 hover:bg-green-800 px-8 py-2 overflow-hidden font-medium rounded-xl border text-xl md:text-2xl"
              >
                <span className="text-white">Find Dishes</span>
              </button>
            </div>

            {/* Display Recipes */}
            {recipes.length > 0 && (
              <div className="pt-6">
                <p className="text-xl font-medium">Recommended Dishes:</p>
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {recipes.map((recipe, index) => (
                    <div
                      key={index}
                      className="border p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
                      onClick={() => handleDishSelection(recipe)}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.dish_name}
                        className="w-full h-40 object-cover rounded-lg mb-2"
                      />
                      <h3 className="text-lg font-semibold text-center">
                        {recipe.dish_name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Popup for Selected Dish */}
          {showPopup && selectedDish && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] lg:w-1/2">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedDish.dish_name}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Available Ingredients */}
                  <div>
                    <h3 className="text-green-600 font-bold">
                      Available Ingredients:
                    </h3>
                    <ul>
                      {selectedDish.ingredients
                        .filter((dishIng) =>
                          ingredients.some(
                            (userIng) =>
                              cleanIngredient(userIng) ===
                              cleanIngredient(dishIng)
                          )
                        )
                        .map((availableIng, index) => (
                          <li key={index} className="text-green-500">
                            {availableIng}
                          </li>
                        ))}
                    </ul>
                  </div>
                  {/* Unavailable Ingredients */}
                  <div>
                    <h3 className="text-red-600 font-bold">
                      Unavailable Ingredients:
                    </h3>
                    <ul>
                      {selectedDish.ingredients
                        .filter(
                          (dishIng) =>
                            !ingredients.some(
                              (userIng) =>
                                cleanIngredient(userIng) ===
                                cleanIngredient(dishIng)
                            )
                        )
                        .map((unavailableIng, index) => (
                          <li
                            key={index}
                            className="flex items-center justify-between text-red-500"
                          >
                            <span>{unavailableIng}</span>
                            <div className="flex items-center gap-2">
                              {/* Decrease Quantity Button */}
                              <button
                                type="button"
                                className="w-8 h-8 pb-1 bg-gray-200 text-xl text-center rounded-full flex items-center justify-center"
                                onClick={() => {
                                  const newQuantity = Math.max(
                                    1,
                                    (parseInt(
                                      document.getElementById(
                                        `quantity-${unavailableIng}`
                                      ).value
                                    ) || 1) - 1
                                  );
                                  document.getElementById(
                                    `quantity-${unavailableIng}`
                                  ).value = newQuantity;
                                  addToCart(unavailableIng, newQuantity);
                                }}
                              >
                                -
                              </button>

                              {/* Quantity Input */}
                              <input
                                id={`quantity-${unavailableIng}`}
                                type="number"
                                min="1"
                                defaultValue={0}
                                placeholder="Qty"
                                className="w-12 border px-3 my-1 py-1 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 text-center"
                                onChange={(e) =>
                                  addToCart(
                                    unavailableIng,
                                    parseInt(e.target.value)
                                  )
                                }
                              />

                              {/* Increase Quantity Button */}
                              <button
                                type="button"
                                className="w-8 h-8 pb-1 bg-gray-200 text-xl text-center rounded-full flex items-center justify-center"
                                onClick={() => {
                                  const newQuantity =
                                    (parseInt(
                                      document.getElementById(
                                        `quantity-${unavailableIng}`
                                      ).value
                                    ) || 1) + 1;
                                  document.getElementById(
                                    `quantity-${unavailableIng}`
                                  ).value = newQuantity;
                                  addToCart(unavailableIng, newQuantity);
                                }}
                              >
                                +
                              </button>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  {/* Close Button */}
                  <button
                    onClick={closePopup}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    Close
                  </button>
                  {/* Details Button */}
                  <button 
                    onClick={()=>{window.location = "/dish/"+selectedDish.dish_name}}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                    Details
                  </button>
                  {/* View Cart Button */}
                  <button onClick={
                    window.location=`http://localhost:5173/dish/`+ selectedDish.dish_name
                  }
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                    details
                  </button>
                  <button
                    onClick={handleViewCart}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                  >
                    View Cart ({cart.length})
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Inventory;








