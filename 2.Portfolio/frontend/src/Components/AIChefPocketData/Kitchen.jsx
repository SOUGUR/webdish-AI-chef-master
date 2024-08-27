import React, { useEffect, useState, useRef } from "react";
import { Fade,Slide } from "react-reveal";
import { v4 as uuidv4 } from "uuid";
import WhatIsInKitchenData from "./Data/WhatIsInKitchenData";
import { motion, useInView } from "framer-motion";

const AnimatedCard = ({ imageUrl, imageAlt, heading, description, index }) => {
  const [themeClass, setThemeClass] = useState("");
  const ref = useRef(null);
  const inView = useInView(ref, { triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const computedThemeClass =
      theme === "dark" ? "text-white bg-[#00534e]" : "text-black bg-white";
    setThemeClass(computedThemeClass);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      whileHover={{
        scale: 1.05,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3 },
      }}
      className="flex w-full sm:w-1/2 md:w-2/5 lg:w-1/3 px-2 mb-4"
    >
      <div
        className={`flex flex-col mx-2 flex-wrap rounded-2xl ${themeClass} w-full gap-4 hover:shadow-lg`}
      >
        <Fade duration={1000} delay={index * 200}>
          <img
            src={imageUrl}
            className="w-full h-64 md:h-72 lg:h-80 xl:h-96 p-2 rounded-t-2xl object-cover"
            alt={imageAlt}
          />
        </Fade>
        <div className="relative flex flex-col justify-center gap-4 items-center px-6 pb-4">
          <h3 className="custom-text text-xl sm:text-2xl md:text-2xl lg:text-2xl font-bold text-center hover:text-[#39FF14]">
            {heading}
          </h3>
          <div className="absolute top-[-25px] blur-3xl bg-[#8bfb451c] h-8 w-8 rounded-full" />
          <p className="custom-text-secondary text-lg sm:text-lg mb-3 leading-6 md:text-xl text-justify">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Kitchen = () => {
  return (
    <div className="pb-12">
      <div className="flex justify-center items-center h-28">
        <h1
          style={{ textShadow: "2px 0.5px 0.5px rgba(0, 0, 0, 0.5)" }}
          className="bg-[#39FF14] text-transparent bg-clip-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif py-4 px-6 md:px-8 lg:px-10 xl:px-12 text-center"
        >
          Chef Intelligence
        </h1>
      </div>
      <div className="custom-text px-6 mb-8 md:px-20 pt-4 text-[1.3rem] flex justify-center">
        <Fade bottom duration={1000}>
          Welcome to "Chef Intelligence", your go-to platform for turning everyday ingredients into delightful dishes! Our platform is designed to make your cooking experience not just convenient, but also creative and sustainable. Let's take a closer look at how it works:
        </Fade>
      </div>

      <div className="flex flex-wrap items-stretch mb-5">
        {WhatIsInKitchenData.map((obj, index) => (
          <AnimatedCard key={uuidv4()} index={index} {...obj} />
        ))}
      </div>
      <div className="custom-text flex px-6 md:px-20 mb-3 font-bold text-[2rem] justify-center items-center">
        <Slide bottom>
          <h1>Example:</h1>
        </Slide>
      </div>
      <div className="custom-text px-6 md:px-20 text-lg sm:text-lg md:text-xl flex text-justify justify-center">
        <Fade bottom>
          Let's say you have some chicken, tomatoes, and pasta in your kitchen. Enter these ingredients, and our platform might suggest a mouthwatering Chicken Tomato Pasta recipe. Our platform will guide you through the process, helping you create a restaurant-quality dish right at home.
        </Fade>
      </div>
      <div className="custom-text px-6 md:px-20 pt-6 text-lg sm:text-lg md:text-xl flex text-justify justify-center">
        <Slide bottom>
          Unlock a world of culinary possibilities with "Chef Intelligence". Whether you're a seasoned chef or a kitchen novice, our platform is here to inspire and assist you on your cooking journey. Say goodbye to food waste and hello to delicious, personalized meals!
        </Slide>
      </div>
    </div>
   );
};

export default Kitchen;
