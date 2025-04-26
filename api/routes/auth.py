from fastapi import APIRouter, HTTPException, Depends, Header, status
from fastapi.responses import JSONResponse
from config.oauth import google_oauth_config
from helpers.jwt import create_access_token, verify_token
# from app.db.collections import users_collection
from typing import Optional, Dict, Any
import httpx
from datetime import datetime, timezone
# from bson import ObjectId

router = APIRouter()

@router.get("/auth/google/url")
async def get_google_auth_url():
    """
    Generate the Google OAuth URL for the frontend to redirect to
    """
    auth_url = (
        f"{google_oauth_config.auth_endpoint}"
        f"?client_id={google_oauth_config.client_id}"
        f"&redirect_uri={google_oauth_config.redirect_uri}"
        f"&response_type=code"
        f"&scope={google_oauth_config.scope}"
        f"&access_type=offline"
    
    )
    
    return {"url": auth_url}

from pydantic import BaseModel
class CallBackRequestData(BaseModel):
   code: str


@router.post("/auth/google/callback")
async def google_auth_callback(data: CallBackRequestData):
    """
    Handle the Google OAuth callback with the authorization code
    """
  
    try:
        # Exchange the authorization code for tokens
        token_data = {
            "client_id": google_oauth_config.client_id,
            "client_secret": google_oauth_config.client_secret,
            "code": data.code,
            "grant_type": "authorization_code",
            "redirect_uri": google_oauth_config.redirect_uri
        }
  
        async with httpx.AsyncClient() as client:
            # Get tokens from Google
            token_response = await client.post(
                google_oauth_config.token_endpoint, 
                data=token_data
            )
         
            if token_response.status_code != 200:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"success": False, "message": "Failed to exchange authorization code"}
                )
                
            tokens = token_response.json()
            
            # Get user info with the access token
            user_response = await client.get(
                google_oauth_config.userinfo_endpoint,
                headers={"Authorization": f"Bearer {tokens['access_token']}"}
            )
            
            if user_response.status_code != 200:
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"success": False, "message": "Failed to get user info"}
                )
                
            user_info = user_response.json()
            print(user_info,"sadfsafd")
            # Check if user exists in database
            # existing_user = users_collection.find_one({"email": user_info["email"]})
            
            # if existing_user:
            #     # Update existing user
            #     users_collection.update_one(
            #         {"_id": existing_user["_id"]},
            #         {"$set": {
            #             "last_login": datetime.now(timezone.utc),
            #             "google_picture": user_info.get("picture"),
            #             "updated_at": datetime.now(timezone.utc)
            #         }}
            #     )
            #     user_id = str(existing_user["_id"])
            # else:
            #     # Create new user
            #     new_user = {
            #         "email": user_info["email"],
            #         "name": user_info.get("name"),
            #         "first_name": user_info.get("given_name"),
            #         "last_name": user_info.get("family_name"),
            #         "google_id": user_info.get("sub"),
            #         "google_picture": user_info.get("picture"),
            #         "email_verified": user_info.get("email_verified", False),
            #         "created_at": datetime.now(timezone.utc),
            #         "updated_at": datetime.now(timezone.utc),
            #         "last_login": datetime.now(timezone.utc)
            #     }
                
            #     result = users_collection.insert_one(new_user)
            #     user_id = str(result.inserted_id)
            
            # Create JWT token
            access_token = create_access_token(
                data={
                    "email": user_info["email"],
                    "name": user_info.get("name"),
                    "picture": user_info.get("picture"),
                    "provider": "google",
                    "sub": user_info.get("sub")
                }
            )
            
            return {
                "success": True,
                "access_token": access_token,
                "user": {
                    # "id": user_id,
                    "email": user_info["email"],
                    "name": user_info.get("name"),
                    "picture": user_info.get("picture")
                }
            }
            
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"success": False, "message": f"Authentication error: {str(e)}"}
        )

@router.get("/auth/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    """
    Get the current user's information from their JWT token
    """
    if not authorization or not authorization.startswith("Bearer "):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False, "message": "Not authenticated"}
        )
    
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    
    if not payload or "email" not in payload:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False, "message": "Invalid or expired token"}
        )
    
    # user_id = payload["sub"]
    # user = users_collection.find_one({"_id": ObjectId(user_id)})
    
    # if not user:
    #     return JSONResponse(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         content={"success": False, "message": "User not found"}
    #     )
    
    return {
        "success": True,
        "user": {
            # "id": str(user["_id"]),
            # "email": user["email"],
            # "name": user.get("name"),
            # "picture": user.get("google_picture")
              "email": payload["email"],
            "name": payload.get("name"),
            "picture": payload.get("picture")
        }
    }