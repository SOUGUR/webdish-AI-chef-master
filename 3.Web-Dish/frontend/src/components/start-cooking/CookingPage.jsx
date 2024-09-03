// src/CookingPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import KitchenEquipments from '../SingleDishItems/KitchenEquipments';
import NumberOfPeople from '../SingleDishItems/NumberOfPeople';
import MainIngradients from "../SingleDishItems/MainIngradients";
import SingleDish from "../../pages/SingleDish";
import Footer from '../FooterItem/Footer';

const CookingPage = () => {
    const { id } = useParams();
    const [dishData, setDishData] = useState({ ingredients: [], equipments: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    console.log(id)
    

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/dishes/${id}/ingredients`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Dish not found');
                }
                return response.json();
            })
            .then(data => {
                setDishData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    const handleClick = () => {
        navigate(`/receipe/${id}`);
    };



    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    const dishProps = {
        dishTitle: dishData.name,
        dishImage: dishData.image,
        dishDescription: dishData.description,
        dishAlt: dishData.name,
        dishType: dishData.type,
        preprationTime: dishData.time,
        dishCuisine: dishData.Cuisine,
        dishIngredients: "14",
        dishCalories: "500 kcal",
      };
    

    return (
        <div className="bg-[#f7f3cd] min-h-screen">
        <SingleDish
        dishTitle={dishProps.dishTitle}
        dishImage={dishProps.dishImage}
        dishDescription={dishProps.dishDescription}
        dishAlt={dishProps.dishAlt}
        dishType={dishProps.dishType}
        dishCuisine={dishProps.dishCuisine}
        preprationTime={dishProps.preprationTime}
        dishIngredients={dishProps.dishIngredients}
        dishCalories={dishProps.dishCalories}
      />
        <div className="px-12">
        <MainIngradients mainIngredients={dishData.ingredients} />
        <KitchenEquipments kitchenEquipments={dishData.equipments} />
        <NumberOfPeople />
      </div>

      <div className="flex items-center justify-center my-8">
      
          <button className="p-2 px-4 bg-indigo-600 text-white font-bold rounded-lg"  onClick={() => handleClick(dishData.id)} >Start Cooking</button>
        
      </div>

      <Footer />
      </div>
    );
};

export default CookingPage;
