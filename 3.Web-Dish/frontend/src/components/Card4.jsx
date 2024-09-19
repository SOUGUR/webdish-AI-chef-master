// Card4.js
import React from "react";
import { FaStar } from "react-icons/fa";
import "./Card2.css";
import { Link } from "react-router-dom";

const Card4 = ({ title, imageUrl, time, rating, dishPath }) => {
  return (
    <Link
      to={dishPath}
      onClick={() => window.scrollTo(0, 0)}
      className="flex justify-center h-full"
    >
      {/* bg-[#00544f] */}
      <div className="card bg-black w-28 md:w-72 rounded-none overflow-hidden h-full card-hover-effect relative">
        {/* Image */}
        <div className="image-container relative">
          <img
            className="h-36 w-full md:h-full object-cover border-1 border-[#0a1111]"
            src={imageUrl}
            alt={title}
          />
          {/* Rating */}
          <div className="rating-container absolute top-0 right-0 p-2">
            <div className="rating-content">
              <FaStar className="star-icon" />
              <p className="rating-text">{rating}/5</p>
            </div>
          </div>
        </div>
        {/* Details */}
        <div className="flex flex-col flex-grow py-4 text-xs md:text-xl">
          <p className="text-white text-center font-semibold">{title}</p>
          <p className="text-white text-center font-semibold">
            Prep Time: {time} min
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card4;
