from rest_framework import permissions
from rest_framework.request import Request

class IsUserOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to allow read-only access for any request,
    but write/edit access only to the user who owns the object.

    Assumes the model instance (`obj`) is a User instance or directly 
    represents the authenticated user.
        """
    def has_object_permission(self, request: Request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj

class IsUser(permissions.BasePermission):
    """
    View-level permission to restrict access exclusively to the user 
    whose username matches the 'username' URL keyword argument.
    """
    def has_permission(self, request, view):
        return request.user.username == view.kwargs['username']