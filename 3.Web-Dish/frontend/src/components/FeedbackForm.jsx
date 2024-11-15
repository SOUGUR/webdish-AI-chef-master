import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import Footer from "./FooterItem/Footer";

const FeedbackForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    reviewType: "",
    overallRating: 0,
    difficultyLevel: "",
    cookingTime: "",
    tasteRating: 0,
    presentationRating: 0,
    followedInstructions: true,
    madeModifications: false,
    modifications: "",
    wouldMakeAgain: "",
    message: "",
    suggestedImprovements: "",
    photoUrl: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRatingChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return alert("Please enter your email!");
    if (!formData.overallRating)
      return alert("Please provide an overall rating!");
    if (!formData.message.trim())
      return alert("Please provide feedback message!");

    setSubmitted(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/dish-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.message === "Message added successfully") {
        navigate("/");
      } else {
        alert("Something went wrong. Please try again later!");
      }
    } catch (error) {
      alert("Something went wrong. Please try again later!");
    } finally {
      setSubmitted(false);
    }
  };

  const StarRating = ({ value, onChange, max = 5 }) => (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          className={`w-6 h-6 cursor-pointer ${
            i < value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
          onClick={() => onChange(i + 1)}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-[#f7f3cd] min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-[#00544f] rounded-lg shadow-xl p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Share Your Cooking Experience
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white"
                  placeholder="your@email.com"
                />
              </div>

              {/* Overall Rating */}
              <div>
                <label className="block text-white mb-2">Overall Rating</label>
                <StarRating
                  value={formData.overallRating}
                  onChange={(value) =>
                    handleRatingChange("overallRating", value)
                  }
                />
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-white mb-2">
                  How difficult was it to make?
                </label>
                <select
                  name="difficultyLevel"
                  value={formData.difficultyLevel}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white"
                >
                  <option value="">Select difficulty level</option>
                  <option value="very-easy">Very Easy</option>
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="difficult">Difficult</option>
                  <option value="very-difficult">Very Difficult</option>
                </select>
              </div>

              {/* Cooking Time */}
              <div>
                <label className="block text-white mb-2">
                  How long did it take to prepare?
                </label>
                <select
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white"
                >
                  <option value="">Select time range</option>
                  <option value="under-30">Under 30 minutes</option>
                  <option value="30-60">30-60 minutes</option>
                  <option value="60-90">60-90 minutes</option>
                  <option value="90-120">90-120 minutes</option>
                  <option value="over-120">Over 2 hours</option>
                </select>
              </div>

              {/* Detailed Ratings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Taste Rating</label>
                  <StarRating
                    value={formData.tasteRating}
                    onChange={(value) =>
                      handleRatingChange("tasteRating", value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">
                    Presentation Rating
                  </label>
                  <StarRating
                    value={formData.presentationRating}
                    onChange={(value) =>
                      handleRatingChange("presentationRating", value)
                    }
                  />
                </div>
              </div>

              {/* Recipe Modifications */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="madeModifications"
                    checked={formData.madeModifications}
                    onChange={handleInputChange}
                    className="mr-2 w-4 h-4"
                  />
                  <label className="text-white">
                    I made modifications to the recipe
                  </label>
                </div>
                {formData.madeModifications && (
                  <textarea
                    name="modifications"
                    value={formData.modifications}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded bg-white"
                    placeholder="What modifications did you make?"
                    rows="3"
                  />
                )}
              </div>

              {/* Would Make Again */}
              <div>
                <label className="block text-white mb-2">
                  Would you make this recipe again?
                </label>
                <select
                  name="wouldMakeAgain"
                  value={formData.wouldMakeAgain}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white"
                >
                  <option value="">Select an option</option>
                  <option value="definitely">Definitely!</option>
                  <option value="maybe">Maybe</option>
                  <option value="probably-not">Probably not</option>
                  <option value="never">Never</option>
                </select>
              </div>

              {/* Detailed Feedback */}
              <div>
                <label className="block text-white mb-2">
                  Overall Experience
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white"
                  placeholder="Tell us about your overall experience..."
                  rows="4"
                />
              </div>

              {/* Suggestions */}
              <div>
                <label className="block text-white mb-2">
                  Suggestions for Improvement
                </label>
                <textarea
                  name="suggestedImprovements"
                  value={formData.suggestedImprovements}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white"
                  placeholder="Any suggestions to improve the recipe?"
                  rows="3"
                />
              </div>

              {/* Photo URL */}
              <div>
                <label className="block text-white mb-2">
                  Share a photo of your dish (URL){" "}
                  <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-white"
                  placeholder="Enter the URL of your dish photo"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitted}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50"
            >
              {submitted ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackForm;
