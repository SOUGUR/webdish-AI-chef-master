import React from "react";
import { Fade } from "react-reveal"; // Import Fade effect from react-reveal

function CareerPage() {
  return (
    <div className="flex flex-col gap-6  sm:gap-0 px-8 sm:px-0 justify-around mt-8 ">
      <div className="flex justify-center ">
        <Fade>
          <img
            className="w-full h-auto sm:w-1/2 lg:w-1/2 object-cover rounded-xl"
            src="https://cdn.leonardo.ai/users/b7bcbe82-59ff-4ea9-9d18-f22e92cdf03e/generations/be291b3d-cbe2-4bb0-a3b2-336f319e8105/Default_A_detailed_highly_realistic_awardwinning_animestyle_di_3.jpg"
            alt="interview img"
          />
        </Fade>
      </div>
      <Fade bottom>
        <h1 className="custom-text w-full flex justify-center my-2 md:text-3xl text-xl">
          Interviewing at AI Chef Master
        </h1>
      </Fade>
      <Fade bottom>
        <h1 className="w-full flex justify-center">
          <a
            href="#HiringProcess"
            className="bg-[#008080] text-white px-4 py-2 mt-3 rounded-md"
          >
            Learn More
          </a>
        </h1>
      </Fade>
    </div>
  );
}

export default CareerPage;
