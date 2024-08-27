import React, { useEffect, useState } from 'react';
//import RecommendedData from '../../Data/RecommendedData'
import Card2 from '../Card2'

const RecommendedDishes = () => {

  const [dishes, setDishes] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/dishes')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched Data:', data); // Log the data for debugging
                setDishes(data);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

  return (
    <div className="bg-[#f7f3cd] pb-16">
      <div className=" text-center">
        <h1 className='text-3xl font-bold pb-8'>Recommended Dishes</h1>
        <div className="flex flex-wrap gap-3 justify-center">
          {dishes.map((item, index) => (
            <div className='flex-grow'>
              <Card2 key={index} title={item.dish_name} time={item.cooking_time} rating={item.rating} imageUrl={item.image} />
            </div>
          ))}
        </div>
      </div>    
    </div>
  )
}

export default RecommendedDishes;
