import json
import os
import urllib.parse

import bson
from dotenv import load_dotenv
from flask import Flask, request, jsonify, redirect, session, url_for
from flask_cors import CORS
from flask_dance.contrib.google import make_google_blueprint, google
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from pymongo import MongoClient

load_dotenv()
from datetime import datetime, timedelta
import re

import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)

app.secret_key = os.urandom(12)

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=1)
jwt = JWTManager(app)

client = MongoClient(os.getenv('MONGODB_URL'))
db = client['AI_Chef_Master']

app.config["GOOGLE_OAUTH_CLIENT_ID"] = os.getenv('GOOGLE_OAUTH_CLIENT_ID')
app.config["GOOGLE_OAUTH_CLIENT_SECRET"] = os.getenv('GOOGLE_OAUTH_CLIENT_SECRET')

google_blueprint = make_google_blueprint(
    client_id=os.getenv('GOOGLE_OAUTH_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_OAUTH_CLIENT_SECRET'),
    redirect_to='google_callback',
    scope=["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile",
           "openid"]
)
app.register_blueprint(google_blueprint, url_prefix="/login")


@app.route("/", methods=["POST"])
def index():
    if not google.authorized:
        return redirect(url_for("google.login"))
    return redirect(url_for("google_callback"))


@app.route("/callback")
def google_callback():
    if not google.authorized:
        return jsonify({"error": "Failed to log in."}), 400
    resp = google.get("/oauth2/v1/userinfo")
    assert resp.ok, resp.text

    user_info = resp.json()
    exist_chef = db.Chef.find_one({'email': user_info['email']}, {'first_name': 1, 'user_id': 1})

    if not exist_chef:
        user_id = "Chef" + user_info['given_name'].upper() + "-" + str(round((datetime.now().timestamp()) * 1000000))
        db.Chef.insert_one({
            'first_name': user_info['given_name'],
            'last_name': user_info['family_name'],
            'email': user_info['email'],
            'user_id': user_id
        })
    else:
        user_id = exist_chef['user_id']

    user_info['user_id'] = user_id
    token = create_access_token(identity=user_info['email'])
    user_info['access_token'] = token
    user_info_str = urllib.parse.quote(json.dumps(user_info))

    return redirect(f"{os.getenv('FRONTEND_URL')}/login?data={user_info_str}", code=302)


@app.route('/chef/signup', methods=['POST'])
def sign_up():
    if request.method == 'POST':
        data = request.get_json()

        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        password_repeat = data.get('password_repeat')

        exist_chef = db.Chef.find_one({'email': email}, {'first_name': 1, 'user_id': 1})

        if exist_chef:
            return jsonify({"message": "User Already registered"}), 409
        if password != password_repeat:
            return jsonify({'message': 'Password not match'})

        user_id = "Chef" + first_name.upper() + "-" + str(round((datetime.now().timestamp()) * 1000000))

        db.Chef.insert_one({
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': password,
            'user_id': user_id
        })

        return jsonify({'message': 'SignUp Successful'}), 201


# @app.route('/chef/login', methods=['POST'])
# def login():
#     if request.method == 'POST':
#         data = request.get_json()
#
#         email = data.get('email')
#         password = data.get('password')
#         session['email'] = email
#
#         login_user = db.Chef.find_one({'email': email, 'password': password})
#         if login_user:
#             access_token = create_access_token(identity=email)
#
#             login_user = db.Chef.find_one({'email': email}, {'first_name': 1, 'last_name': 1, 'user_id': 1})
#
#             kname = login_user['first_name'] + " " + login_user['last_name']
#             user_id = login_user['user_id']
#             session['is_login'] = True
#             return jsonify(message='Login Successful', access_token=access_token, email=email, name=kname,
#                            user_id=user_id)
#         else:
#             return jsonify({'message': 'Invalid email and password'}), 401


@app.route('/chef/checkDishExists', methods=['GET'])
def check_dish_exists():
    dish_name = request.args.get('name').lower()
    existing_dish = db.Dish.find_one({'dish_name': {"$regex": f'^{re.escape(dish_name)}$', "$options": "i"}})

    if existing_dish:
        return jsonify({'exists': True}), 200
    else:
        return jsonify({'exists': False}), 200


@app.route('/chef/createDish', methods=['POST'])
@jwt_required()
def create_dish():
    user_info = get_jwt_identity()
    login_user = db.Chef.find_one({'email': user_info}, {'first_name': 1, 'last_name': 1})
    kname = login_user['first_name'] + " " + login_user['last_name']

    temp = request.get_json()
    dish_name = temp['name'].lower()

    existing_dish = db.Dish.find_one({'dish_name': {"$regex": f'^{re.escape(dish_name)}$', "$options": "i"}})

    if existing_dish:
        return jsonify({'error': 'Dish already exists with the same name'}), 400

    formatted_time = datetime.now().strftime("%H:%M:%S")
    formatted_date = datetime.now().strftime("%Y-%m-%d")

    db.Dish.insert_one({
        "created_by": kname,
        "ingredients": temp['ingredients'],
        "instructions": temp.get('instructions'),
        "description": temp.get('description'),
        "dish_name": temp['name'],
        "veg_non_veg": temp['veg_non_veg'],
        "popularity_state": temp['popularity_state'],
        "Cuisine": temp['cuisine'],
        "cooking_time": temp['cooking_time'],
        "kitchen_equipments": temp['kitchen_equipments'],
        "courses": temp['courses'],
        "Created_date": formatted_date,
        "Created_time": formatted_time,
        "email": user_info
    })

    return jsonify({'message': 'Dish Saved Successfully'}), 201


@app.route('/myAccount', methods=['GET'])
@jwt_required()
def myAccount():
    user_info = get_jwt_identity()
    login_user = db.Chef.find_one({'email': user_info}, {'first_name': 1, 'last_name': 1})
    name = login_user['first_name'] + " " + login_user['last_name']

    All_dis = db.Dish.find({'email': user_info})
    output3 = []
    for dish in All_dis:
        dish_data = {
            "id": str(dish['_id']),
            "name": dish['dish_name'],
            "cuisine": dish['Cuisine'],
            "veg_non": dish['veg_non_veg'],
            "course_type": dish['courses'],
            "created_date": dish['Created_date'],
            "created_time": dish['Created_time'],
            "description": dish['description'],
            "cooking_time": dish["cooking_time"],
            "popularity_state": dish["popularity_state"]
        }
        output3.append(dish_data)

    return jsonify(output3)


@app.route('/api/search', methods=['GET', 'POST'])
def search():
    query = request.get_json()
    sea = query
    final = sea["query"].lower()
    All_dishes = db.Dish.find({"dish_name": {"$regex": final, "$options": "i"}})
    output = []
    found_dishes = set()
    for dish in All_dishes:
        ingredients = dish['ingredients']
        ingredients_lower = [ing['name'].lower() for ing in ingredients]
        if (dish['dish_name'], tuple(ingredients_lower)) not in found_dishes:
            dish1 = {
                "name": dish['dish_name'],
                "cuisine": dish['Cuisine'],
                "veg_non_veg": dish['veg_non_veg'],
                "courses": dish['courses'],
                "created_date": dish['Created_date'],
                "created_time": dish['Created_time'],
                "created_by": dish['created_by'],
                "description": dish['description'],
                "cooking_time": dish["cooking_time"],
                "kitchen_equipments": dish["kitchen_equipments"],
                "popularity_state": dish["popularity_state"],
                "ingredients": dish['ingredients'],
                "instructions": dish['instructions'],
            }
            output.append(dish1)
            found_dishes.add((dish['dish_name'], tuple(ingredients_lower)))
    return jsonify(output)


@app.route('/api/dish/<id>', methods=['GET'])
@jwt_required()
def filter_by_id(id):
    dish = db.Dish.find_one({'_id': bson.ObjectId(oid=id)})

    dish_data = {
        "name": dish['dish_name'],
        "cuisine": dish['Cuisine'],
        "veg_non_veg": dish['veg_non_veg'],
        "courses": dish['courses'],
        "created_date": dish['Created_date'],
        "created_time": dish['Created_time'],
        "description": dish['description'],
        "cooking_time": dish["cooking_time"],
        "ingredients": dish['ingredients'],
        "instructions": dish['instructions'],
        "kitchen_equipments": dish["kitchen_equipments"],
        "popularity_state": dish["popularity_state"]
    }
    return dish_data


@app.route('/show')
@jwt_required()
def show():
    user_info = get_jwt_identity()
    login_user = db.Chef.find_one({'email': user_info}, {'first_name': 1, 'last_name': 1})
    name = login_user['first_name'] + " " + login_user['last_name']
    return jsonify({'name': name, 'email': user_info})


@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    name = data['name']
    message = data['message']

    db.Contact.insert_one({'name': name, 'message': message})

    return jsonify({"message": "Message submitted successfully"}), 201


@app.route('/dishes', methods=['GET'])
def get_dishes():
    dishes = db.Dish.find({}, {'_id': 0})
    return jsonify([dish for dish in dishes])


@app.route('/name/<id>', methods=['GET'])
def get_details(id):
    details = db.Dish.find_one({'id': id}, {'_id': 0, 'dish_name': 1})
    return jsonify(details)


@app.route('/dishes/<id>/ingredients', methods=['GET'])
def get_ingredients(id):
    dish = db.Dish.find_one({'id': id})
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
    print(data)
    state = data.get('state')
    print(state)
    cursor = db['Dish'].find({"popularity_state": state}, {"_id": 0})
    # Convert cursor to a list of dictionaries
    dishes = list(cursor)
    print(dishes)
    return jsonify(dishes)


@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.json
    db.Feedback.insert_one({
        "email": data.get('email'),
        "message": data.get('message'),
        "reaction": data.get('reaction')
    })
    return jsonify({'message': 'Message added successfully'}), 201


@app.route('/steps/<id>', methods=['GET'])
def get_steps(id):
    dish = db.receipe.find_one({'id': id})
    print(dish)
    if dish:
        return jsonify(dish['recipeSteps'])
    else:
        return jsonify({"error": "Recipe not found"}), 404


# Raj Code

EMAIL_USER = os.getenv('EMAIL_USER')
EMAIL_PASS = os.getenv('EMAIL_PASS')

otp_store = {}
email_verified_store = {}


def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp_email(email, otp):
    msg = MIMEMultipart()
    msg['From'] = EMAIL_USER
    msg['To'] = email
    msg['Subject'] = "Login OTP for 2-Step Verification"

    body = f"Your OTP for login is: {otp}"
    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(EMAIL_USER, EMAIL_PASS)
    text = msg.as_string()
    server.sendmail(EMAIL_USER, email, text)
    server.quit()


@app.route('/chef/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify(message='Email is required'), 400

    # Check if user exists
    user = db.Chef.find_one({'email': email})
    if not user:
        return jsonify(message='User not found'), 404

    # Generate and send OTP
    otp = generate_otp()
    otp_store[email] = otp
    try:
        send_otp_email(email, otp)
        return jsonify(message='OTP sent successfully'), 200
    except Exception as e:
        print(f"Error sending OTP: {str(e)}")
        return jsonify(message='Failed to send OTP. Please try again.'), 500


@app.route('/chef/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')

    if not email or not otp:
        return jsonify(message='Email and OTP are required'), 400

    stored_otp = otp_store.get(email)
    if not stored_otp or stored_otp != otp:
        return jsonify(message='Invalid OTP'), 401

    # OTP is valid
    otp_store.pop(email, None)

    email_verified_store[email] = True

    return jsonify(message='Email verified successfully'), 200


@app.route('/chef/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify(message='Email and password are required'), 400

    login_user = db.Chef.find_one({'email': email, 'password': password})
    if not login_user:
        return jsonify(message='Invalid email or password'), 401

    # Check if email is verified using local storage
    if not email_verified_store.get(email, False):
        return jsonify(message='Email not verified. Please verify your email first.'), 403
    else:
        email_verified_store[email] = False

    # Created access token
    access_token = create_access_token(identity=email)

    # Set session data
    session.permanent = True
    session['is_login'] = True
    session['email'] = email
    session['login_time'] = datetime.utcnow().isoformat()

    return jsonify(
        message='Login Successful',
        access_token=access_token,
        email=email,
    ), 200


@app.route('/chef/check-session', methods=['GET'])
@jwt_required()
def check_session():
    current_user = get_jwt_identity()
    if 'email' in session and session['email'] == current_user:
        login_time = datetime.fromisoformat(session['login_time'])
        current_time = datetime.utcnow()
        time_elapsed = current_time - login_time

        if time_elapsed < timedelta(hours=1):
            return jsonify(message='Session is valid', email=current_user), 200
        else:
            session.clear()
            return jsonify(message='Session has expired'), 401
    else:
        return jsonify(message='No active session'), 401


@app.route('/chef/logout', methods=['POST'])
@jwt_required()
def logout():
    session.clear()
    return jsonify(message='Logged out successfully'), 200


if __name__ == '__main__':
    app.debug = True
    app.run()
