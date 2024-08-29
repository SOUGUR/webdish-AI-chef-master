import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Fade } from "react-reveal";
import { v4 as uuidv4 } from "uuid";
import AiAssistantData from "./Data/AiAssistantData";

const Card = React.memo(
  ({ imageUrl, title, heading, description, onCardClick }) => (
    <div
      className="relative h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 cursor-pointer"
      onClick={() => onCardClick(description)}
    >
      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-white text-lg md:text-xl font-semibold mb-1 md:mb-2">
          {title}
        </h3>
        <p className="text-white text-xs md:text-sm">{heading}</p>
      </div>
    </div>
  )
);

const useInfiniteLoop = (length, interval = 5000) => {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % length);
  }, [length]);

  const prev = useCallback(() => {
    setIndex((prevIndex) => (prevIndex - 1 + length) % length);
  }, [length]);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval]);

  return [index, next, prev];
};

const CardSlider = React.memo(({ cards, onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else if (window.innerWidth < 1280) {
        setVisibleCards(3);
      } else {
        setVisibleCards(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
  }, [cards.length]);

  const prev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + cards.length) % cards.length
    );
  }, [cards.length]);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{
          transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
        }}
      >
        {cards.concat(cards.slice(0, visibleCards - 1)).map((card, index) => (
          <div
            key={uuidv4()}
            className={`w-full flex-shrink-0 px-2 transition-all duration-300`}
            style={{ flex: `0 0 ${100 / visibleCards}%` }}
          >
            <Card {...card} onCardClick={onCardClick} />
          </div>
        ))}
      </div>
      <button
        onClick={prev}
        className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 md:p-2 text-black hover:bg-opacity-75"
      >
        &lt;
      </button>
      <button
        onClick={next}
        className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-1 md:p-2 text-black hover:bg-opacity-75"
      >
        &gt;
      </button>
    </div>
  );
});

const AiAssistant = () => {
  const [selectedDescription, setSelectedDescription] = useState(null);
  const handleCardClick = useCallback((description) => {
    setSelectedDescription(description);
  }, []);

  const memoizedAiAssistantData = useMemo(() => AiAssistantData, []);

  return (
    <div className="pb-4 relative">
      <div className="flex justify-center items-center h-12 md:h-28">
        <h1 className="bg-green-900 text-transparent bg-clip-text text-xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-serif py-2 md:py-4 px-4 md:px-8 lg:px-10 xl:px-12 text-center">
          AI Assistant
        </h1>
      </div>

      <div
        className="relative h-[60vh] md:h-[80vh] flex flex-col items-center justify-center px-4 md:px-8 lg:px-20 brightness-100 bg-[#031529] bg-no-repeat bg-cover"
        style={{ backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
        >
          <source src="assets/Electricity.mp4" type="video/mp4" />
        </video>
        <p className="relative z-10 w-full md:w-3/4 lg:w-1/2 text-[#FFFFFF] text-sm md:text-xl lg:text-3xl font-bold text-center">
          With our AI Assistant, cooking becomes a personalized adventure.
          Choose, customize, and enjoy a delicious meal crafted to your taste.
          <br />
          Happy cooking!
        </p>
      </div>

      <div className="mt-4 md:mt-8">
        <div className="container mx-auto px-2 md:px-4">
          <CardSlider
            cards={memoizedAiAssistantData}
            onCardClick={handleCardClick}
          />
        </div>
      </div>

      {selectedDescription && (
        // <Fade>
        //   <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4 z-50">
        //     <div className="bg-white bg-opacity-20 p-4 md:p-8 rounded-lg w-full md:w-3/4 lg:w-2/3 h-2/3 md:h-1/2 max-w-4xl overflow-auto backdrop-blur-md">
        //       <div className="flex flex-col h-full justify-between">
        //         <p className="text-black text-base md:text-xl lg:text-2xl font-light leading-relaxed">
        //           {selectedDescription}
        //         </p>
        //         <button
        //           className="mt-4 md:mt-8 bg-blue-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-lg self-end hover:bg-blue-600 transition-colors"
        //           onClick={() => setSelectedDescription(null)}
        //         >
        //           Close
        //         </button>
        //       </div>
        //     </div>
        //   </div>
        // </Fade>
        <Fade>
          <div className="fixed inset-0 backdrop-blur-md bg-gray-200 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-transparent p-4 md:p-8 rounded-lg w-full md:w-3/4 lg:w-2/3 h-2/3 md:h-1/2 max-w-4xl overflow-auto">
              <div className="flex flex-col h-full justify-between">
                <p className="text-black text-base md:text-xl lg:text-2xl font-light leading-relaxed backdrop-blur-md bg-gray-200 bg-opacity-50 p-4 rounded-lg">
                  {selectedDescription}
                  <br />
                  <center>
                    <button
                      className="mt-4 md:mt-8 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors"
                      onClick={() => setSelectedDescription(null)}
                    >
                      Close
                    </button>
                  </center>
                </p>
              </div>
            </div>
          </div>
        </Fade>
      )}
    </div>
  );
};

export default React.memo(AiAssistant);
