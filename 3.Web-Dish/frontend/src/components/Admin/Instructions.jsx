import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Instructions.css'; // Optional CSS for styling

const Instructions = () => {
    const { id } = useParams(); // Get the dish ID from the URL
    const [recipeSteps, setRecipeSteps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState({}); // Track selected files for each step

    useEffect(() => {
        // Fetch the recipe steps for the given dish ID
        fetch(`${import.meta.env.VITE_API_URL}/steps/${id}`)
            .then(response => response.json())
            .then(data => {
                setRecipeSteps(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching recipe steps:', error);
                setError('Failed to fetch recipe steps');
                setLoading(false);
            });
    }, [id]);

    const handleFileChange = (event, stepIndex) => {
        const file = event.target.files[0];
        setSelectedFiles(prevState => ({
            ...prevState,
            [stepIndex]: file
        }));
    };

    const handleVideoUpload = (stepIndex) => {
        const file = selectedFiles[stepIndex];
        if (!file) {
            alert("Please select a file before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append('video', file);
        formData.append('stepIndex', stepIndex);
        formData.append('dishId', id); // Assuming you want to send the dish ID as well
        console.log(formData.get('video'));

        fetch(`${import.meta.env.VITE_API_URL}/upload`, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Video uploaded successfully:', data);

                // Update the recipeSteps state with the new video URL
                setRecipeSteps(prevSteps => {
                    const updatedSteps = [...prevSteps];
                    updatedSteps[stepIndex].videoSource = data.video_url; // Update the videoSource with the new URL
                    return updatedSteps;
                });
            })
            .catch(error => {
                console.error('Error uploading video:', error);
            });
    };

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
                <ul>
                    {recipeSteps.map((step, index) => (
                        <li key={index} className="recipe-step">
                            <p><b>{step.title}</b></p>
                            {step.videoSource ? (
                                <div className="video-container">
                                    <video width="320" height="240" controls>
                                        <source src={step.videoSource} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <p>No video available</p>
                            )}
                            <input 
                                type="file" 
                                accept="video/*" 
                                onChange={(e) => handleFileChange(e, index)}
                            />
                            <button onClick={() => handleVideoUpload(index)}>Upload Video</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Instructions;
