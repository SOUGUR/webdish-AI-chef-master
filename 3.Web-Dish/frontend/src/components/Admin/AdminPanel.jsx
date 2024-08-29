import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
    const [dishes, setDishes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/dishes')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched Data:', data); // Log the data for debugging
                setDishes(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleCardClick = (id) => {
        navigate(`/steps/${id}`);
    };

    return (
        
        <div className="card-container">
            {dishes.map((dish, index) => (
                <div key={index} className="card" onClick={() => handleCardClick(dish.id)}>
                    <img src={dish.image} alt={dish.dish_name} className="card-image" />
                    <h1><b>{dish.dish_name}</b></h1>
                    <p>{dish.description}</p>
                </div>
            ))}
        </div>
        
    );
};

export default AdminPanel;