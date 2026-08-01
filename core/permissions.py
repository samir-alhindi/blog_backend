
from rest_framework import permissions
from rest_framework.request import Request

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to allow read-only access for safe HTTP methods,
    but restrict write/edit access exclusively to the author of the object.

    Assumes the target model instance (`obj`) has an `author` attribute 
    that references the authenticated `User` model.
    """
    def has_object_permission(self, request: Request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj.author