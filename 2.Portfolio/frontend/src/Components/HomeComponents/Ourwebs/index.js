import React from "react";
import healthyDishes from "./assets/healthy_dishes.png";
import indianDishes from "./assets/indian_dishes.png";
import luxDishes from "./assets/lux_dishes.png";
import mainDishes from "./assets/main.png";
import "./index.css";

function Ourwebs() {
  const websites = [
    {
      name: "Healthy Dishes",
      image: healthyDishes,
      url: "https://webapp.aichef.in/Healthy-Dishes",
    },
    {
      name: "Indian Dishes",
      image: indianDishes,
      url: "https://webapp.aichef.in/All-Indian-Dishes",
    },
    {
      name: "Luxury Dishes",
      image: luxDishes,
      url: "https://webapp.aichef.in/Luxury-Dishes",
    },
    {
      name: "Main Dishes",
      image: mainDishes,
      url: "https://webapp.aichef.in/",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 mb-4">
      <h2 className="main-heading mt-2 text-4xl mb-6 text-center md:text-5xl">
        OUR WEBSITES
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {websites.map((site, index) => (
          <a
            key={index}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl">
              <img
                src={site.image}
                alt={site.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {site.name}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                  Click to visit website
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Ourwebs;
