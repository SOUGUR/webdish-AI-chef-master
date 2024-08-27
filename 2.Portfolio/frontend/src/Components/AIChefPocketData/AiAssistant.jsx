import React, { useEffect, useState, useRef } from "react";
import { Fade } from "react-reveal";
import { v4 as uuidv4 } from "uuid";
import "animate.css";
import AiAssistantData from "./Data/AiAssistantData";
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

const AiAssistant = () => {
  return (
    <div>
      <div className="flex mb-2 justify-center items-center h-28 mt-2">
        <h1
          style={{ textShadow: "2px 0.5px 0.5px rgba(0, 0, 0, 0.5)" }}
          className="bg-[#39FF14] text-transparent bg-clip-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif py-4 px-6 md:px-8 lg:px-10 xl:px-12 text-center"
        >
          AI Assistant
        </h1>
      </div>

      <div
        className="relative h-[calc(100vh-7rem-72px)] flex flex-col md:flex-row w-full items-center justify-center px-4 md:px-8 lg:px-20"
        style={{
          background: "url('assets/background.jpg') center/cover no-repeat",
        }}
      >
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="assets/Electricity.mp4" type="video/mp4" />
        </video>
        <Fade duration={1500}>
          <p className="relative z-10 w-full md:w-1/2 text-white text-base md:text-2xl lg:text-3xl font-bold md:pr-4 lg:pr-8 text-center md:text-left">
            With our AI Assistant, cooking becomes a personalized adventure.
            Choose, customize, and enjoy a delicious meal crafted to your taste.
            <br />
            Happy cooking!
          </p>
        </Fade>
      </div>

      <div className="flex flex-wrap items-stretch mb-5">
        {AiAssistantData.map((obj, index) => (
          <AnimatedCard key={uuidv4()} index={index} {...obj} />
         ))}
      </div>
    </div>
  );
};

export default AiAssistant;
