import React, { useEffect, useState } from "react";
import { Fade, Slide } from "react-reveal";
import { v4 as uuidv4 } from "uuid";

import WhatIsInKitchenData from "./Data/WhatIsInKitchenData";

// const AnimatedCard = ({ imageUrl, imageAlt, heading, description, index }) => {
//   const [themeClass, setThemeClass] = useState("");

//   useEffect(() => {
//     const theme = localStorage.getItem("theme");
//     const computedThemeClass =
//       theme === "dark" ? "text-white bg-slate-900" : "text-black bg-white";
//     setThemeClass(computedThemeClass);
//   }, []);

//   return (
//     <div className="p-4 pb-0">
//       <div
//         className={`flex flex-col h-full rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl ${themeClass}`}
//       >
//         <Fade>
//           <div className="relative h-64 md:h-80">
//             <img src={imageUrl} className="w-full h-full" alt={imageAlt} />
//             {/* <div className="absolute inset-0 bg-black bg-opacity-20" /> */}
//           </div>
//         </Fade>
//         <div className="flex-1 p-6">
//           <Slide bottom>
//             <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
//               {heading}
//             </h3>
//             <p className="text-base md:text-lg leading-relaxed">
//               {description}
//             </p>
//           </Slide>
//         </div>
//       </div>
//     </div>
//   );
// };

const AnimatedCard = ({ imageUrl, imageAlt, heading, description, index }) => {
  const [themeClass, setThemeClass] = useState("");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const computedThemeClass =
      theme === "dark" ? "text-white bg-slate-900" : "text-black bg-white";
    setThemeClass(computedThemeClass);
  }, []);

  return (
    <div className="p-4 pb-0">
      <div
        className={`flex flex-col h-full rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl ${themeClass}`}
      >
        <Fade>
          <div className="relative h-56 md:h-64">
            <img src={imageUrl} className="w-full h-full" alt={imageAlt} />
            {/* <div className="absolute inset-0 bg-black bg-opacity-20" /> */}
          </div>
        </Fade>
        <div className="flex-1 p-6">
          <Slide bottom>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
              {heading}
            </h3>
            <p className="text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </Slide>
        </div>
      </div>
    </div>
  );
};

const Kitchen = () => {
  return (
    <div className="pb-6 md:mt-4">
      <div className="flex justify-center items-center h-28">
        <h1 className="bg-green-900 text-transparent bg-clip-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif py-4 px-6 md:px-8 lg:px-10 xl:px-12 text-center md:text-left">
          Chef Intelligence
        </h1>
      </div>
      <div className="custom-text px-6 md:px-20 pt-1 text-[1.3rem] flex justify-center">
        Welcome to "Chef Intelligence", your go-to platform for turning every
        day ingredients into delightful dishes! Our platform is designed to make
        your cooking experience not just convenient, but also creative and
        sustainable. Let's take a closer look at how it works:
      </div>

      <div className="mt-0 flex flex-col md:grid md:grid-cols-3 gap-1">
        {WhatIsInKitchenData.map((obj, index) => (
          <AnimatedCard key={uuidv4()} index={index} {...obj} />
        ))}
      </div>
      <div className="custom-text flex mt-4 px-6 md:px-20  mb-3 font-bold text-[2rem] justify-center items-center">
        <h1>Example:</h1>
      </div>
      <div className="custom-text px-6 md:px-20 text-lg sm:text-lg  md:text-xl flex text-justify justify-center">
        Let's say you have some chicken, tomatoes, and pasta in your kitchen.
        Enter these ingredients, and our platform might suggest a mouthwatering
        Chicken Tomato Pasta recipe. Our platform will guide you through the
        process, helping you create a restaurant-quality dish right at home.
      </div>
      <div className="custom-text px-6 md:px-20 pt-6 text-lg sm:text-lg  md:text-xl flex text-justify justify-center">
        Unlock a world of culinary possibilities with "Chef Intelligence".
        Whether you're a seasoned chef or a kitchen novice, our platform is here
        to inspire and assist you on your cooking journey. Say goodbye to food
        waste and hello to delicious, personalized meals!
      </div>
    </div>
  );
};

export default Kitchen;
