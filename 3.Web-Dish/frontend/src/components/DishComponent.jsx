
import React from "react";
import { useNavigate } from "react-router-dom";

function DishComponent(props) {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/recent-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          chef: JSON.parse(localStorage.getItem("user")).user_id,
          dish: props.title,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        navigate(`/dish/${props.title}`);
      } else {
        console.error("Failed to save recent history.");
      }
    } catch (error) {
      console.error("Error in handleClick:", error);
    }
  };

  return (
    <div className="cards" onClick={handleClick}>
      <img className="dish-photo" src={props.img} alt={props.title} />
      <div className="info">
        <p className="title">{props.title}</p>
      </div>
    </div>
  );
}

export default DishComponent;

