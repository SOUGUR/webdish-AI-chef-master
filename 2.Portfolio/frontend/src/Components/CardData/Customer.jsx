import React, { useEffect, useState } from "react";
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

const sectionData = [
  {
    heading: "Customer-Centric Approach:",
    description:
      "Our commitment is centered around putting customers first, ensuring their needs and satisfaction drive every decision we make.",
    imageUrl: "https://info.ehl.edu/hubfs/Customer%20centricity-1.jpeg",
  },
  {
    heading: "Seamless User Experience:",
    description:
      "We prioritize creating a seamless and enjoyable user experience, aiming to exceed customer expectations at every touchpoint",
    imageUrl:
      "https://www.ringcentral.com/gb/en/blog/wp-content/uploads/2020/03/omnichannel-seamless-retail-experience.jpg",
  },
  {
    heading: "Responsive Customer Support:",
    description:
      "Our dedicated support team is available around the clock to address your queries and provide timely assistance, ensuring you always feel supported.",
    imageUrl:
      "https://media.istockphoto.com/id/1059548978/photo/technical-support-concept-business-person-touching-helpdesk-icon-on-screen-hotline-assistance.jpg?s=612x612&w=0&k=20&c=ur4WfDWZzBWZ4-k8UdZ5SPxJ9M4r1uRAsgFx6GoBs-4=",
  },
  {
    heading: "Product Quality and Reliability:",
    description:
      "Quality and reliability are at the core of what we do. We strive to deliver products that not only meet but exceed your expectations in terms of performance and durability",
    imageUrl:
      "https://media.istockphoto.com/id/683334642/photo/quality-assurance-mechanism-of-metal-cogwheels-3d.jpg?s=612x612&w=0&k=20&c=A5xcmoGaxDN8igsXSQhW1WdHMB1JtDStAOId2uI-sO4=",
  },
];
const Customer = () => {
  return (
    <>
      <div className="h-full min-h-screen w-full">
        <div className="flex justify-center items-center h-28">
          <h1 className="bg-green-900 text-transparent bg-clip-text text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif py-4 px-6 md:px-8 lg:px-10 xl:px-12 text-center md:text-left">
            CUSTOMER PRIORITIES
          </h1>
        </div>

        <div className="mt-12 mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 px-4 sm:px-6 lg:px-8">
          {sectionData.map((obj, index) => (
            <AnimatedCard key={obj.id || index} index={index} {...obj} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Customer;
