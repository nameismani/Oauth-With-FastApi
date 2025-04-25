from pydantic import BaseModel
import os
from typing import Optional
from dotenv import load_dotenv
# from pathlib import Path
# base_dir = Path(__file__).resolve().parent.parent.parent
load_dotenv()

# print(os.getenv("GOOGLE_CLIENT_ID", ""),"sadfsdaf")

class GoogleOAuthConfig(BaseModel):
    client_id: str = os.getenv("GOOGLE_CLIENT_ID", "")
    client_secret: str = os.getenv("GOOGLE_CLIENT_SECRET", "")
    redirect_uri: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:3000/api/auth/callback/google")
    token_endpoint: str = "https://oauth2.googleapis.com/token"
    auth_endpoint: str = "https://accounts.google.com/o/oauth2/v2/auth"
    userinfo_endpoint: str = "https://www.googleapis.com/oauth2/v3/userinfo"
    scope: str = "openid email profile"

google_oauth_config = GoogleOAuthConfig()