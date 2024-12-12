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
import uuid

app = Flask(__name__)
CORS(app, origins="*", supports_credentials=True)
app.secret_key = os.urandom(12)

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30)

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


@app.route("/")
def index():
    print('running.....')
#@app.route("/", methods=["POST"])
#def index():
#    if not google.authorized:
#        return redirect(url_for("google.login"))
#    return redirect(url_for("google_callback"))


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



@app.route('/chef/checkDishExists', methods=['GET'])
def check_dish_exists():
    dish_name = request.args.get('name').lower()
    existing_dish = db.Dish.find_one({'dish_name': {"$regex": f'^{re.escape(dish_name)}$', "$options": "i"}})

    if existing_dish:
        return jsonify({'exists': True}), 200
    else:
        return jsonify({'exists': False}), 200



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
    login_user = db.Chef.find_one({'email': user_info}, {'firstName': 1, 'lastName': 1})
    name = login_user['firstName'] + " " + login_user['lastName']
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

# OTP System
def send_otp_email(email, html_content):
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_USER
        msg['To'] = email
        msg['Subject'] = "Login OTP for 2-Step Verification"

        body = html_content
        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        text = msg.as_string()
        server.sendmail(EMAIL_USER, email, text)
        server.quit()
        return True
    except Exception as e:
        return False

def gen_ticket():
    random_string = uuid.uuid4().hex[:45]
    return f"{random_string}"

@app.route('/chef/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        userId = data.get("email")
        finder = db.Chef.find_one({"userId":userId})
        if not finder:
            return jsonify({"msg":"User not found."})
        otp = str(random.randint(111111, 1000000))
        html_content = f"""<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Chef Master - OTP Email</title>
  <style>
    body {{
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      background-color: #f6f6f6;
      color: #333;
    }}
    .email-container {{
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #ddd;
      border-radius: 10px;
      overflow: hidden;
    }}
    .email-header {{
      background-color: #FF6F61;
      color: white;
      text-align: center;
      padding: 20px;
      font-size: 24px;
      position: relative;
    }}
    .email-header img {{
      max-height: 50px;
      margin-bottom: 10px;
    }}
    .email-body {{
      padding: 20px;
      text-align: center;
    }}
    .email-body h1 {{
      font-size: 32px;
      color: #FF6F61;
      margin-bottom: 10px;
    }}
    .otp-code {{
      display: inline-block;
      font-size: 24px;
      font-weight: bold;
      background-color: #f9f9f9;
      color: #333;
      padding: 10px 20px;
      border: 1px dashed #FF6F61;
      margin: 20px 0;
    }}
    .email-body p {{
      font-size: 16px;
      color: #555;
    }}
    .email-footer {{
      background-color: #f6f6f6;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #888;
    }}
    @media (max-width: 600px) {{
      .email-container {{
        width: 100%;
        margin: 0;
        border: none;
        border-radius: 0;
      }}
      .email-header, .email-footer {{
        font-size: 18px;
      }}
    }}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <img src="https://www.aichefmaster.com/assets/logo.jpeg" alt="AI Chef Master Logo">
      <p>Secure Your Account</p>
    </div>
    <div class="email-body">
      <p>Hello {finder['firstName']},</p>
      <p>Use the following One-Time Password (OTP) to complete your process:</p>
      <div class="otp-code">{otp}</div>
      <p>This OTP is valid for 5 minutes.</p>
      <p>If you did not request this, please ignore this email or contact support.</p>
      <p>Thank you,<br>Team AI Chef Master</p>
    </div>
    <div class="email-footer">
      © 2024 AI Chef Master. All rights reserved.
    </div>
  </div>
</body>
</html>
"""
        status = send_otp_email(finder['email'], html_content)
        ticket = gen_ticket(userId)
        if db.UserOTP.count_documents({"ticket":ticket})>0:
            ticket = gen_ticket(userId)
        db.UserOTP.insert_one({"ticket":ticket, "otp":otp, "time":datetime.utcnow()})
        if status:
            return jsonify({"ticket":f"{ticket}"})
        else:
            return jsonify({"msg":"error"})
    except Exception as e:
        return jsonify({"msg":"e"+str(e)}), 500


@app.route('/chef/verify-otp', methods=['POST'])
def verify_otp():
    data = request.get_json()
    ticket = data.get('ticket')
    # Check if user exists
    ticket = db.UserOTP.find_one({'ticket': ticket})
    if not ticket:
        return jsonify(message='User not found'), 404

    real_otp = ticket.get('otp')
    data_otp = data.get('otp')

    if not ticket or not data_otp:
        return jsonify(message='OTP is required'), 400

    if not data_otp or real_otp != data_otp:
        return jsonify(message='Invalid OTP'), 401
    if real_otp == data_otp:
        return jsonify(message='Email verified successfully'), 200


@app.route('/chef/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('email')
    # Check if user exists
    user = db.Chef.find_one({'userId': username})
    if not user:
        return jsonify(message='User not found'), 404

    email = user.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify(message='Username and password are required'), 400

    login_user = db.Chef.find_one({'email': email, 'password': password})
    if not login_user:
        return jsonify(message='Invalid email or password'), 401

    # Check if email is verified using local storage
    if not email_verified_store.get(email, False):
        return jsonify(message='User not verified. Please verify your user first.'), 403
    else:
        email_verified_store[email] = False

    # Created access token
    access_token = create_access_token(identity=email)

    # Set session data
    session.permanent = True
    session['is_login'] = True
    session['email'] = email
    session['login_time'] = datetime.utcnow().isoformat()
    print("Current session data:", dict(session))

    return jsonify(
        message='Login Successful',
        access_token=access_token,
        email=email,
    ), 200

@app.route('/chef/createDish', methods=['POST'])
@jwt_required()
def create_dish():
    user_info = get_jwt_identity()

    login_user = db.Chef.find_one({'email': user_info}, {'firstName': 1, 'lastName': 1})
    if not login_user:
        return jsonify(message='User not found'), 404

    kname = login_user['firstName'] + " " + login_user['lastName']

    temp = request.get_json()
    if not temp:
        return jsonify(message='No data provided'), 400

    dish_name = temp.get('name', '').lower()
    if not dish_name:
        return jsonify(message='Dish name is required'), 400

    existing_dish = db.Dish.find_one({'dish_name': {"$regex": f'^{re.escape(dish_name)}$', "$options": "i"}})
    if existing_dish:
        return jsonify(message='Dish already exists with the same name'), 400

    formatted_time = datetime.utcnow().strftime("%H:%M:%S")
    formatted_date = datetime.utcnow().strftime("%Y-%m-%d")

    new_dish = {
        "created_by": kname,
        "ingredients": temp.get('ingredients'),
        "instructions": temp.get('instructions'),
        "description": temp.get('description'),
        "dish_name": temp.get('name'),
        "veg_non_veg": temp.get('veg_non_veg'),
        "popularity_state": temp.get('popularity_state'),
        "Cuisine": temp.get('cuisine'),
        "cooking_time": temp.get('cooking_time'),
        "kitchen_equipments": temp.get('kitchen_equipments'),
        "courses": temp.get('courses'),
        "Created_date": formatted_date,
        "Created_time": formatted_time,
        "email": user_info
    }

    result = db.Dish.insert_one(new_dish)
    if not result.inserted_id:
        return jsonify(message='Failed to save dish'), 500

    return jsonify(message='Dish Saved Successfully'), 201

@app.route('/myAccount', methods=['GET'])
@jwt_required()
def myAccount():
    user_info = get_jwt_identity()

    login_user = db.Chef.find_one({'email': user_info}, {'firstName': 1, 'lastName': 1})
    if not login_user:
        return jsonify(message='User not found'), 404

    All_dis = db.Dish.find({'email': user_info})

    dishes = [{**dish, '_id': str(dish['_id'])} for dish in All_dis]

    output3 = []
    for dish in dishes:
        dish_data = {
            "id": str(dish['_id']),
            "name": dish['dish_name'],
            "cuisine": dish['Cuisine'],
            "veg_non": dish['veg_non_veg'],
            "course_type": dish['courses'],
            "created_date": dish['Created_date'],
            "created_time": dish['Created_time'],
            "description": dish.get('description'),
            "cooking_time": dish["cooking_time"],
            "popularity_state": dish["popularity_state"]
        }
        output3.append(dish_data)

    return jsonify(dishes=output3)

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
    app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000))
