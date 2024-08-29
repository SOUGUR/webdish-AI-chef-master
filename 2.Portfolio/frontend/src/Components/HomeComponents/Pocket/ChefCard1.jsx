import { useEffect, useState } from "react";

export const ChefCard1 = ({ heading, description, video }) => {
  const [themeClass, setThemeClass] = useState("");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    console.log(themeClass);
    const computedThemeClass =
      theme === "dark" ? "text-white bg-gray-950 " : "text-black bg-white";
    setThemeClass(computedThemeClass);
  }, []);

  return (
    <div className="inset-0 backdrop-blur-md bg-gray-200 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://cdn.leonardo.ai/users/b7bcbe82-59ff-4ea9-9d18-f22e92cdf03e/generations/eb880b19-0545-4e9b-819c-b36195140ec9/Anime_Create_a_vibrant_mouthwatering_image_of_animestyle_gourm_1.jpg')",
          filter: "blur(5px)",
        }}
      />
      <div className="bg-transparent p-4 md:p-8 rounded-lg w-full md:w-3/4 lg:w-2/3 h-2/3 md:h-full max-w-4xl z-10">
        <div className="flex flex-col h-full justify-between">
          <div className="backdrop-blur-md bg-gray-200 bg-opacity-50 p-4 rounded-lg">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl text-black mb-6">
              {heading}
            </h2>
            <p className="text-black text-base md:text-xl lg:text-2xl font-light leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

{
  /* <div className="flex flex-col items-center w-full">
          <video
            autoPlay
            loop
            muted
            className="w-full md:h-80 h-60 "
            style={{
              objectFit: "cover",
              filter: "brightness(0.9)", // Adjust the brightness value as needed
            }}
          >
            <source src={video} type="video/mp4" />
          </video>
        </div> */
}
