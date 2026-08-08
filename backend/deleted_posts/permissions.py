
from rest_framework import permissions

class IsAuthor(permissions.BasePermission):
    """
        Object-level permission to restrict write and read access 
        exclusively to the author of the object.

        Assumes the model instance (`obj`) has an `author` attribute 
        that references the User model.
        """
    def has_object_permission(self, request, view, obj):
        return request.user == obj.author