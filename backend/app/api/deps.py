from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import settings
from app.core.database import get_db
from app.models.models import User, UserRole, Provider
from app.services import service
from typing import List

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/otp/verify")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # For now, handling both real JWT and the mock tokens seen in main.py
        if token.startswith("mock_token_"):
            phone = token.replace("mock_token_", "")
            user = await service.get_user_by_phone(db, phone)
        else:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            user_id: str = payload.get("sub")
            if user_id is None:
                raise credentials_exception
            user = await service.get_user_by_id(db, int(user_id))
            
        if user is None:
            raise credentials_exception
        return user
    except (JWTError, ValueError):
        raise credentials_exception

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

class RoleChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_active_user)):
        if user.role not in [role.value for role in self.allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="The user doesn't have enough privileges",
            )
        return user

# Specific role dependencies
get_current_provider = RoleChecker([UserRole.PROVIDER])
get_current_admin = RoleChecker([UserRole.ADMIN])
get_any_user = RoleChecker([UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN])

async def get_current_provider_profile(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> Provider:
    if current_user.role != UserRole.PROVIDER.value:
        raise HTTPException(status_code=403, detail="Not a provider")
    
    provider = await service.get_provider_by_user_id(db, current_user.id)
    if not provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    return provider
