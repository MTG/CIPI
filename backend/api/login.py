import os
from typing import Optional
from google.oauth2 import id_token
from google.auth.transport import requests
from dataclasses import dataclass
from flask import request, jsonify
import functools

CLIENT_ID = os.getenv('GOOGLE_AUTH_CLIENT_ID')

@dataclass
class UserInfo:
    id: str
    email: str


def verify_credential(token) -> Optional[UserInfo]:
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        info = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        id_ = info['sub']
        email_verified = info['email_verified']
        email = info['email']

        if not email_verified:
            return None
        
        return UserInfo(id_, email)
    except ValueError as e:
        print(e)
        # Invalid token
        return None


def verify_request_credential() -> Optional[UserInfo]:
    headers = request.headers
    bearer = headers.get('Authentication', None)
    if bearer is None:
        return None
    try:
        credential = bearer.split()[1]
    except IndexError:
        return None
    if credential is None:
        return None
    return verify_credential(credential)



def with_login(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        user = verify_request_credential()
        if user is None:
            return jsonify({}), 401
        return func(*args, **kwargs, user=user)
    return wrapper
