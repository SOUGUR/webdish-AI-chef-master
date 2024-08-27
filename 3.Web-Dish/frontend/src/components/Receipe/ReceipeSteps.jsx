import React, { useState, useEffect } from "react";
import { Fade } from "react-reveal";
import Cooking from "../../pages/Cooking";
import { useParams } from 'react-router-dom';
import IngredientCard from "../IngredientCard";
import { useNavigate } from 'react-router-dom';

const RecipeSteps = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const goToNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleFeedbackSubmission = () => {
    alert('You have successfully created a dish!');
    navigate('/feedback');
  };

  return (
    <div className="px-4 py-8 bg-[#f7f3cd] shadow-lg rounded-lg">
      <h1 className="text-4xl font-semibold text-center mb-8">Preparation Steps</h1>
      <div key={currentStep}>
        <h2 className="text-2xl font-semibold mb-4">{`${currentStep + 1}. ${steps[currentStep].title}`}</h2>
        <div className="flex justify-center items-center">
          <Cooking videoSource={steps[currentStep].videoSource} />
        </div>
        <Fade bottom cascade delay={500}>
          <ul className="list-disc pl-6 mb-6">
            {steps[currentStep].instructions.map((instruction, i) => (
              <li key={i} className="mb-2">{instruction}</li>
            ))}
          </ul>
        </Fade>
        <Fade bottom cascade delay={500}>
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
        </Fade>
        <Fade bottom cascade delay={500}>
          <ul className="mb-4 grid grid-cols-2 sm:grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {steps[currentStep].ingredients.map((ingredient, j) => (
              <li key={j} className="">
                <IngredientCard title={ingredient.title} quantity={ingredient.quantity} />
              </li>
            ))}
          </ul>
        </Fade>
      </div>
      <div className="flex justify-between items-center">
        <button onClick={goToPreviousStep} disabled={isFirstStep} className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed" aria-label="Previous Step">
          {isFirstStep ? "First Step" : "Previous Step"}
        </button>
        <div>
          <span className="mr-2">{currentStep + 1}</span>
          <span>of</span>
          <span className="ml-2">{steps.length}</span>
        </div>
        {isLastStep ? (
          
            <button onClick={handleFeedbackSubmission}  className="px-4 py-2 bg-green-500 text-white rounded-md" aria-label="Submit Feedback">
             Submit Feedback
          </button>
          
        ) : (
        <button onClick={goToNextStep} disabled={isLastStep} className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed" aria-label="Next Step">
          {isLastStep ? "Last Step" : "Next Step"}
        </button>
        )}
      </div>
    </div>
  );
};

function ReceipeSteps() {
  const { id } = useParams();
  const [recipeSteps, setRecipeSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data2, setData2] = useState(null);

  useEffect(() => {
    const fetchRecipeSteps = async () => {
      try {
        const response = await fetch(`http://localhost:5000/recipes/${id}`); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch recipe steps');
        }
        const data = await response.json();
        setRecipeSteps(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchName = async () => {
      try {
        const response = await fetch(`http://localhost:5000/name/${id}`);
        const result = await response.json();
        setData2(result);
      } catch (error) {
        console.error('Error fetching data2:', error);
      }
    };

    fetchRecipeSteps();
    fetchName();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-[#f7f3cd] min-h-screen flex flex-col justify-center">
      <div className="flex-1 max-w-4xl mx-auto py-8">
        <h1 className="text-4xl font-semibold text-center mb-8">{data2.dish_name}</h1>
        <RecipeSteps steps={recipeSteps} />
      </div>
    </div>
  );
}

export default ReceipeSteps;
