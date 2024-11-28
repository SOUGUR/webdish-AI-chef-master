import React from "react";
import { Carousel, Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { Fade } from "react-reveal";
import Typewriter from "./Typewriter";

// images
import salad from "../../Images/—Pngtree—healthy food_3776802.png";
import pizza from "../../Images/—Pngtree—modern kitchen food box italian_9047468.png";
import daal from "../../Images/daal.png";
import beans from "../../Images/beans.png";
import biryani from "../../Images/biryani.png";
import butterchiken from "../../Images/butterchicken.png";

// styles
import "../Unique/index.css";
import "tailwindcss/tailwind.css";

const carouselImages = [butterchiken, salad, pizza, beans, biryani, daal];

export default function Unique() {
  return (
    <div className="background-main-page h-full break-words">
      <div className="flex flex-col md:flex-row justify-evenly items-center px-6 md:px-10 py-8 md:py-20">
        <div className="lg:w-7/12 sm:w-full md:w-full mb-8 sm:mb-0">
          <h1
            style={{ lineHeight: "3rem" }}
            className="main-heading relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 md:text-start"
          >
            <Typewriter text="Welcome to AI Chef Master" delay={100} />
            <div className="w-[300px] h-[300px] z-1 rounded-full absolute top-[-125px] left-[-40px] blur-3xl bg-[#8bfb451c]" />
          </h1>
          <div className="md:text-start">
            <Fade bottom>
              <p className="sub-heading mb-4 text-base sm:text-xl md:text-xl lg:text-2xl">
                A Unique and powerful software to create and customize your own
                AI CHEF with the help of the AI assistant
              </p>
              <Button
                style={{ backgroundColor: "#00544f" }}
                className="button-btn rounded-full shadow-2xl"
              >
                <Link
                  to="https://aichef.in/"
                  className="no-underline text-white px-4 py-2 text-base font-bold"
                >
                  Try for Free ➪
                </Link>
              </Button>
            </Fade>
          </div>
        </div>
        <div className="lg:w-5/12 sm:w-full md:w-full">
          <Fade right>
            <div className="w-full h-auto flex justify-center">
              <Carousel
                className="rounded-xl sm:w-1/3 md:w-2/3"
                autoplay
                autoplayDelay={3000}
                loop
                navigation={({ setActiveIndex, activeIndex, length }) => (
                  <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                    {new Array(length).fill("").map((_, i) => (
                      <span
                        key={i}
                        className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                          activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                        }`}
                        onClick={() => setActiveIndex(i)}
                      />
                    ))}
                  </div>
                )}
              >
                {carouselImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`food-${index}`}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                ))}
              </Carousel>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}
