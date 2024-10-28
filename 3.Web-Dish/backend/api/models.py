import re
import nltk
from nltk.corpus import stopwords
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors

# RECOMMENDATIONS BASED ON QUERY :

# Load and preprocess the recipe data
data = pd.read_csv('recipe_data_with_images.csv')
data.dropna(inplace=True)
data['combined_text'] = data['Ingredients'] + " " + data['Instructions']

# Initialize TF-IDF Vectorizer and fit the model
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(data['combined_text'])

# Function to recommend dishes
def recommend_dishes(query, n=5):
    query_vector = vectorizer.transform([query])
    cosine_sim = cosine_similarity(query_vector, tfidf_matrix).flatten()
    similar_indices = cosine_sim.argsort()[-n:][::-1]
    recommended_recipes = data.iloc[similar_indices][['Title', 'Ingredients', 'Instructions', 'image_path']]
    return recommended_recipes

# ===========================================================================================================================================

# RECOMMENDATIONS BASED ON FEEDBACK :

data = pd.read_csv('Food_Recipes_and_Reviews.csv')
data.rename(columns={'Name': 'Recipe_Name'}, inplace=True)
data['cleaned_review'] = data['cleaned_review'].fillna("")


tfidf_vectorizer = TfidfVectorizer(max_features=1000)
tfidf_matrix = tfidf_vectorizer.fit_transform(data['cleaned_review'])

model = NearestNeighbors(n_neighbors=5, metric='cosine', algorithm='brute')
model.fit(tfidf_matrix)

# Function to clean the review text (removing stopwords, punctuation, etc.)
def clean_text(text):
    text = re.sub(r'[^\w\s]', '', text.lower())
    text = ' '.join([word for word in text.split() if word not in stopwords.words('english')])
    return text

# Function to get recommendations based on input review
def recommend_recipes_by_review(input_review, n_recommendations=5):
    cleaned_input_review = clean_text(input_review)
    input_review_vector = tfidf_vectorizer.transform([cleaned_input_review]).toarray()
    
    distances, indices = model.kneighbors(input_review_vector, n_neighbors=n_recommendations)
    recommended_indices = indices.flatten()

    # Select the relevant columns for recommendations (including Image_URL)
    recommended_recipes = data.iloc[recommended_indices][['RecipeId', 'Recipe_Name', 'Review', 'Images']]
    return recommended_recipes

