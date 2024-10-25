# authorize.py

import os
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
CLIENT_SECRET_FILE = os.getenv('GOOGLE_CLIENT_SECRET_FILE', 'credentials.json')  # Path to credentials.json
SCOPES = [os.getenv('GOOGLE_SCOPES', 'https://www.googleapis.com/auth/gmail.send')]
TOKEN_FILE = 'token.json'

def main():
    creds = None
    # Check if token.json exists
    if os.path.exists(TOKEN_FILE):
        try:
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
            print("Credentials already exist. If you need to re-authorize, delete token.json and run again.")
            return
        except json.JSONDecodeError:
            print("token.json is corrupted or empty. Proceeding to re-authorize.")
    
    # If no valid credentials, initiate the OAuth flow
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
    creds = flow.run_local_server(port=0)  # Use run_console for command-line authorization

    # Save the credentials for future use
    with open(TOKEN_FILE, 'w') as token:
        token.write(creds.to_json())
    print("Authorization successful. token.json created.")

if __name__ == '__main__':
    main()
