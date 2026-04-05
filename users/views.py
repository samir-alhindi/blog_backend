from django.shortcuts import render
from rest_framework import viewsets

from .models import User
from .serializers import UserSerializer, CreateUserSerializer

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()

    def get_serializer_class(self): # type: ignore
        if self.action == 'create':
            return CreateUserSerializer
        return UserSerializer