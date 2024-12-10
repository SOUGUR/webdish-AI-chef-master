import React, { useState } from "react";
import { BsFillStopwatchFill } from "react-icons/bs";
import { FaMapLocationDot } from "react-icons/fa6";
import { SiCodechef } from "react-icons/si";
import "plyr/dist/plyr.css";
import { FaShare } from "react-icons/fa";
import { FaTelegramPlane } from "react-icons/fa";

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
    dishState,
    isShareOpen,
    setIsShareOpen
  } = props;

  return (
    <>
      <div className="h-full w-screen  pt-5 bg-[#f7f3cd] text-black">
        <div className="px-12 flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full sm:w-8/12 md:w-7/12 ">
            <img
              src={dishImage}
              alt={dishAlt}
              className="rounded-lg w-full object-cover"
            />
          </div>
          <div className="flex flex-col w-full md:5/12">
            <div className="text-4xl md:text-4xl font-bold my-3 flex flex-row">
              {dishTitle}
            </div>
            <div
              className={`${
                dishType.toLowerCase() === "vegetarian"
                  ? "bg-green-600"
                  : "bg-red-600"
              } text-white rounded-full w-fit py-1 px-2 mb-8`}
            >
              {dishType}
            </div>

            <div className="flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between text-white gap-1 bg-[#00544f] py-2 px-6 rounded-2xl ">
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

                <div className="flex flex-col items-center md:flex-row gap-3">
                <FaTelegramPlane onClick={() => setIsShareOpen(!isShareOpen) } 
                className="h-9 w-8 cursor-pointer hover:scale-105 transition-all text-[20]"/>
                  <div className="font-semibold text-sm md:text-base">
                    <p className="text-xs md:text-sm">Share</p>
                    <p className="text-xs md:text-sm">Dish</p>
                  </div>
                </div>

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
