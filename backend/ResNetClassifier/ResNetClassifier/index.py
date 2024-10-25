from flask import Flask, request, jsonify, send_file
import bcrypt
import mariadb
import time
from flask_cors import CORS
import boto3
import logging
import os
import subprocess
import sys

import json
import base64
import random
from email.mime.text import MIMEText
from dotenv import load_dotenv

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build



# Configure logging
logging.basicConfig(level=logging.DEBUG)

load_dotenv()


app = Flask(__name__)
CORS(app)

# Configuration
CLIENT_SECRET_FILE = os.getenv('GOOGLE_CLIENT_SECRET_FILE')  # Path to credentials.json
SCOPES = [os.getenv('GOOGLE_SCOPES')]
TOKEN_FILE = 'token.json'
SENDER_EMAIL = os.getenv('SENDER_EMAIL')

verification_codes = {}


# Connect to MariaDB
try:
    db = mariadb.connect(
        host="43.201.250.98",  # EC2 instance IP
        user="root",
        password="iskendir2001",
        database="mywebsite",
        autocommit=True,  # Enable autocommit for write operations
    )
    cursor = db.cursor()

except mariadb.Error as e:
    print(f"Error connecting to MariaDB: {e}")
    exit(1)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    uid = data.get('anonymousUserId')  # Get the anonymous user's uid
    username = data.get('username')
    password = data.get('password')

    if not uid or not username or not password:
        return jsonify({'message': 'Please provide a uid, username, and password'}), 400

    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    # Check if the anonymous user exists in the database
    try:
        query = "SELECT uid FROM users WHERE uid = %s"
        cursor.execute(query, (uid,))
        result = cursor.fetchone()

        if not result:
            return jsonify({'message': 'Anonymous user not found'}), 404

        # Update the anonymous user row with username and password
        query = "UPDATE users SET username = %s, password = %s WHERE uid = %s"
        cursor.execute(query, (username, hashed_password.decode('utf-8'), uid))
        return jsonify({'message': 'User registered successfully', 'uid': uid}), 200
    except mariadb.Error as err:
        return jsonify({'message': f'Error: {err}'}), 500



@app.route('/registeranon', methods=['POST'])
def registeranon():
    # Generate a unique ID for the anonymous user
    uid = f'{int(time.time())}'  # Simple unique ID generation

    # Insert the anonymous user into the database
    try:
        query = "INSERT INTO users (uid) VALUES (%s)"
        cursor.execute(query, (uid,))
        return jsonify({'message': 'Anonymous user registered successfully', 'uid': uid}), 201
    except mariadb.Error as err:
        return jsonify({'message': f'Error: {err}'}), 500

s3 = boto3.client('s3', 
                  aws_access_key_id='AKIAXYKJT5UOFBCUVY2B', 
                  aws_secret_access_key='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', 
                  region_name='eu-north-1')

BUCKET_NAME = 'coup'

def get_username_from_uid(uid):
    try:
        query = "SELECT username FROM users WHERE uid = %s"  # Adjust table and column names as needed
        cursor.execute(query, (uid,))
        result = cursor.fetchone()
        # Check if a result was found
        return result is not None and result[0] is not None  # Returns True if username exists, otherwise False
    except Exception as e:
        app.logger.error(f"Error: {e}")  # Log the error
        return False  # Return False in case of an error


@app.route('/upload', methods=['POST'])
def upload_file():
    uid = request.form.get('uid')
    file = request.files.get('file')

    if not file:
        return jsonify({'message': 'No file provided'}), 400

    tmp_dir = '/tmp'
    if not os.path.exists(tmp_dir):
        os.makedirs(tmp_dir)

    file_path = os.path.join(tmp_dir, file.filename)
    file.save(file_path)

    output_dir = os.path.join(tmp_dir, f'{uid}_output')

    try:
        # Step 1: Run predict.py on the uploaded file
        script_path = os.path.join(os.getcwd(), 'predict.py')
        subprocess.run([sys.executable, script_path, file_path, output_dir], check=True)

        # Step 2: Collect image URLs
        images = []
        for img_file in os.listdir(output_dir):
            if img_file.endswith('.png'):  # Adjust if other formats are used
                img_path = os.path.join(output_dir, img_file)
                # Generate the image URL
                image_url = f"http://43.201.250.98/get_image?path={img_file}&uid={uid}"
                images.append(image_url)

            if get_username_from_uid(uid):
                folder_name = f'images/{uid}/'  # Define the S3 folder path
                image_file_name = os.path.basename(img_file)
                with open(os.path.join(output_dir, image_file_name), 'rb') as img_file:
                    s3.upload_fileobj(img_file, BUCKET_NAME, folder_name + image_file_name)

                # Step 4: Store the S3 URL for the folder in the database
                folder_url = f"https://{BUCKET_NAME}.s3.eu-north-1.amazonaws.com/{folder_name}"
                query = "UPDATE users SET s3_url = %s WHERE uid = %s"
                cursor.execute(query, (folder_url, uid))

        return jsonify({'message': 'File processed successfully', 'images': images}), 201

    except Exception as e:
        app.logger.error(f"Error processing file: {e}")
        return jsonify({'message': f'Error: {e}'}), 500
    finally:
        # Cleanup: Remove the local file after processing
        if os.path.exists(file_path):
            os.remove(file_path)

@app.route('/get_image', methods=['GET'])
def get_image():
    uid = request.args.get('uid')
    img_name = request.args.get('path')

    if not img_name:
        return jsonify({'message': 'Image not found'}), 404

    # Define the output directory for images
    output_dir = os.path.join('/tmp', f'{uid}_output')
    img_path = os.path.join(output_dir, img_name)

    if os.path.exists(img_path):
        return send_file(img_path, mimetype='image/png')

    else:
        return jsonify({'message': 'Image not found'}), 404


def generate_verification_code(length=6):
    """Generate a random numeric verification code."""
    return ''.join(random.choices('0123456789', k=length))

def get_gmail_service():
    """Authenticate and return the Gmail API service."""
    creds = None
    # Check if token.json exists
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    # If no valid credentials, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
    service = build('gmail', 'v1', credentials=creds)
    return service

def send_verification_email(recipient_email, verification_code):
    """Send a verification email using Gmail API."""
    service = get_gmail_service()
    
    subject = "Your Verification Code"
    body = f"Your verification code is: {verification_code}"
    
    message = MIMEText(body)
    message['to'] = recipient_email
    message['from'] = SENDER_EMAIL
    message['subject'] = subject
    
    # Encode the message
    encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
    
    create_message = {
        'raw': encoded_message
    }
    
    try:
        # Send the email
        send_message = service.users().messages().send(userId="me", body=create_message).execute()
        print(f"Message Id: {send_message['id']}")
        print("Verification email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

@app.route('/send-verification', methods=['POST'])
def send_verification():
    data = request.get_json()
    email = data.get('email')

    if email:
        verification_code = generate_verification_code()
        timestamp = time.time()  # Store the current timestamp

        # Store the code with a timestamp
        verification_codes[email] = {'code': verification_code, 'timestamp': timestamp}

        # Send verification email
        send_verification_email(email, verification_code)

        return jsonify({'message': 'Verification email sent successfully!'}), 200
    else:
        return jsonify({'error': 'Email is required'}), 400

@app.route('/verify-code', methods=['POST'])
def verify_code():
    data = request.get_json()
    email = data.get('email')
    code = data.get('code')

    if email and code:
        entry = verification_codes.get(email)

        if entry:
            # Check if the code is older than 1 minute
            current_time = time.time()
            if current_time - entry['timestamp'] > 60:  # 60 seconds timeout
                return jsonify({'error': 'Verification code expired'}), 400

            # Check if the code matches
            if entry['code'] == code:
                return jsonify({'message': 'Verification successful!'}), 200
            else:
                return jsonify({'error': 'Invalid code'}), 400
        else:
            return jsonify({'error': 'No verification code found for this email'}), 400
    else:
        return jsonify({'error': 'Email and code are required'}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True, threads=4)