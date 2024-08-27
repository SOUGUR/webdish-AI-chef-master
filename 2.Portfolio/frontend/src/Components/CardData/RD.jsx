import React, { useEffect, useState, useRef } from "react";
import i6 from "./i6.jpg";
import i7 from "./i7.jpg";
import i8 from "./i8.jpg";
import i9 from "./i9.jpg";
import i10 from "./i10.jpg";
import i11 from "./i11.jpg";
import { Fade } from "react-reveal";
import { v4 as uuidv4 } from "uuid";
 import "animate.css";
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
        <h1
          style={{ textShadow: "2px 0.5px 0.5px rgba(0, 0, 0, 0.5)" }}
          className="bg-[#39FF14] text-transparent bg-clip-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif py-4 px-6 md:px-8 lg:px-10 xl:px-12 text-center"
        >
           R&D (Research and Development)
        </h1>

       <div className="flex flex-wrap items-stretch mb-5">
        {rdSections.map((obj, index) => (
          <AnimatedCard key={uuidv4()} index={index} {...obj} />
         ))}
      </div>

      </div>
    </>
  );
};

export default RD;