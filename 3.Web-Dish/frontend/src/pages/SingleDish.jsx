import React, { useState } from "react";
import { BsFillStopwatchFill, BsFire, BsTwitterX } from "react-icons/bs";
import { SiCodechef } from "react-icons/si";
import "plyr/dist/plyr.css";
import { FaShare } from "react-icons/fa";
import ShareModal from "../components/ShareModal";
import { useLocation } from "react-router-dom";

const SingleDish = (props) => {
  const {
    dishImage,
    dishAlt,
    dishTitle,
    dishType,
    preprationTime,
    dishIngredients,
    dishCalories,
    dishDescription,
    isShareOpen,
    setIsShareOpen
  } = props;

  
  const location = useLocation();
  return (
    <>
      <div className={`h-full relative w-screen pt-5 bg-[#f7f3cd] text-black`}>
        <div className="px-12 flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full sm:w-8/12 md:w-7/12 ">
            <img
              src={dishImage}
              alt={dishAlt}
              className="rounded-lg w-full object-cover"
            />
          </div>
          <div className="flex flex-col w-full md:5/12">
            <div className="flex items-center gap-5 text-4xl md:text-4xl font-bold my-3">
              {dishTitle}
              <FaShare onClick={() => setIsShareOpen(!isShareOpen)} title="share dish" className="cursor-pointer mt-2 hover:text-blue-500 h-6 hover:scale-105 transition-all" />
            </div>
            <div
              className={`${dishType.toLowerCase() === "vegetarian"
                ? "bg-green-600"
                : "bg-red-600"
                } text-white rounded-full w-fit py-1 px-2 mb-8`}
            >
              {dishType}
            </div>

            <div className="flex flex-col justify-between  ">
              <div className="flex items-center   justify-around text-white space-y-4 md:space-y-0 md:space-x-4 bg-[#00544f] py-2 rounded-2xl">
                <div className="flex flex-col items-center md:flex-row gap-3">
                  <BsFillStopwatchFill className="text-4xl md:mt-2" />
                  <div className="font-semibold text-sm md:text-base">
                    <p className="text-xs md:text-sm">Time</p>
                    <p className="text-xs md:text-sm">{preprationTime} mins</p>
                  </div>
                </div>

                <div className="flex flex-col items-center md:flex-row gap-3">
                  <SiCodechef className="text-4xl md:mt-2" />
                  <div className="font-semibold text-sm md:text-base">
                    <p className="text-xs md:text-sm">Ingredients</p>
                    <p className="text-xs md:text-sm">{dishIngredients}</p>
                  </div>
                </div>

                {/* <div className="flex flex-col items-center md:flex-row gap-3">
                            <BsFire className="text-4xl md:mt-2" />
                            <div className="font-semibold text-sm md:text-base">
                                <p className="text-xs md:text-sm">Calories</p>
                                <p className="text-xs md:text-sm">{dishCalories}</p>
                            </div>
                        </div> */}
              </div>

              <div className="">
                <h1 className="text-2xl font-bold pt-5">About the Dish</h1>
                <p className="text-base md:text-lg text-justify">
                  {" "}
                  {dishDescription}{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleDish;
