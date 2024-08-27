import React, { useEffect, useState, useRef } from "react";
import { Fade } from "react-reveal";
import { v4 as uuidv4 } from "uuid";
import { motion, useInView } from "framer-motion";

import i1 from "./i1.jpg";
import i2 from "./i2.jpg";
import i3 from "./i3.jpg";
import i4 from "./i4.jpg";

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

const sectionData = [
  {
    heading: "STRATEGIC VISION:",
    description:
      "We are committed to pushing culinary boundaries and expanding our influence in the market. With a focus on user-centric experiences and foresight into the future, our growth-oriented vision is a testament to our strategic goals and ambitions.",
    imageUrl: i1,
  },
  {
    heading: "B2B COLLABORATIONS:",
    description:
      "Long Term Growth is synonymous with forging strong B2B collaborations, creating synergies with restaurants and culinary establishments. By providing a comprehensive suite of services, including order management, inventory control, analytics, invoicing, and menu designing, we empower our partners to streamline their operations and enhance overall efficiency.",
    imageUrl: i2,
  },
  {
    heading: "INNOVATION THROUGH DIVERSITY:",
    description:
      "Diversification is the key to sustained success. By expanding our dish offerings, exploring new culinary frontiers, and staying attuned to emerging market trends, we ensure that our users always have exciting, relevant, and diverse options at their fingertips.",
    imageUrl: i3,
  },
  {
    heading: "LEADER IN CULINARY TECH:",
    description:
      "Long Term Growth solidifies our position as a trailblazer in the culinary tech industry. By combining advanced technology with a deep understanding of user preferences and industry dynamics, we pave the way for sustained innovation, unparalleled user experiences, and lasting success.",
    imageUrl: i4,
  },
];

const LongTerm = () => {
  return (
    <>
      <div className="min-h-screen md:pb-16">
        <div className="flex justify-center items-center h-28">
          <h1 style={{ textShadow: '2px 0.5px 0.5px rgba(0, 0, 0, 0.5)' }} className='bg-[#39FF14] text-transparent bg-clip-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif py-4 px-6 md:px-8 lg:px-10 xl:px-12 text-center md:text-left'>
            Long Term Growth - Elevating Culinary Experiences, Expanding
            Horizons
          </h1>
        </div>
        
        <Fade bottom cascade duration={1000} delay={200}>
          <p className="custom-text text-2xl font-medium py-12 px-6 md:px-12 text-center md:text-left">
            We are committed to pushing culinary boundaries and expanding our
            influence in the market. With a focus on user-centric experiences and
            foresight into the future, our growth-oriented vision is a testament
            to our strategic goals and ambitions.
          </p>
        </Fade>

        <div className="flex flex-wrap items-stretch mb-5">
            {sectionData.map((obj, index) => (
              <AnimatedCard key={uuidv4()} index={index} {...obj} />
            ))}
        </div>

        <Fade bottom cascade duration={1000} delay={200}>
          <p className="custom-text text-2xl pt-8 px-6 md:px-24 text-center md:text-left">
            As we embark on this journey, the Long Term Growth encapsulates our
            dedication to creating a lasting impact, not just in the kitchens of
            individuals but across the entire culinary landscape. It is more than
            a strategy; it's a commitment to excellence, evolution, and enduring
            success.
          </p>
        </Fade>

      </div>
    </>
  );
};

export default LongTerm;
