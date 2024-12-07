// Card1.js
import React from 'react';

import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Card1 = ({ dishName, dishImage, animate, dishPath, scrollToSection }) => {
  return (
    <Link to={dishPath} onClick={scrollToSection}>
      <div className={`rounded-lg text-center cursor-pointer hover:scale-110 transition-all duration-300`}>
        <img className='rounded-full w-36 h-36 md:w-40 md:h-40 object-cover border-2 shadow-xl shadow-black' src={dishImage} alt={dishName} />
        <h3 className='py-4 text-lg font-semibold'>{dishName}</h3>
      </div>
    </Link>
  );
};

export default Card1;

// {() => window.scrollTo(0,0)}