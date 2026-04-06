from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions

from .models import User
from .serializers import UserSerializer, CreateUserSerializer
from .permissions import IsUserOrReadOnly

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [
        IsUserOrReadOnly
    ]

    def get_serializer_class(self): # type: ignore
        if self.action == 'create':
            return CreateUserSerializer
        return UserSerializer