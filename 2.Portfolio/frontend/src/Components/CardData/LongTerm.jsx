import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import i1 from "./i1.jpg";
import i2 from "./i2.jpg";
import i3 from "./i3.jpg";
import i4 from "./i4.jpg";
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
        <div className="flex justify-center items-center h-32 text-black">
          <h1 className="bg-green-900 text-transparent bg-clip-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif py-4 px-6 md:px-8 lg:px-10 xl:px-12 text-center md:text-left">
            Long Term Growth - Elevating Culinary Experiences, Expanding
            Horizons
          </h1>
        </div>

        <p className="custom-text text-2xl font-medium py-12 px-6 md:px-12 text-center md:text-left">
          We are committed to pushing culinary boundaries and expanding our
          influence in the market. With a focus on user-centric experiences and
          foresight into the future, our growth-oriented vision is a testament
          to our strategic goals and ambitions.
        </p>

        <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 sm:px-6 lg:px-8">
          {sectionData.map((obj, index) => (
            <AnimatedCard key={obj.id || index} index={index} {...obj} />
          ))}
        </div>

        <p className="custom-text text-2xl py-12 px-6 md:px-24 text-center md:text-left">
          As we embark on this journey, the Long Term Growth encapsulates our
          dedication to creating a lasting impact, not just in the kitchens of
          individuals but across the entire culinary landscape. It is more than
          a strategy; it's a commitment to excellence, evolution, and enduring
          success.
        </p>
      </div>
    </>
  );
};

export default LongTerm;
