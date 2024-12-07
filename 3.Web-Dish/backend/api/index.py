import json
import re
import os
import urllib
from datetime import datetime, timedelta

from bson import json_util
from flask import Flask, request, jsonify, url_for, redirect
from flask_apscheduler import APScheduler
from flask_cors import CORS
from flask_dance.contrib.google import make_google_blueprint, google
from flask_jwt_extended import create_access_token, jwt_required, JWTManager, get_jwt_identity
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
# import firebase_admin
# from firebase_admin import credentials, storage
from google.cloud import storage

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
app.secret_key = os.urandom(12)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
jwt = JWTManager(app)
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

client = MongoClient(os.getenv('MONGODB_URL'))
db = client['AI_Chef_Master']  
dishes = db['Actual_dish']

# google login
app.config["GOOGLE_OAUTH_CLIENT_ID"] = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
app.config["GOOGLE_OAUTH_CLIENT_SECRET"] = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')

google_blueprint = make_google_blueprint(
    client_id=os.getenv('GOOGLE_OAUTH_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_OAUTH_CLIENT_SECRET'),
    scope=["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile",
           "openid"]
)
app.register_blueprint(google_blueprint, url_prefix="/login")


# Firebase setup
firebase_storage_bucket = 'ai-chef-master-eeb7d.appspot.com'
# cred = credentials.Certificate('credentials.json')
# firebase_admin.initialize_app(cred, {
#     'storageBucket': firebase_storage_bucket
# })
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials.json"
# Initialize Google Cloud Storage client
# storage_client = storage.Client()
# bucket = storage_client.bucket(firebase_storage_bucket) 

#=======================================================================================================================================================

@app.route("/")
def index():
    try:
        if not google.authorized:
            return redirect(url_for("google.login"))
        return redirect(url_for("google_callback"))

    except Exception as e:
        return jsonify({'message': f'Something went wrong: {str(e)}'}), 400


@app.route("/callback")
def google_callback():
    try:
        if not google.authorized:
            return jsonify({"error": "Failed to log in."}), 400
        resp = google.get("/oauth2/v1/userinfo")
        assert resp.ok, resp.text

        user_info = resp.json()
        exist_user = db.User.find_one({'email': user_info['email']}, {'first_name': 1, 'user_id': 1})

        if not exist_user:
            user_id = "User" + user_info['given_name'].upper() + "-" + str(
                round((datetime.now().timestamp()) * 1000000))
            db.User.insert_one({
                'first_name': user_info['given_name'],
                'last_name': user_info['family_name'],
                'email': user_info['email'],
                'user_id': user_id
            })
        else:
            user_id = exist_user['user_id']

        user_info['user_id'] = user_id
        token = create_access_token(identity=user_info['email'])
        user_info['access_token'] = token
        user_info_str = urllib.parse.quote(json.dumps(user_info))

        return redirect(f"{os.getenv('FRONTEND_URL')}/login?data={user_info_str}", code=302)

    except Exception as e:
        return jsonify({'message': f'Something went wrong: {str(e)}'}), 400


# Manual Authentication
@app.route('/auth/signup', methods=['POST'])
def register():
    try:
        first_name = request.json.get('first_name')
        last_name = request.json.get('last_name')
        country_code = request.json.get('country_code')
        phone = request.json.get('phone')
        email = request.json.get('email')
        password = request.json.get('password')

        if not (first_name and last_name and country_code and phone and email and password):
            return jsonify({'message': 'Missing required fields'}), 400
        if db.User.find_one({'email': email}):
            return jsonify({'message': 'User already exists'}), 400

        hashed_password = generate_password_hash(password)
        user_id = "User" + first_name.upper() + "-" + str(round((datetime.now().timestamp()) * 1000000))
        db.User.insert_one({
            'first_name': first_name,
            'last_name': last_name,
            'country_code': country_code,
            'phone': phone,
            'email': email,
            'password': hashed_password,
            'user_id': user_id
        })

        return jsonify({'message': 'User registered successfully'}), 201

    except Exception as e:
        return jsonify({'message': f'Something went wrong: {str(e)}'}), 400


@app.route('/auth/login', methods=['POST'])
def loginAuth():
    try:
        email = request.json['email']
        password = request.json['password']

        user = db.User.find_one({'email': email})
        if not user or not check_password_hash(user['password'], password):
            return jsonify({'message': 'Invalid credentials'}), 401
        else:
            token = create_access_token(identity=email)
        name = user['first_name'] + " " + user['last_name']
        user_id = user['user_id']
        return jsonify(message='Login Successful', access_token=token, email=email, name=name, user_id=user_id)

    except Exception as e:
        return jsonify({'message': f'Something went wrong: {str(e)}'}), 400


@app.route('/auth/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    try:
        current_user = get_jwt_identity()
        user = db.User.find_one({'email': current_user})
        if user:
            name = user['first_name'] + " " + user['last_name']
            user_id = user['user_id']
            return jsonify(message='Token is valid', email=current_user, name=name, user_id=user_id)
        else:
            return jsonify({'message': 'Invalid token'}), 401

    except Exception as e:
        return jsonify({'message': f'Something went wrong: {str(e)}'}), 400


@app.route('/auth/forgetPassword', methods=['POST'])
def forgetP():
    try:
        email = request.json.get('email')
        newPassword = request.json.get('newPassword')

        db.User.update_one({"email": email}, {"$set": {"password": generate_password_hash(newPassword)}})
        return jsonify({'message': "password updates succesfully"})

    except Exception as e:
        return jsonify({'message': f'Something went wrong: {str(e)}'}), 400


# To Generate New Dish
@app.route('/Homepage', methods=['POST'])
@jwt_required()
def generate_dish():
    try:
        data = request.get_json()
        name = data.get('name')
        quantity = data.get('quantity')
        unit = data.get('unit')
        equipments = data.get('equipments')

        if not name or not quantity or not unit or not equipments:
            return jsonify({'message': 'All fields are required'}), 400

        item = {
            "created_at": datetime.utcnow(),
            "name": name,
            "quantity": quantity,
            "unit": unit,
            "equipments": equipments
        }

        result = db.generate_dish.insert_one(item)
        if result.inserted_id:
            return jsonify({'message': 'Item created successfully', 'id': str(result.inserted_id)}), 201
        else:
            return jsonify({'message': 'Failed to create item'}), 500

    except Exception as e:
        return jsonify({'message': f'Something went wrong: {str(e)}'}), 400


# To Show Dish into History 
@app.route("/history/<name>", methods=['GET'])
@jwt_required()
def history(name):
    try:
        item = db.generate_dish.find_one({"name": name}, {"_id": 0})
        item['created_at'] = item['created_at'].strftime('%Y-%m-%d %H:%M:%S') if 'created_at' in item else 'N/A'
        if item:
            return jsonify(item), 200
        else:
            return jsonify({'message': 'Item not found'}), 404

    except Exception as e:
        return jsonify({'message': f'Something went wrong: {str(e)}'}), 500

@app.route("/retrieve-history", methods=['POST'])
def retrieve_history():
    try:
        history = db.recent.find_one({"user":request.json.get("chef")}, {"dishes":1, "_id":0})
        if history:
            history = history['dishes']
            dishes = []
            for j in history:
                for i in list(db.Actual_dish.find({"dish_name":j})):
                    dishes.append(i)
            return json.loads(json_util.dumps(dishes)), 200
        else:
            return json.loads(json_util.dumps([])), 200
    except Exception as e:
        return jsonify({"err":str(e)}), 500

@app.route("/recent-history", methods = ["POST"])
def recent_history():
    new_dish = request.json.get("dish")
    chef = request.json.get("chef")
    if db.recent.count_documents({"user":chef}) > 0:
        dishes = db.recent.find_one({"user":chef}, {"_id":0, "dishes":1})['dishes']
        if new_dish in dishes:
            dishes = [i for i in dishes if i != new_dish]
            dishes.append(new_dish)
            updated = db.recent.update_one({"user":chef}, {"$set":{"dishes":dishes}})
            if updated:
                return jsonify({"status":"added"}), 200
            else:
                return jsonify({"status":"error"}), 500
        else:
            dishes.append(new_dish)
            updated = db.recent.update_one({"user":chef}, {"$set":{"dishes":dishes}})
            if updated:
                return jsonify({"status":"added"}), 200
            else:
                return jsonify({"status":"error"}), 500
    else:
        inserted = db.recent.insert_one({"user":chef, "dishes":[new_dish]})
        if inserted:
            return jsonify({"status":"added"}), 200
        else:
            return jsonify({"status":"error"}), 500

# ==============================================================================================================================================

# Sebin Model :
# API Route for recipe recommendation by query
from models import recommend_dishes, recommend_recipes_by_review

@app.route('/query_recommend', methods=['POST'])
def query_recommend():
    
    try:
        query = request.json.get('query')
        if not query:
            return jsonify({'error': 'Query not provided'}), 400
        
        recommendations = recommend_dishes(query)
        query_result = recommendations.to_dict(orient='records')
        return jsonify(query_result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/recommend_dishes", methods = ["POST"])
def recommend():
    query = request.json.get("query")
    if not query:
        return jsonify({"error":"Query not provided"})
    return json_util.dumps(list(db.Dish.find({'dish_name': {"$regex":query}})))
    
# API Route for recipe recommendation by feedback

@app.route('/feedback_recommend', methods=['POST'])
def feedback_recommend():
    try:
        user_review = request.json.get('review')
        if not user_review:
            return jsonify({'error':'Feedback not found'}), 400
        
        recommendations = recommend_recipes_by_review(user_review)
        feed_result = recommendations.to_dict(orient='records')
        return jsonify(feed_result), 200
    
    except Exception as e :
        return jsonify({'error': str(e)}), 500
# ==============================================================================================================================================
  
# Abhishek Code
#To store feedbacks into  Feedback db
@app.route("/create_feedback", methods=["POST"])
def post_feedback():
    try:
        data = request.get_json()
        feedback = data.get('feedback')
        user_id = data.get('user_id')
        dish = data.get('dish')
        print({
            'user':user_id,
            'feedback':feedback,
            'dish':dish
        })
        db.Feedbacks.insert_one({
            'user':user_id,
            'feedback':feedback,
            'dish':dish
        })
        print(list(db.Feedbacks.find({})))
        return jsonify({'status':"success"}), 200
    except Exception as e:
        return jsonify({'message' : f'Something went wrong {str(e)}'}), 500

#To get feedbacked dishes 
@app.route("/get_feedback_dishes", methods=['GET', 'POST'])
def get_feedback_dishes():
    try:
        data = request.get_json()
        user = data.get('user')
        dishes = [i['dish'] for i in db.feedbacks.find({'user':user})]
        return jsonify({"dishes":dishes}), 200
    except Exception as e:
        return jsonify({"message" : f"Something went wrong {str(e)}"}), 500


#  ========================================================================================================================================


# Raj Code :
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np
import uuid

data = {
    'dish_name': ['Pasta Carbonara', 'Chicken Curry', 'Caesar Salad', 'Beef Stir Fry'],
    'ingredients': [
        '400g spaghetti, 150g pancetta, 4 eggs, 50g Pecorino Romano, 50g Parmesan',
        '500g chicken breast, 2 tbsp yogurt, 1 tsp turmeric, 1 tsp garam masala, 1 onion, 3 garlic cloves, 1 tbsp ginger, 2 tbsp curry powder, 400ml coconut milk, 200ml chicken stock',
        '2 heads romaine lettuce, 1 egg yolk, 2 garlic cloves, 2 tsp Dijon mustard, 2 tsp Worcestershire sauce, 1 lemon, 1/2 tsp anchovy paste, 1/2 cup olive oil, 1 cup croutons, 1/2 cup Parmesan, 2 chicken breasts',
        '500g beef sirloin, 2 tbsp soy sauce, 1 tbsp oyster sauce, 1 tsp sesame oil, 2 tbsp vegetable oil, 2 garlic cloves, 1 tbsp ginger, 1 bell pepper, 1 onion, 1 cup broccoli, 1 cup snap peas, 1/4 cup chicken stock, 1 tbsp cornstarch'
    ]
}

df = pd.DataFrame(data)


class RecipeModel:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = None
        self.is_trained = False

    def train(self, dish_names):
        self.tfidf_matrix = self.vectorizer.fit_transform(dish_names)
        self.is_trained = True

    def find_closest_recipes(self, query, num_recipes=3):
        if not self.is_trained:
            return None
        query_vec = self.vectorizer.transform([query])
        similarities = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
        top_indices = similarities.argsort()[-num_recipes:][::-1]
        return top_indices


recipe_model = RecipeModel()
recipe_model.train(df['dish_name'])
    

#chatgpt-like
@app.route('/generate_recipes', methods=['POST'])
def generate_recipes():
    try:
        data = request.json
        query = data.get('query')
        if not query:
            return jsonify({'error': 'No query provided'}), 400

        closest_indices = recipe_model.find_closest_recipes(query)
        if closest_indices is None:
            return jsonify({'error': 'Model not trained'}), 500

        recipes = []
        for index in closest_indices:
            recipe = {
                'id': str(uuid.uuid4()),  # Generate a unique ID for each recipe
                'dish_name': df.loc[index, 'dish_name'],
                'ingredients': df.loc[index, 'ingredients']
            }
            recipes.append(recipe)

        return jsonify({'recipes': recipes})
    except Exception as e:
        app.logger.error(f"Error generating recipes: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500


# sidebar history
@app.route('/api/dish_history', methods=['GET', 'POST'])
def get_dish_history():
    try:
        # Test database connection
        if db.command('ping'):
            print("Pinged your deployment. You successfully connected to MongoDB!")
        else:
            return jsonify({"error": "Failed to connect to MongoDB"}), 500

        dishes_cursor = dishes.find().sort("date", -1).limit(5)
        dishes_list = json.loads(json_util.dumps(dishes_cursor))

        if not dishes_list:
            print("No dishes found in the database")
            return jsonify({"dishes": []}), 200

        for dish in dishes_list:
            if 'date' in dish and '$date' in dish['date']:
                dish['date'] = dish['date']['$date'][:10]
            else:
                dish['date'] = 'Unknown'

        return jsonify({"dishes": dishes_list})
    except Exception as e:
        app.logger.error(f"An error occurred: {str(e)}")
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


# genrated recipes
@app.route('/start-process', methods=['POST'])
def start_process():
    try:
        data = request.json
        print(data)
        return jsonify({"message": "Process started successfully"}), 200

    except Exception as e:
        print(f"Error starting process: {str(e)}")
        return jsonify({"error": "Something went wrong"}), 500

# ==========================================================================================================================================

#arnab code
@app.route('/dishes', methods=['GET'])
def get_dishes():
    dishes = db.Actual_dish.find({}, {'_id': 0})
    return jsonify([dish for dish in dishes])


@app.route('/name/<id>', methods=['GET'])
def get_details(id):
    details = db.Actual_dish.find_one({'id': id}, {'_id': 0, 'dish_name': 1})
    return jsonify(details)

@app.route('/dish', methods=['POST'])
def get_dish_by_name():
    data = request.json
    dish_name = data.get('dish_name')

    if not dish_name:
        return jsonify({"error": "Dish name not provided"}), 400

    dish = db.Actual_dish.find_one({'dish_name': dish_name}, {'_id': 0})

    if dish:
        return jsonify(dish)
    else:
        return jsonify({"error": "Dish not found"}), 404
    
@app.route('/dishes/<id>/ingredients', methods=['GET'])
def get_ingredients(id):
    dish = db.Actual_dish.find_one({'id': id})
    if dish:
        id = dish.get('id')
        cuisine = dish.get('Cuisine')
        name = dish.get('dish_name')
        image = dish.get('image')
        description = dish.get('description')
        type = dish.get('veg_non_veg')
        time = dish.get('cooking_time')
        ingredients = dish.get('ingredients', [])  # Replace 'ingredients' with your actual field name
        equipments = dish.get('kitchen_equipments', [])
        return jsonify({
            "ingredients": ingredients,
            "equipments": equipments,
            "Cuisine": cuisine,
            "name": name,
            "image": image,
            "description": description,
            "type": type,
            "time": time,
            "id": id
        })
    else:
        return jsonify({"error": "Dish not found"}), 404


@app.route('/recipes/<id>', methods=['GET'])
def get_recipe(id):
    dish = db.receipe.find_one({'id': id})
    if dish:
        return jsonify(dish['recipeSteps'])
    else:
        return jsonify({"error": "Recipe not found"}), 404



@app.route('/dishes/state', methods=['POST'])
def get_states():
    data = request.json
    state = data.get('state')
    cursor = db['Dish'].find({"popularity_state": state}, {"_id": 0})
    # Convert cursor to a list of dictionaries
    dishes = list(cursor)
    return jsonify(dishes)


def validate_feedback_data(data):
    """Validate the feedback form data"""
    required_fields = ['email', 'overallRating', 'message']
    
    for field in required_fields:
        if field not in data or not data[field]:
            return False, f"Missing required field: {field}"
            
    if not isinstance(data['overallRating'], (int, float)) or not (0 <= data['overallRating'] <= 5):
        return False, "Invalid overall rating"
        
    return True, None


@app.route('/dish-feedback', methods=['POST'])
def submit_feedback():
    try:
        data = request.json
        
        # Validate the incoming data
        is_valid, error_message = validate_feedback_data(data)
        if not is_valid:
            return jsonify({"error": error_message}), 400
            
        # Add timestamp to the feedback
        feedback_document = {
            "email": data["email"],
            "reviewType": data.get("reviewType", ""),
            "overallRating": data["overallRating"],
            "difficultyLevel": data.get("difficultyLevel", ""),
            "cookingTime": data.get("cookingTime", ""),
            "tasteRating": data.get("tasteRating", 0),
            "presentationRating": data.get("presentationRating", 0),
            "followedInstructions": data.get("followedInstructions", True),
            "madeModifications": data.get("madeModifications", False),
            "modifications": data.get("modifications", ""),
            "wouldMakeAgain": data.get("wouldMakeAgain", ""),
            "message": data["message"],
            "suggestedImprovements": data.get("suggestedImprovements", ""),
            "photoUrl": data.get("photoUrl", ""),
            "createdAt": datetime.utcnow()
        }
        
        # Insert the feedback into MongoDB
        result = db.Feedback.insert_one(feedback_document)
        
        if result.inserted_id:
            return jsonify({"message": "Message added successfully", "id": str(result.inserted_id)}), 201
        else:
            return jsonify({"error": "Failed to save feedback"}), 500
            
    except Exception as e:
        app.logger.error(f"Error submitting feedback: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/steps/<id>', methods=['GET'])
def get_steps(id):
    dish = db.receipe.find_one({'id': id})
    if dish:
        return jsonify(dish['recipeSteps'])
    else:
        return jsonify({"error": "Recipe not found"}), 404


def remove_emojis(text):
    """
    Removes emojis and special characters from a string.
    """
    emoji_pattern = re.compile(
        "["
        "\U0001F600-\U0001F64F"  # Emoticons
        "\U0001F300-\U0001F5FF"  # Symbols & Pictographs
        "\U0001F680-\U0001F6FF"  # Transport & Map Symbols
        "\U0001F1E0-\U0001F1FF"  # Flags (iOS)
        "\U00002702-\U000027B0"  # Other Miscellaneous Symbols
        "\U000024C2-\U0001F251"  # Enclosed Characters
        "]+",
        flags=re.UNICODE,
    )
    return emoji_pattern.sub(r"", text).strip()

@app.route('/api/compare-ingredients', methods=['POST'])
def compare_ingredients():
    # Get user-provided ingredients and clean them
    data = request.json
    user_ingredients = set(
        remove_emojis(ing).lower() for ing in data.get("ingredients", [])
    )

    matching_recipes = db.Actual_dish.find()

    result = []
    for recipe in matching_recipes:
        recipe_ingredients = set()
        for ing in recipe.get("ingredients", []):
            if isinstance(ing, dict) and "name" in ing:
                recipe_ingredients.add(remove_emojis(ing["name"]).lower())
            elif isinstance(ing, str):
                recipe_ingredients.add(remove_emojis(ing).lower())

        if user_ingredients & recipe_ingredients:
            result.append({
                "dish_name": recipe.get("dish_name"),
                "ingredients": [ing.get("name", ing) if isinstance(ing, dict) else ing for ing in recipe.get("ingredients", [])],
                "image": recipe.get("image"),
                "description": recipe.get("description"),
                "popularity_state": recipe.get("popularity_state"),
            })

    return jsonify(result), 200


@app.route('/api/ingredient-suggestions', methods=['GET'])
def ingredient_suggestions():
    query = request.args.get('q', '').strip().lower()  # Get the query parameter
    if not query:
        return jsonify([])  # If the query is empty, return an empty list
    
    suggest_recipes = db.Actual_dish.find()
    all_ingredients = set()
    
    for recipe in suggest_recipes:
        if 'ingredients' in recipe:  # Check if the recipe contains ingredients
            for ingredient in recipe['ingredients']:
                if isinstance(ingredient, dict) and 'name' in ingredient:
                    ingredient_name = remove_emojis(ingredient['name']).lower()
                elif isinstance(ingredient, str):
                    ingredient_name = remove_emojis(ingredient).lower()
                else:
                    continue
                
                all_ingredients.add(ingredient_name)

    suggestions = [ingredient for ingredient in all_ingredients if ingredient.startswith(query)]
    return jsonify(suggestions), 200


@app.route('/upload', methods=['POST'])
def upload_video():
    try:
        # Get dish ID and step index from the form data
        dish_id = request.form.get('dishId')
        step_index = int(request.form.get('stepIndex'))
        print(dish_id, step_index)
        print(request.files['video'])

        # Get the uploaded file from the request
        if 'video' not in request.files:
            return jsonify({'error': 'No video file part in the request'}), 400

        file = request.files['video']

        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        if file:
            filename = secure_filename(file.filename)
            dish_name = db.receipe.find_one({'id': dish_id})['name']
            folder_path = f"{dish_name}/"

            # Upload file to Firebase Storage
            blob = bucket.blob(f"{folder_path}{filename}")
            blob.upload_from_file(file)
            blob.make_public()
            video_url = blob.public_url

            # Update the MongoDB document with the new video URL
            db.receipe.update_one(
                {'id': dish_id},
                {'$set': {f'recipeSteps.{step_index}.videoSource': video_url}}
            )

            return jsonify({'message': 'Video uploaded successfully', 'video_url': video_url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.debug = True
    app.run()
