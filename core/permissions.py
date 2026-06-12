
from rest_framework import permissions
from rest_framework.request import Request

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request: Request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user == obj.author

class isMeOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.username == view.kwargs['username']