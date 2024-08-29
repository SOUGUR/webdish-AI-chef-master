import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Instructions.css'; // Optional CSS for styling

const Instructions = () => {
    const { id } = useParams(); // Get the dish ID from the URL
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the recipe steps for the given dish ID
        fetch(`http://localhost:5000/steps/${id}`)
            .then(response => response.json())
            .then(data => {
                setRecipeSteps(data.steps);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching recipe steps:', error);
                setError('Failed to fetch recipe steps');
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="recipe-steps-container">
            <h1>Recipe Steps</h1>
            {recipeSteps.length === 0 ? (
                <p>No steps available for this dish.</p>
            ) : (
                <ol>
                    {recipeSteps.map((step, index) => (
                        <li key={index} className="recipe-step">
                            <p>{step.instructions}</p>
                            {step.video_url && (
                                <div className="video-container">
                                    <video controls>
                                        <source src={step.video_url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            )}
                            <p><b>Ingredients:</b> {step.ingredients.join(', ')}</p>
                            <p><b>Time:</b> {step.time} minutes</p>
                        </li>
                    ))}
                </ol>
            )}
        </div>
    );
};

export default Instructions;
