import React from "react";
import { Button } from "@material-tailwind/react";
import { Fade } from "react-reveal";
import Lottie from "react-lottie";
import runAnimation from "../../../lottie/RunAnimation.json";
import "../Happiness/index.css";

const lottieOptions = {
  loop: true,
  autoplay: true,
  animationData: runAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

function Happiness() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center px-6 md:px-10 break-words">
      <div className="lg:w-7/12 w-full mb-8 md:mb-0">
        <Fade left>
          <h1
            className="main-head text-4xl font-bold mb-4 md:mb-6"
            style={{ lineHeight: "3rem" }}
          >
            Your Happiness is Our Responsibility
          </h1>
          <p className="custom-text-secondary text-base sm:text-lg md:text-xl mb-4 text-justify leading-relaxed">
            To ensure customer happiness, we prioritize open communication,
            actively listen to their needs, and swiftly address any concerns.
            Our commitment extends to delivering high-quality products/services
            that exceed expectations. Regularly seeking feedback allows us to
            continuously improve, tailor our offerings to customer preferences,
            and demonstrate our dedication to their satisfaction. Timely and
            personalized support further enhances the overall customer
            experience, fostering a positive relationship and solidifying trust
            in our brand.
          </p>
          <Button
            className="text-white animate-pulse rounded-md font-sans font-medium text-lg sm:text-xl md:text-2xl lg:text-3xl"
            style={{ backgroundColor: "#00544f" }}
          >
            ▶️ Watch Co-workers Video
          </Button>
        </Fade>
      </div>
      <div className="lg:w-5/12 w-full">
        <Fade right>
          <div className="w-2/3 mx-auto">
            <Lottie options={lottieOptions} />
          </div>
        </Fade>
      </div>
    </div>
  );
}

export default Happiness;
