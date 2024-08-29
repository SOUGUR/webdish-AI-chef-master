import React from "react";
import i6 from "./i6.jpg";
import i7 from "./i7.jpg";
import i8 from "./i8.jpg";
import i9 from "./i9.jpg";
import i10 from "./i10.jpg";
import i11 from "./i11.jpg";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "animate.css";

const AnimatedCard = ({ imageUrl, imageAlt, heading, description, index }) => {
  const [themeClass, setThemeClass] = useState("");

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    const computedThemeClass =
      theme === "dark" ? "text-white bg-slate-800" : "text-gray-800 bg-white";
    setThemeClass(computedThemeClass);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex flex-col rounded-lg shadow-lg overflow-hidden ${themeClass} 
        transform transition duration-300 hover:scale-105 h-full`}
    >
      <div className="flex-shrink-0">
        <img
          className="h-48 w-full object-cover"
          src={imageUrl}
          alt={imageAlt}
        />
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2">{heading}</h3>
          <p className="text-base text-gray-500">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

const rdSections = [
  {
    heading: "INNOVATION HUB:",
    description:
      "Our R&D domain serves as the nucleus of innovation, where ideas are cultivated and transformed into advanced features that redefine the culinary tech landscape.",
    imageUrl: i6,
  },
  {
    heading: "TECHNOLOGICAL ADVANCEMENTS:",
    description:
      "We constantly push technological boundaries, staying ahead of industry trends to provide our users with the latest and most advanced features in the realm of culinary exploration.",
    imageUrl: i7,
  },
  {
    heading: "COMMITMENT TO EXCELLENCE:",
    description:
      "Our dedicated R&D team is committed to delivering unparalleled value, ensuring that our company remains at the forefront of the industry through continuous improvement.",
    imageUrl: i8,
  },
  {
    heading: "USER-CENTRIC APPROACH:",
    description:
      "Through user insights and feedback, we shape the future of our platform, creating a seamless and user-friendly culinary experience that goes beyond expectations.",
    imageUrl: i9,
  },
  {
    heading: "CREATIVE POWERHOUSE:",
    description:
      "The R&D team is a dynamic force of creativity, ingenuity, and expertise, exploring uncharted territories to bring groundbreaking solutions to the culinary tech landscape.",
    imageUrl: i10,
  },
  {
    heading: "DRIVING INDUSTRY TRENDS:",
    description:
      "We don't just keep up with industry trends; we set the pace. The R&D domain is where challenges are turned into opportunities, and where we shape the future of food and culinary experiences.",
    imageUrl: i11,
  },
];

const RD = () => {
  return (
    <>
      <div className="h-full min-h-screen w-full mb-12">
        <div className="flex mb-5 justify-center items-center h-28">
          <h1 className="bg-green-900 text-transparent bg-clip-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif py-4 px-6 md:px-8 lg:px-10 xl:px-12 text-center md:text-left">
            R&D (Research and Development)
          </h1>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 px-4 sm:px-6 lg:px-8">
          {rdSections.map((obj, index) => (
            <AnimatedCard key={obj.id || index} index={index} {...obj} />
          ))}
        </div>
        
      </div>
    </>
  );
};

export default RD;
